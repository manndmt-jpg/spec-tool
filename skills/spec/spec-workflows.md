# SPEC WORKFLOWS

If user selects **Specs**, show:

```
Spec Actions:

1. Browse - List available Product specs
2. Review - View a specific spec
3. Update - Improve spec from ticket learnings
4. Gap analysis - Find areas without specs
```

---

## Specs > Browse

Query the Product specs database and display available specs:

```bash
POST https://api.notion.com/v1/databases/{notionDatabaseId}/query
```

Display specs grouped by category (if available) or as flat list:
```
Product Specs Database

[Category 1]:
├── Spec title
├── Spec title
└── ...

[Category 2]:
├── Spec title
└── ...
```

Ask: "View a spec? Enter name or 'back' to return"

---

## Specs > Review

Ask: "Which spec?" (show list or accept name/partial match)

Then:
1. Fetch full spec via your Notion connector's `notion-fetch`
2. Display: title, last edited, content summary
3. Ask: "What next?"
   - a) View full content
   - b) Find related tickets in Linear
   - c) Back to menu

---

## Specs > Update

Ask: "Which spec to update?" (show list)

Then:
1. Fetch current spec content via your Notion connector's `notion-fetch`.
2. Search Linear for tickets that reference this spec (via your Linear connector's `list_issues`) to see what was learned in implementation.
3. Fetch relevant tickets via your Linear connector's `get_issue` for full context.
4. Analyze and suggest updates per `page-conventions.md` (Writing Style + Structure):
   - Missing edge cases discovered in tickets
   - Clarifications needed based on ticket comments
   - New requirements that emerged
   - Acceptance criteria to add
5. Show suggested changes to the user.
6. On approval, update the Notion page via MCP:
   - Prefer `update_content` (partial edit) over `replace_content` (overwrites everything).
   - **Verify after writing** — fetch the page back to confirm changes landed. `update_content` can silently drop unmatched `old_str` blocks (success-shaped response, no error). See project CLAUDE.md for the silent-partial-failure + timeout gotchas.
7. If the edit affects domain overviews or product-wide concepts, also check your team's top-level LLM context page (if you have one) for downstream consistency. Document the page ID in your project CLAUDE.md or team-reference file.

---

## Specs > Gap Analysis

Analyze coverage:
1. Fetch all specs from Product specs database
2. Fetch recent tickets from Linear (last 30 days or by label)
3. Compare and identify:
   - Tickets with no matching spec
   - Features implemented without documentation
   - Specs that haven't been referenced by any ticket
4. Report:
   ```
   Gap Analysis

   Tickets without specs (12):
   ├── XXX-yyy - [title] - No matching spec found
   └── ...

   Potential new specs needed:
   ├── "Auth System" - 5 related tickets, no spec
   └── ...

   Stale specs (no recent tickets):
   ├── "Legacy Feature" - Last referenced 6 months ago
   └── ...
   ```
5. Ask: "Create draft spec for any of these? Enter topic or 'back'"

---

## Connectors

This skill assumes you have both a Linear MCP connector and a Notion connector configured in Claude Code (Settings → Connectors). Exact tool IDs vary by connector vendor, but the standard function names referenced throughout this skill are:

**Linear connector:**
- `list_issues` — list issues (filters: status, statuses[], assignee, projectId, projectMilestoneId)
- `get_issue` — get issue with details
- `list_comments` — list comments on an issue
- `save_issue` — create or update an issue (pass `id` to update)
- `save_comment` — post a comment on an issue
- `list_milestones`, `save_milestone` — project milestones
- `list_projects`, `save_project`, `list_initiatives` — projects and initiatives

Team ID and workspace slug come from `config.json` → `linearTeamId` / `workspaceSlug`.

**Notion connector:**
- `notion-fetch` — fetch page content
- `notion-search` — search across pages
- `notion-update-page` / `update_content` — partial edit (preferred over full replace)

Product specs DB ID comes from `config.json` → `notionDatabaseId`.
