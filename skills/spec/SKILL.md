---
name: spec
description: Ticket & specification management — manage Linear tickets, validate against Notion specs
---

# Spec - Ticket & Specification Management

Manage Linear tickets and validate against Notion specs.

## Prerequisites

This skill calls tools on your Linear and Notion MCP connectors. Install them via Claude Code Settings → Connectors:

- **Linear MCP connector** — exposes `list_issues`, `get_issue`, `save_issue`, `save_comment`, etc.
- **Notion MCP connector** (e.g. Notion Connect) — exposes `notion-fetch`, `notion-search`, `update_content`, etc.

Exact tool IDs vary by connector vendor, but the standard function names referenced throughout this skill should be present. See `spec-workflows.md` → Connectors section for the full list.

## Startup: Configuration

**Before showing options**, check for `./config.json` in current directory:

**If config.json missing:** Run interactive setup:

```
No config.json found. Let's set up your workspace.

1. Team/Project name?
   (e.g., "MyTeam", "MyProject")

2. Linear team ID?
   → Open Linear → Team Settings → copy ID from URL
   → URL looks like: linear.app/team/TEAM_ID/settings
   → Example: abba2c0d-256b-4a83-bb38-77b86f468f5f

3. Linear workspace slug?
   → The slug in your Linear URLs
   → URL looks like: linear.app/WORKSPACE-SLUG/issue/...
   → Used to construct ticket links in drafts (e.g. https://linear.app/{workspaceSlug}/issue/XXX-123)

4. Notion database ID?
   → Open your specs database in Notion
   → Copy ID from URL (32 chars before ?v=)
   → URL looks like: notion.so/WORKSPACE/DATABASE_ID?v=...
   → Example: 28ddf45b-20fd-805a-bee6-c85c56ff9deb

(Leave Notion ID blank if not using specs database)
```

After collecting answers, create `config.json`:
```json
{
  "linearTeamId": "[user's Linear team ID]",
  "workspaceSlug": "[user's Linear workspace slug]",
  "notionDatabaseId": "[user's Notion database ID or empty string]",
  "teamName": "[user's team name]"
}
```

Then say: "Created config.json. Continuing setup..."

**If config.json exists:** Read it to get:
- `linearTeamId` - Linear team to query
- `workspaceSlug` - Linear workspace slug for constructing ticket links
- `notionDatabaseId` - Notion specs database
- `teamName` - Display name for team

---

## Notion Structure

**Primary source**: Product specs database - ID from `config.json` → `notionDatabaseId`

When validating tickets or looking for specs:
1. First query this database via Notion API
2. Search by title or browse available specs
3. Fetch full page content for validation

## Instructions

When the user runs `/spec`, present the top-level menu:

```
Work on:

1. Tickets - Manage Linear tickets
2. Specs - Manage Notion specifications
```

Wait for selection, then show the appropriate submenu.

## Reference Files

Before working on tickets or specs, read the relevant conventions and workflows:

- **[Ticket Conventions](ticket-conventions.md)** — structure rules, personas, ACs, testing, bugs, organization
- **[Page Conventions](page-conventions.md)** — Notion spec page writing rules
- **[Ticket Workflows](ticket-workflows.md)** — Refine, Review, Validate, Status, Summarize
- **[Spec Workflows](spec-workflows.md)** — Browse, Review, Update, Gap Analysis, API reference
