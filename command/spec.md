# Spec - Ticket & Specification Management

Manage Linear tickets and validate against Notion specs.

## Startup: Configuration

**Before showing options**, check for `./config.json` in current directory:

**If config.json missing:** Run interactive setup:

```
No config.json found. Let's set up your workspace.

1. Team/Project name?
   (e.g., "RenisaAI", "MyProject")

2. Linear team ID?
   → Open Linear → Team Settings → copy ID from URL
   → URL looks like: linear.app/team/TEAM_ID/settings
   → Example: abba2c0d-256b-4a83-bb38-77b86f468f5f

3. Notion database ID?
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
  "notionDatabaseId": "[user's Notion database ID or empty string]",
  "teamName": "[user's team name]"
}
```

Then say: "Created config.json. Continuing setup..."

**If config.json exists:** Read it to get:
- `linearTeamId` - Linear team to query
- `notionDatabaseId` - Notion specs database
- `teamName` - Display name for team

Then check for `./TICKET_SCOPE.md` in current directory:

**If TICKET_SCOPE.md exists:** Read it silently to understand project context and history.

**If TICKET_SCOPE.md missing:** Create it by asking:
1. "What does this codebase handle?" (e.g., "FNOL web app", "Claims API backend")
2. "Any specific Linear labels to filter?" (optional)

Then create `TICKET_SCOPE.md`:
```markdown
# Ticket Scope - [Project Name]

## Project Context
[User's description of what this codebase handles]

## Labels Filter
[Optional: labels that relate to this project]

## Related Specs
[Will be populated as tickets are validated]

## Domain Knowledge
[Auto-populated as tickets are refined/validated - captures learnings about the project]

---

## History

### [Date]
[Will be populated as tickets are worked on]
```

**After each operation:**

1. **Log to History section:**
   - `**REN-XXX** - Refined - [ticket title]`
   - `**REN-XXX** - Validated - [linked spec name]`
   - `**REN-XXX** - Summarized - [ticket title]`

2. **Update Domain Knowledge** if new insights were learned:
   - Technical constraints (e.g., "don't modify system instructions - changes monitoring hash")
   - Architecture decisions (e.g., "use preprocessor for dynamic context injection")
   - Domain rules (e.g., "FNOL requires X before Y")
   - Integration notes (e.g., "Claims API uses webhook for status updates")

   Organize by feature/domain area:
   ```markdown
   ## Domain Knowledge

   ### Agents
   - Use preprocessor for dynamic context, not system instructions (monitoring hash)

   ### FNOL
   - [learnings from FNOL tickets/specs]

   ### Claims
   - [learnings from Claims tickets/specs]
   ```

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

---

# TICKETS

If user selects **Tickets**, show:

```
Ticket Actions:

1. Refine - Format tickets to standard structure
2. Review - View/edit a specific ticket
3. Validate - Compare ticket to Notion spec
4. Status - List tickets by state
5. Summarize - Add AI summary comment to tickets
```

---

## Tickets > Refine

Ask: "Which tickets to refine?"
- a) All unrefined (no Context/Specs/AC sections)
- b) Specific ticket ID (e.g., REN-123)
- c) By label (e.g., Q1-demo)
- d) By status (e.g., Todo, In Progress)

Then ask: "Detail level?"
- a) **Minimal** - Brief and scannable
- b) **Standard** - Balanced detail (default)
- c) **Extensive** - Full context and edge cases

### Minimal style:
```
## Context
[1-2 sentences max]

## Specifications
- [Bullet points, no sub-items]

## Acceptance Criteria
- [ ] [2-3 items max]
```

### Standard style:
```
## Context
[2-3 sentences, the why]

## Specifications
1. [Numbered steps with brief detail]

## Acceptance Criteria
- [ ] [3-5 items covering main flows]

---
**References**: [links]
```

### Extensive style:
```
## Context
[Full background: why, business value, user impact]

## Specifications
1. [Detailed steps]
   - Sub-requirements
   - Technical considerations

## Acceptance Criteria
- [ ] [Comprehensive list]
- [ ] [Include edge cases]
- [ ] [Error states]

## Notes
[Dependencies, risks, related tickets]

---
**References**: [links to specs, designs, related tickets]
```

Then for each ticket:

**1. Gather context from all sources:**
   - Fetch ticket with comments via `linear_get_issue`
   - Read TICKET_SCOPE.md for project context and Related Specs list
   - Search for matching Notion spec:
     - First check if ticket matches any spec in Related Specs list
     - If not, search Notion database by keywords from title
   - If potential spec found, validate relevance:
     - Does spec topic match ticket scope?
     - If unclear, ask: "Found spec [X] - use for context? (y/n)"

**2. Analyze title for issues:**
   - Check for: typos, grammatical errors
   - Check if title contradicts comments (e.g., approach changed)
   - Check if title is unclear or misleading
   - If issues found, draft a suggested new title

**3. Draft new description using selected style:**
   - Use available context (TICKET_SCOPE, Notion spec, comments)
   - AI adds/infers where gaps exist:
     - Business context if not explicit (infer from title + project context)
     - Logical acceptance criteria based on work type
     - Related edge cases based on feature domain
     - Error states and validation needs
     - Connections to related functionality
   - Link to Notion spec in References if used

