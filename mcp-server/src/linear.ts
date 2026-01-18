import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LinearClient, LinearDocument, Issue } from "@linear/sdk";
import { z } from "zod";

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

export function registerLinearTools(server: McpServer) {
  // List issues for a team
  server.tool(
    "linear_list_issues",
    "List issues from a Linear team",
    {
      teamId: z.string().describe("Team ID (UUID format)"),
      first: z.number().optional().default(50).describe("Number of issues to fetch"),
      status: z.string().optional().describe("Filter by status name"),
    },
    async ({ teamId, first, status }) => {
      const team = await client.team(teamId);
      const issues = await team.issues({
        first,
        filter: status ? { state: { name: { eq: status } } } : undefined,
        orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
      });

      const nodes = await Promise.all(
        issues.nodes.map(async (issue) => ({
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          state: (await issue.state)?.name,
          priority: issue.priority,
          priorityLabel: issue.priorityLabel,
          estimate: issue.estimate,
        }))
      );

      return {
        content: [{ type: "text", text: JSON.stringify(nodes, null, 2) }],
      };
    }
  );

  // Get single issue with full details
  server.tool(
    "linear_get_issue",
    "Get a Linear issue with full details including comments",
    {
      issueId: z.string().describe("Issue ID or identifier (e.g., REN-123)"),
    },
    async ({ issueId }) => {
      let issue: Issue | undefined;

      // Check if it looks like an identifier (e.g., REN-123) vs UUID
      if (issueId.includes("-") && !issueId.match(/^[0-9a-f-]{36}$/i)) {
        // Search by identifier using search
        const results = await client.searchIssues(issueId);
        const found = results.nodes.find((i) => i.identifier === issueId);
        // Fetch full issue if found (search returns partial)
        if (found) {
          issue = await client.issue(found.id);
        }
      } else {
        // Try direct lookup by ID
        try {
          issue = await client.issue(issueId);
        } catch {
          issue = undefined;
        }
      }

      if (!issue) {
        return {
          content: [{ type: "text", text: `Issue not found: ${issueId}` }],
        };
      }

      const comments = await issue.comments();
      const state = await issue.state;
      const labels = await issue.labels();

      const result = {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description,
        state: state?.name,
        priority: issue.priority,
        priorityLabel: issue.priorityLabel,
        estimate: issue.estimate,
        labels: labels.nodes.map((l: { name: string }) => l.name),
        comments: await Promise.all(
          comments.nodes.map(async (c: { body: string; createdAt: Date; user: Promise<{ name: string } | undefined> | undefined }) => ({
            body: c.body,
            createdAt: c.createdAt,
            user: (await c.user)?.name,
          }))
        ),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Update issue
  server.tool(
    "linear_update_issue",
    "Update a Linear issue",
    {
      issueId: z.string().describe("Issue ID"),
      description: z.string().optional().describe("New description"),
      priority: z.number().optional().describe("Priority (0=None, 1=Urgent, 2=High, 3=Medium, 4=Low)"),
      estimate: z.number().optional().describe("Estimate in points"),
    },
    async ({ issueId, description, priority, estimate }) => {
      const issue = await client.issue(issueId);

      const update: Record<string, unknown> = {};
      if (description !== undefined) update.description = description;
      if (priority !== undefined) update.priority = priority;
      if (estimate !== undefined) update.estimate = estimate;

      await issue.update(update);

      return {
        content: [{ type: "text", text: `Updated issue ${issue.identifier}` }],
      };
    }
  );
}
