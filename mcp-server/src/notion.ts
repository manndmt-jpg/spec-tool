import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@notionhq/client";
import { z } from "zod";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export function registerNotionTools(server: McpServer) {
  // Get page content
  server.tool(
    "notion_get_page",
    "Get content from a Notion page",
    {
      pageUrl: z.string().describe("Notion page URL or ID"),
    },
    async ({ pageUrl }) => {
      // Extract page ID from URL
      // Format: https://www.notion.so/Page-Title-{pageId}
      let pageId = pageUrl;

      if (pageUrl.includes("notion.so")) {
        const match = pageUrl.match(/([a-f0-9]{32}|[a-f0-9-]{36})/i);
        if (match) {
          pageId = match[1].replace(/-/g, "");
        }
      }

      try {
        // Get page metadata
        const page = await notion.pages.retrieve({ page_id: pageId });

        // Get page content (blocks)
        const blocks = await notion.blocks.children.list({
          block_id: pageId,
          page_size: 100,
        });

        // Extract text content from blocks
        const content = blocks.results
          .map((block) => {
            // @ts-expect-error - Notion SDK types are complex
            const type = block.type;
            // @ts-expect-error - accessing dynamic block type
            const data = block[type];

            if (data?.rich_text) {
              const text = data.rich_text
                .map((t: { plain_text: string }) => t.plain_text)
                .join("");

              if (type === "heading_1") return `# ${text}`;
              if (type === "heading_2") return `## ${text}`;
              if (type === "heading_3") return `### ${text}`;
              if (type === "bulleted_list_item") return `- ${text}`;
              if (type === "numbered_list_item") return `1. ${text}`;
              if (type === "to_do") {
                const checked = data.checked ? "[x]" : "[ ]";
                return `${checked} ${text}`;
              }
              return text;
            }
            return "";
          })
          .filter(Boolean)
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: pageId,
                  // @ts-expect-error - page properties vary
                  title: page.properties?.title?.title?.[0]?.plain_text || "Untitled",
                  content,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching Notion page: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
        };
      }
    }
  );
}
