# Spec Tool

A Claude Code command and MCP server for managing Linear tickets and Notion specs together.

## Quick Start

**Joining an existing team?** Ask your team lead for the config repo URL, then see [Team Setup](#team-setup).

**Setting up for yourself/new team?** Follow [Full Setup](#setup) below.

---

## What It Does

**Two-way sync between tickets and specs:**

```
/spec

Work on:
1. Tickets - Manage Linear tickets
2. Specs - Manage Notion specifications
```

### Tickets Menu

| Action | Description |
|--------|-------------|
| **Refine** | Format tickets to a standard structure (Context → Specs → Acceptance Criteria). Choose detail level: minimal, standard, or extensive. |
| **Review** | View a ticket with comments, update description/priority/estimate. |
| **Validate** | Compare a ticket against its Notion spec. Find gaps, missing requirements, suggested acceptance criteria. |
| **Status** | Overview of all tickets by state (In Progress, Testing, Todo, Backlog). |
| **Summarize** | Add AI-generated summary comment to tickets. Filter by assignee, status, or label. Links to relevant Notion specs. |

### Specs Menu

| Action | Description |
|--------|-------------|
| **Browse** | List all specs in your Notion database. |
| **Review** | View a spec and find related tickets. |
| **Update** | Suggest spec improvements based on learnings from tickets. |
| **Gap Analysis** | Find tickets without specs, and specs without recent tickets. |

### Project Context

The tool creates `TICKET_SCOPE.md` in your working directory to track:
- What this project/codebase handles
- History of all ticket operations (refined, validated, reviewed)
- Related specs

This context persists across sessions and can be shared with teammates.

---

## Setup

### 1. Get API Keys

**Linear:**
1. Go to linear.app → Settings → Account → Security & Access
2. Create Personal API key

**Notion:**
1. Go to notion.so/my-integrations → Create integration
2. Share your specs database with the integration (database → ... → Connections)

### 2. Build MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 3. Install Command

```bash
cp command/spec.md ~/.claude/commands/
```

### 4. Create Config Folder

Create a folder for your project with these files:

**config.json:**
```json
{
  "linearTeamId": "your-linear-team-id",
  "notionDatabaseId": "your-notion-database-id",
  "teamName": "Your Team Name"
}
```

**.mcp.json** (for persistent MCP server config):
```json
{
  "mcpServers": {
    "spec-tool": {
      "command": "node",
      "args": ["/FULL/PATH/TO/spec-tool/mcp-server/dist/index.js"],
      "env": {
        "LINEAR_API_KEY": "lin_api_xxx",
        "NOTION_API_KEY": "ntn_xxx"
      }
    }
  }
}
```

### 5. Restart Claude Code

When you `cd` into your config folder, Claude will prompt you to approve the MCP server. Run `/spec` to start.

---

## Team Setup

**For teammates joining an existing team:**

```bash
# 1. Clone the public tool
git clone https://github.com/YOUR_ORG/spec-tool
cd spec-tool/mcp-server && npm install && npm run build

# 2. Install command
cp ../command/spec.md ~/.claude/commands/

# 3. Clone your team's config repo
cd ~
git clone https://github.com/YOUR_ORG/your-team-config
cd your-team-config

# 4. Create .mcp.json from template
cp .mcp.json.example .mcp.json
# Edit .mcp.json with your API keys

# 5. Restart Claude Code, then:
/spec
```

---

## Team Admin: Creating a Config Repo

For teams, create a **private repo** with your config:

```
your-team-config/
├── config.json         # Team's Linear/Notion IDs
├── .mcp.json           # MCP server config (gitignored - contains keys)
├── .mcp.json.example   # Template for teammates
├── .gitignore          # Ignores .mcp.json
├── TICKET_SCOPE.md     # Shared history (created by /spec)
└── README.md           # Team setup notes
```

**.gitignore should contain:**
```
.mcp.json
.env
```

Teammates clone this repo and run `/spec` from there. Commit `TICKET_SCOPE.md` to share context.

---

## Finding Your IDs

**Linear Team ID:**
- Team Settings → URL shows: `linear.app/team/TEAM_ID/settings`

**Notion Database ID:**
- Open database → URL shows: `notion.so/WORKSPACE/DATABASE_ID?v=...`
- Copy the 32-character ID before `?v=`

---

## Ticket Format

Refined tickets follow this structure:

```markdown
## Context
[Why this ticket exists - 1-3 sentences]

## Specifications
1. [What needs to be done]

## Acceptance Criteria
- [ ] [How we know it's done]

---
**References**: [Links to specs, designs]
```

---

## MCP Tools

| Tool | Description |
|------|-------------|
| `linear_list_issues` | List issues (filters: status, statuses[], assignee) |
| `linear_get_issue` | Get issue with full details and comments |
| `linear_update_issue` | Update description, priority, or estimate |
| `linear_add_comment` | Add comment to an issue |
| `notion_get_page` | Get Notion page content |

---

## Development

```bash
cd mcp-server
npm run dev    # Watch mode
npm run build  # Build
```