**4. Review and apply:**
   - If title needs change, show both title and description:
     ```
     REN-XXX

     Title (suggested change):
       OLD: "Original title with issues..."
       NEW: "Improved clear title"

     Description:
       [Context/Specs/AC draft]

     Push to Linear? (y/n/edit)
     ```
   - If title is fine, show description only
   - If yes, update via `linear_update_issue` (include title if changed)
   - If new spec was used, add to TICKET_SCOPE.md Related Specs list
   - Log to TICKET_SCOPE.md History: `**XXX-123** - Refined`

**5. Move to next ticket**

---

## Tickets > Review

Ask: "Ticket ID?" (e.g., REN-123)

Then:
1. Fetch full ticket via `linear_get_issue`
2. Display: title, status, priority, labels, description, comments
3. Ask: "What to change?"
   - a) Description
   - b) Priority
   - c) Estimate
   - d) Labels
   - e) Nothing, just viewing
4. Apply changes via `linear_update_issue`

---

## Tickets > Validate

Ask: "Ticket ID?" (e.g., REN-123)

Then:
1. Fetch ticket with comments via `linear_get_issue`
2. Check if ticket already links to a Notion spec
3. If no link, search Product specs database for matching spec:
   - Query database: `POST /databases/{notionDatabaseId}/query`
   - Match by keywords from ticket title
   - Present matches and ask user to select
4. Fetch full Notion page content via `notion_get_page`
5. Compare and report:
   - Requirements in spec missing from ticket
   - Ticket scope vs spec scope alignment
   - Context from ticket comments (scope changes, clarifications, decisions)
   - Suggested acceptance criteria from spec
   - Missing edge cases or scenarios
6. Ask: "Update ticket with findings? (y/n)"

---

## Tickets > Status

Fetch all tickets via `linear_list_issues` (team: `{linearTeamId}` from config) and display:

```
{teamName} Tickets Overview

In Progress (N)
├── XXX-123 [High] Title
└── ...

Testing (N)
├── XXX-456 [High] Title
└── ...

Todo (N)
├── XXX-789 [High] Title
└── ...

Backlog (N)
└── ...
```

---

## Tickets > Summarize

Add AI-generated summary comments to tickets. Useful for giving context to assignees.

Ask: "Which tickets to summarize?"
- a) Specific ticket ID (e.g., REN-123)
- b) By assignee (e.g., yegor-ext)
- c) By status (e.g., Todo, In Progress)
- d) By label

If option b, c, or d selected, also ask: "Filter by status?" with options:
- Todo only
- In Progress only
- Both Todo and In Progress
- All statuses

Then fetch matching tickets via `linear_list_issues` with appropriate filters.

**For each ticket:**

1. Fetch full ticket via `linear_get_issue`
2. Check if ticket already has an "AI Summary" comment - if so, skip (or ask to update)
3. Analyze:
   - Title and description
   - All comments for context
   - Check if description already has Context/Specs/AC sections (well-structured = less summary needed)
4. If `notionDatabaseId` configured, search for matching spec by keywords from title
5. Generate summary comment:

```markdown
**AI Summary**

**What:** [1-2 sentence summary of what this ticket is about]

**Why:** [Context/business reason if apparent, or "Not specified"]

**Spec:** [Link to Notion spec if found, or "No matching spec"]

**Key points from comments:**
- [Relevant point 1]
- [Relevant point 2]
(or "No comments yet")
```

6. Show draft to user: "Add this comment to {TICKET-ID}? (y/n/edit/skip)"
7. If yes, post via `linear_add_comment`
8. Log to TICKET_SCOPE.md: `**REN-XXX** - Summarized`
9. Move to next ticket (or finish if single ticket)

**Skip criteria:**
- Ticket already has "AI Summary" comment (unless user chooses to update)
- Ticket has well-structured description with Context, Specifications, and Acceptance Criteria sections

---

# SPECS

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
1. Fetch full spec via `notion_get_page`
2. Display: title, last edited, content summary
3. Show related tickets from TICKET_SCOPE.md history (if any validated against this spec)
4. Ask: "What next?"
   - a) View full content
   - b) Find related tickets in Linear
   - c) Back to menu

---

## Specs > Update

Ask: "Which spec to update?" (show list)

Then:
1. Fetch current spec content via `notion_get_page`
2. Review TICKET_SCOPE.md history for tickets validated against this spec
3. Fetch those tickets via `linear_get_issue` to see what was learned
4. Analyze and suggest updates:
   - Missing edge cases discovered in tickets
   - Clarifications needed based on ticket comments
   - New requirements that emerged
   - Acceptance criteria to add
5. Show suggested changes
6. Ask: "Apply to Notion? (y/n/edit)"

**Note:** Currently read-only. Show suggestions for manual update in Notion.

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
   ├── REN-xxx - [title] - No matching spec found
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

## API Reference

**Linear:**
- Team ID: from `config.json` → `linearTeamId`
- MCP tools:
  - `linear_list_issues` - List issues (filters: status, statuses[], assignee)
  - `linear_get_issue` - Get issue with comments
  - `linear_update_issue` - Update description/priority/estimate
  - `linear_add_comment` - Add comment to issue

**Notion:**
- Product specs DB: from `config.json` → `notionDatabaseId`
- MCP tool: `notion_get_page`
- Direct API for database queries when needed

---

## Fallback (No MCP)

If MCP tools are not available, use curl commands with environment variables:
- `$LINEAR_API_KEY` for Linear GraphQL API
- `$NOTION_API_KEY` for Notion REST API

Ask user for keys if not in environment.
