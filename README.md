# Spec Tool

Manage Linear tickets and Notion specs from Claude Code.

## Setup (5 steps)

### 1. Get API Keys

**Linear:**
1. Go to linear.app
2. Settings → Account → Security & Access
3. Create Personal API key, copy it

**Notion:**
1. Go to notion.so/my-integrations
2. Create new integration, copy the secret
3. In Notion, share your workspace with the integration (page → ... → Connections → Add)

### 2. Build MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 3. Add to Claude

```bash
claude mcp add spec-tool node /FULL/PATH/TO/spec-tool/mcp-server/dist/index.js \
  -e "LINEAR_API_KEY=lin_api_xxx" \
  -e "NOTION_API_KEY=ntn_xxx"
```

### 4. Install Command

```bash
cp command/spec.md ~/.claude/commands/
```

### 5. Create Config

Create a folder for your team config (or clone your team's private config repo):

```bash
mkdir my-team-config
cd my-team-config
```

Create `config.json`:
```json
{
  "linearTeamId": "your-linear-team-id",
  "notionDatabaseId": "your-notion-database-id",
  "teamName": "Your Team Name"
}
```

### 6. Restart Claude Code

Done. Run `/spec` from your config folder.

---

## Usage

```bash
cd my-team-config   # or your team's config repo
/spec
```

```
Work on:
1. Tickets - Manage Linear tickets
2. Specs - Manage Notion specifications
```

On first run, creates `TICKET_SCOPE.md` to track context and history.

---

## Team Setup

For teams, create a **private repo** with:
- `config.json` - Your team's Linear/Notion IDs
- `TICKET_SCOPE.md` - Shared ticket history (created by /spec)
- `README.md` - Team-specific notes

Team members:
1. Clone public spec-tool, install (steps 1-4 above)
2. Clone private team config repo
3. Run `/spec` from team config folder

---

## Finding Your IDs

**Linear Team ID:**
1. Go to your team in Linear
2. Team Settings → look at URL: `linear.app/team/TEAM_ID/settings`

**Notion Database ID:**
1. Open your specs database in Notion
2. Copy URL: `notion.so/WORKSPACE/DATABASE_ID?v=...`
3. The ID is the 32-character string before `?v=`

---

## Project Structure

```
spec-tool/              ← PUBLIC (this repo)
├── command/
│   └── spec.md         # The /spec command
├── mcp-server/         # MCP server for Linear + Notion
├── config.example.json # Template for config
└── README.md

your-team-config/       ← PRIVATE (your team's repo)
├── config.json         # Your IDs
├── TICKET_SCOPE.md     # History (created by /spec)
└── README.md
```

---

## Development

```bash
cd mcp-server
npm run dev    # Watch mode
npm run build  # Build
```
