import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerLinearTools } from "./linear.js";
import { registerNotionTools } from "./notion.js";

const server = new McpServer({
  name: "spec-tool",
  version: "1.0.0",
});

// Register all tools
registerLinearTools(server);
registerNotionTools(server);

// Start server
const transport = new StdioServerTransport();
server.connect(transport);

console.error("Spec Tool MCP server started");
