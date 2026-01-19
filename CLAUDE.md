# CLAUDE.md - Spec Tool

## Project Overview

MCP server and Claude command for managing Linear tickets and validating against Notion specs.

## Quick Start

```bash
# Build MCP server
cd mcp-server && npm install && npm run build

# Add to Claude (with API keys)
claude mcp add spec-tool node /path/to/dist/index.js -e "LINEAR_API_KEY=xxx" -e "NOTION_API_KEY=xxx"

# Install command
cp command/spec.md ~/.claude/commands/

# Use
cd your-config-folder
/spec
```

## Project Structure

```
spec-tool/
├── command/spec.md       # The /spec command prompt
├── config.example.json   # Config template
└── mcp-server/
    ├── src/
    │   ├── index.ts      # MCP server entry
    │   ├── linear.ts     # Linear API tools
    │   └── notion.ts     # Notion API tools
    ├── .env              # API keys (git-ignored)
    └── dist/             # Built output
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `linear_list_issues` | List issues (filters: status, statuses[], assignee) |
| `linear_get_issue` | Get issue with comments |
| `linear_update_issue` | Update description/priority/estimate |
| `linear_add_comment` | Add comment to issue |
| `notion_get_page` | Get Notion page content |

## API Keys

- **Linear**: Settings > Account > Security & Access
- **Notion**: notion.so/my-integrations (must share pages with integration)

## Ticket Format

All Linear tickets should follow this structure:

```markdown
## Context
[Why this ticket exists]

## Specifications
1. [What needs to be done]

## Acceptance Criteria
- [ ] [How we know it's done]

---
**References**: [Links to specs, docs]
```

## Development

```bash
cd mcp-server
npm run dev    # Watch mode
npm run build  # Build
```

## Conventions

- Always fetch comments when getting a ticket (contain important context)
- Config (team ID, database ID) comes from config.json in working directory
- TICKET_SCOPE.md tracks project context + history per working directory
