# TICKET WORKFLOWS

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

## Draft Modes

When drafting a ticket description (either refining an existing one or creating a new one from scratch), pick a mode.

### Normal mode (default)
Draft the full description in one pass — Story, Business Context, Product / Feature Specifications, Implementation Pointers, Acceptance Criteria — then show the whole ticket to the user for review.

### Step-by-step mode
Draft one section at a time. Show each section, wait for approval, then move on. Use approved sections to inform the next.

**Before drafting any section, ask 1 to 3 clarifying questions if key info is missing or you're about to invent context.** Better to ask than to plausibly-fill and get corrected three iterations later.

**Settle the scope before drafting any section.** State the scope (which surfaces, which changes or findings, how many tickets, ticket type) and get it confirmed first. While the user is still testing, investigating, or adding to the scope, draft nothing: record the new facts and restate the scope. If the scope changes after sections were drafted, those drafts are void and the draft restarts at the first section.

**A section is agreed only on an explicit OK.** Silence, a reply about something else, or "no objection" is not approval. Never write "treating this as agreed" and move on. Ask again, or wait.

**No colored diffs on iteration.** Show the current draft plainly each time. The Refine workflow's diff rule does not apply inside SBS per-section iteration.

1. **Story** — pick the backlog item type (User Story / Improvement Story / Problem Story) and draft the story text.
2. **Business Context** — draft the 2 to 4 sentence business situation.
3. **Acceptance Criteria** — draft the outcome-focused ACs.
4. **Implementation Pointers** — only after the three sections above are locked, investigate the code and ground pointers with verified locators.

**Product / Feature Specifications** slot in whenever an earlier step surfaces a detail that needs clarifying (an edge case, a specific value, per-surface behavior). Usually this happens during or right after the AC step. If specs are not needed, keep the section empty.

Default to Normal mode unless the user asks for Step-by-step or has a personal preference to be asked. Users may also invoke Step-by-step directly by saying "step-by-step" (or "sbs") in their `/spec` invocation.

---

## Tickets > Refine

Ask: "Which tickets to refine?"
- a) All unrefined (no structured Business Context / Specifications / ACs sections)
- b) Specific ticket ID (e.g., XXX-123)
- c) By label (e.g., Q1-demo)
- d) By status (e.g., Todo, In Progress)

Then ask: "Detail level?"
- a) **Minimal** — quick first-pass: broad, first-come-to-mind ACs (not yet comprehensive). Use when time is short. The ticket will be marked as needing Standard refinement before dev pickup.
- b) **Standard** — full conventions applied: ACs cover everything that must be true for the ticket to be complete (default).

Both levels use the same section structure — see `ticket-conventions.md` for what goes in each section.

Then for each ticket:

**1. Gather context from all sources:**
   - Fetch ticket with comments via your Linear connector's `get_issue`
   - Search for matching Notion spec by keywords from title (query the Notion specs database)
   - If potential spec found, validate relevance:
     - Does spec topic match ticket scope?
     - If unclear, ask: "Found spec [X] - use for context? (y/n)"

**2. Analyze title for issues:**
   - Check for: typos, grammatical errors
   - Check if title contradicts comments (e.g., approach changed)
   - Check if title is unclear or misleading
   - If issues found, draft a suggested new title

**3. Draft new description** (pick a mode — see "Draft Modes" above):

   *Before drafting:*
   - **Surface PM decisions to the user; don't park them in the ticket as "verify" / "TBD" / "(check before starting)".** While drafting, if you hit something that needs a decision the PM should make (scope choices, in/out, "do we cover X here too?", naming), ask the user in the conversation and ship the ticket with the decision already made. Open questions that legitimately belong in the ticket are for the engineering team (e.g. "does the upstream API accept UUIDs on this endpoint?", "which runner version do we use?") — not decisions the PM should resolve while writing. **Same goes for cross-team hand-offs: never write "coordinate with / ask / confirm with team X (or person Y)" into a ticket** — surface it to the PM in the conversation and resolve it before shipping, rather than parking a cross-team ask in the description.
   - **Run the conventions checklist** from `ticket-conventions.md` (every iteration, not just the first) — story type, section order, Business Context strict tech-free, specs as concrete per-surface behavior (not category labels like "all agent flows work"), ACs as deliverables (not recommendations), no scope-history breadcrumbs, no related-ticket enumeration in BC, no internal file references. State which checks you're applying so the user can catch misses early.
   - **Treat the existing ticket description as input to verify, not source of truth.** UI labels, file paths, and behavior claims in old descriptions go stale — sections get renamed, code paths shift, the original premise turns out to be wrong. Verify anything you plan to keep, the same way you verify what you write fresh. "It already said X" isn't a reason to leave X in.

   *Investigation:*
   - **For technical / integration tickets, investigate the affected code paths before writing specs.** Vague specs like "test claims agent" or "update integration" signal the writer doesn't yet know what's actually affected — go look first (which endpoints carry the change, which files hold the literals, what's policy-keyed vs product-keyed, etc.). Only then write the per-flow specs.

   *Drafting:*
   - Follow the section structure and content rules in `ticket-conventions.md`.
   - Use all available context (Notion spec, ticket comments, project CLAUDE.md). When pre-existing code is relevant, read the codebase to surface accurate Implementation Pointers — don't fabricate.
   - For each AC, check if a Notion spec link should be embedded so the dev has exact context while working through the checklist.

   *On iteration:*
   - **Re-validate the whole draft, not just the changed section.** Feedback that targets one section often invalidates invariants elsewhere — changing a title leaves stale references in the body, reordering specs breaks AC ordering or numbering, removing a flow leaves orphan Implementation Pointers, merging two bullets can break a cross-link. Re-check unchanged sections too before showing the iterated draft.

**4. Review and apply:**
   - **Render drafts inline, don't wrap in code blocks** — show the structure formatted (real headings, bullets, tables), not raw markdown source inside a fenced code block. The user reads drafts as the rendered ticket; code-block wrapping defeats that.
   - **On every revised draft, lead with a colour diff of what changed.** When re-presenting a draft after feedback (any iteration after the first), put a fenced `diff` code block at the top showing only the changed lines vs. the previous version — removed lines prefixed `-`, added lines prefixed `+`, so the renderer colours them red/green. Render the full updated ticket below it. This is the sole exception to the no-code-blocks rule above: the change summary uses a code block, the ticket body still renders inline.
   - If title needs change, show both title and description:
     ```
     REN-XXX

     Title (suggested change):
       OLD: "Original title with issues..."
       NEW: "Improved clear title"

     Description:
       [draft per ticket-conventions.md]

     Push to Linear? (y/n/edit)
     ```
   - If title is fine, show description only
   - On user approval:
     - Update description via your Linear connector's `save_issue` (include title if changed)
     - **Set the go-live label in the same push** (`addLabels`) — the one confirmed with the draft, per "Every ticket carries exactly one go-live label" in `ticket-conventions.md`. Applies to newly created tickets too. After the push, check the echo's `labels` for it.
     - **If AI drafted the ticket autonomously (not collaboratively shaped):**
       - Add `ai-refined` label to ticket
       - Add a sticky note at the **top of the description** (above the Story block) so the AI provenance is visible at a glance — labels alone can be missed. Use:
         - **Standard mode:** `> **[AI-generated]** — verify behavior claims, file paths, and scope assumptions before implementing.`
         - **Minimal mode:** `> **[AI-generated]** (Minimal mode) — broad first-pass ACs; needs Standard-mode refinement before dev pickup.`
       - Do **not** post this as a separate comment — it lives in the description only.

**5. Move to next ticket**

---

## Tickets > Review

Ask: "Ticket ID?" (e.g., XXX-123)

Then:
1. Fetch full ticket via your Linear connector's `get_issue`
2. Display: title, status, priority, labels, description, comments
3. Ask: "What to change?"
   - a) Description
   - b) Priority
   - c) Estimate
   - d) Labels
   - e) Nothing, just viewing
4. Apply changes via your Linear connector's `save_issue`

---

## Tickets > Validate

Ask: "Ticket ID?" (e.g., XXX-123)

Then:
1. Fetch ticket with comments via your Linear connector's `get_issue`
2. Check if ticket already links to a Notion spec
3. If no link, search Product specs database for matching spec:
   - Query database: `POST /databases/{notionDatabaseId}/query`
   - Match by keywords from ticket title
   - Present matches and ask user to select
4. Fetch full Notion page content via your Notion connector's `notion-fetch`
5. Compare and report:
   - Requirements in spec missing from ticket
   - Ticket scope vs spec scope alignment
   - Context from ticket comments (scope changes, clarifications, decisions)
   - Suggested acceptance criteria from spec
   - Missing edge cases or scenarios
6. Ask: "Update ticket with findings? (y/n)"

---

## Tickets > Status

Fetch all tickets via your Linear connector's `list_issues` (team: `{linearTeamId}` from config) and display:

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
- a) Specific ticket ID (e.g., XXX-123)
- b) By assignee (e.g., a Linear username)
- c) By status (e.g., Todo, In Progress)
- d) By label

If option b, c, or d selected, also ask: "Filter by status?" with options:
- Todo only
- In Progress only
- Both Todo and In Progress
- All statuses

Then fetch matching tickets via your Linear connector's `list_issues` with appropriate filters.

**For each ticket:**

1. Fetch full ticket via your Linear connector's `get_issue`
2. Check if ticket already has an "AI Summary" comment - if so, skip (or ask to update)
3. Analyze:
   - Title and description
   - All comments for context
   - Check if the description already follows the structure in `ticket-conventions.md` (well-structured = less summary needed)
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
7. If yes, post via your Linear connector's `save_comment`
8. Move to next ticket (or finish if single ticket)

**Skip criteria:**
- Ticket already has "AI Summary" comment (unless user chooses to update)
- Ticket has a well-structured description per `ticket-conventions.md`
