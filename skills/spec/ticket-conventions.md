# TICKET CONVENTIONS

These rules apply to ALL ticket work — refining, creating, reviewing. Follow them exactly.

## User Personas
- **Customer** — end user filing claims, managing policies, asking questions. Use when the user directly experiences the outcome.
- **Insurance provider / Operator** — the business running the platform. Use when the need originates from the business side (operational efficiency, security, compliance, internal tooling). The customer may benefit indirectly but isn't the primary driver.
- **Claims handler** — internal human staff handling escalations. Use when the ticket is about handoff or tooling for manual processing.

## Development Tickets

### Backlog Item Types
Not every ticket is a user story. Pick the format that fits:
- **User Story** — direct user/customer value: `> *As a* persona*, I want* goal *so that* benefit*.*`
- **Improvement Story** — cleaning up or improving existing functionality: `> *We have* current situation*. We want to have* desired situation*.*`
- **Problem Story** — solving a technical problem: `> *In order to* solve problem*, we will* build solution*.*`
- **Story length target: keep it tight.** Improvement Story = 1 to 3 sentences per side (We have / We want). User Story = 1 sentence. Problem Story = 1 sentence. Roughly 50 to 100 words total across the whole Story. Supporting detail (why the current state matters, historical context, alternatives considered) belongs in Business Context, not the Story.
- **No examples in the Story.** Concrete examples — specific values, sample inputs/outputs, "for example …", "(e.g. …)" — do not belong in the Story. The Story states the situation and the want at a principle level. Put illustrative examples in Business Context or Product / Feature Specifications instead.

### Structure Rules
- **Never fabricate context.** If a fact about current state, motivation, actor, or system behavior wasn't given by the user or verifiable in code/docs, either ask or omit. Never plausibly-fill. Applies to every section, not just Implementation Pointers. Wrong details that sound right are worse than blanks.
- **Backlog item description** on top of every ticket — pick the format that fits
- **Section order**: Story → Business Context → Product / Feature Specifications → Implementation Pointers → Acceptance Criteria
- **Always include every standard section header, even when empty.** Never silently drop a section from a standard development ticket. If a section has no content, keep its header and add one line stating *why* it is empty (e.g. "No additional product behavior to specify beyond the ACs" or "Scorer lives in the non-cloned backtesting service, so pointers cannot be grounded in code"). An empty-with-reason header makes the omission a deliberate, visible decision rather than a gap. This does not override the ticket types below that deliberately exclude sections (Parent Epics drop Implementation Pointers, Bug Tickets use their own section set, Collection / Triage Hubs drop Story and Implementation Pointers) — there the section is intentionally absent, so no header is needed.
- **No Notes section** — merge into Product / Feature Specifications
- **Business Context = business situation ONLY** — no implementation tools, tech stack, or code references. Facts about the business situation that existed before the ticket. Keep it short — typically 2–4 sentences. Don't invent customer motivation that isn't documented; if you don't know why customers want it, leave the business reason out.
- **Implementation Pointers = code references ONLY.** Every bullet must carry a specific code locator — a file path (ideally with line range), or a named module / class / function / constant that exists in the repo and can be grepped. **Without a verified code locator, a bullet is not a pointer** — it is a task description, a spec restatement, or generic advice, all of which belong elsewhere or nowhere.
- **Format:** bullet list with **bold topic prefix** (e.g. `**Auth:**`, `**Validation:**`). Topic prefixes describe the work area, not the spec number — bullets stay valid when specs reorder.
- **Each bullet = action verb + code locator + why.** Pair an action (reuse / copy from / skip / extend / wire in / coordinate with) with a *verified* code reference and the reason. Action verbs alone ("extend the existing row component", "wire retry state from the check runner", "persist per-check history") are task descriptions disguised as pointers — exclude them.
- **Verify by reading the code first — never fabricate.** Open the files. Confirm the cited entity exists at the cited path. If `grep` doesn't find what you wrote, you are guessing — delete the bullet. Plausible-sounding file paths or function names that you haven't read are worse than nothing.
- **Leave the section as `*To be defined.*` when you cannot ground it in code.** If the repo isn't cloned / accessible, you don't know the codebase, or the ticket is genuinely greenfield: use the placeholder and let the implementer fill it in. **Don't fill the section with task lists, design hints, or restated specs to avoid leaving it blank** — the prior rules (no spec restatement, no task list, no abstract advice) mean those bullets fail the bar even if "Implementation Pointers" has a header. An empty placeholder is correct; a filled section of non-pointers is not.
- **Drop redundancy with other sections** — if a bullet just restates Business Context, Product Specs, or AC content, cut it. Tone, wording, customer-facing text don't belong here.
- **Sub-tickets must be self-contained** — include necessary context in each sub-ticket so developers don't have to read the parent ticket to understand what to build. Reference the parent for traceability, but don't rely on it for essential context.
- **No References section** — embed links inline in Business Context, Product / Feature Specifications, and Implementation Pointers text where they're relevant. Don't duplicate the same link across sections.
- **No attribution to team members** — don't write "per Alice's input", "as Bob suggested", or "Carol's design ticket." Reference tickets by number (e.g. XXX-543), not by person. The content matters, not who said it.
- **Open questions** go under whichever section fits — Business Context for business/scope/stakeholder questions, Implementation Pointers for code/architecture questions.
- **No internal file references** — never reference SCRATCHPAD.md, HANDOFF.md, or other local files in Linear tickets. Only Notion pages or Linear tickets.
- **No scope-history breadcrumbs** — don't write "originally tracked in X", "this was previously part of Y", "covers what Z was scoped for", or similar. State current scope, period. Cross-link only to tickets that still hold load-bearing context for the reader; scope-history references add noise without value.
- **No related-ticket enumeration in Business Context** — use Linear's "blocks" / "related to" relations to track ticket relationships, not Business Context prose. Cross-link a ticket inline only when a reader genuinely needs that ticket to understand this one's scope. Listing upstream/downstream/sibling tickets as a relationship map ("split out from X", "unblocks Y / Z / W", "feeds into A") is noise.
- **Name code-level concepts — don't use bare `file.ts:123` as a concept's name.** In ACs, Specs, and prose, refer to the thing by a proper name a reader can decode (e.g. the "respond with the real values" self-service instruction), not "the line-324 directive". The file:line reference stays as the *locator* in the matching Implementation Pointer.
- **No em dashes or semicolons in ticket prose.** This applies to every section and to comments (Story, Business Context, Specs, ACs). Rephrase with separate sentences, commas, or parentheses instead.

### Product / Feature Specifications vs Acceptance Criteria
- **ACs are the comprehensive checklist** — everything that must be true or done for the ticket to be complete. If every AC is ticked, the ticket is done.
- **Specs provide the details that ACs reference** — definitions ("what does 'without errors' mean here?"), clarifications (button colors, copy, edge cases), specific values (pricing, thresholds), options (Option A vs B). If a spec describes a behavior, ask whether it's already (or should be) an AC; if yes, remove the duplicate.
- **Every spec statement must read unambiguously as target or defect.** A line like "agent engages with off-topic conversations" could be a requirement or a bug report — the reader can't tell. Phrase target behavior with "should" / "must" ("Agent should not engage with off-topic questions") and mark current bad behavior explicitly as the observed problem ("In the reviewed call the agent …"). This applies especially to spec headings, which get skimmed.
- **No duplicate ground between Specs and ACs** — Specs detail what ACs reference, they don't re-state the AC.
- Pre-existing technical landscape (libraries, agents, current implementation, code paths) belongs in **Implementation Pointers**, not Specs. Implementation approach belongs in Specs only when it directly shapes product behavior (e.g. "must use existing X agent because Y product reason").
- **Specs** should not contain status updates — open items go under Business Context or Implementation Pointers as open questions
- If there's nothing to specify beyond what's in Notion, leave specs minimal

### Acceptance Criteria Rules
- **Customer-oriented and outcome-focused** — describe from customer's perspective, not subtasks or technical implementation
- **Link to Notion specs inline in ACs** — for each AC, check if there's a Notion spec that should be linked to give the dev the exact correct understanding and leave no interpretation room. Devs use ACs as their working checklist — if the spec link isn't there, they'll go from memory. When a link already appears in Context or Specs, seriously review whether it should also be in the AC — if the dev needs it while checking off that AC, include it.
- **Technical ACs are OK for technical tickets** (deployment, infrastructure) — customer-focused ACs only apply to user-facing tickets
- **ACs must cover all sub-tickets** — after drafting ACs for a parent, cross-check every sub-ticket to catch gaps or obsolete tickets
- **Titles should be customer-centric** for user-facing tickets
- **Sort ACs by the customer journey flow.**
- **ACs are deliverables, not recommendations** — an AC is something that gets checked off when actually done. Recommendations, "should consider" items, and design preferences belong in Implementation Pointers, not ACs.

### Placeholder Tickets
For work that is agreed but deliberately not yet scoped (deferred decisions, pending external input):
- **Keep the full section skeleton** — all standard headings present; sections without content carry a single line: `*To be defined when this work is scoped.*` The structure stays visible and later refinement has slots to fill.
- **Fill only what is known**: Story + Business Context with established facts; Implementation Pointers carry *verified* facts only (code reality, constraints, decision options) — no speculative solution content. No Specs or ACs content.
- **Status: Backlog**, not Todo — placeholders are deferred by definition.
- **Sticky note at the top** (when AI-drafted): `> **[AI-generated]** placeholder — scope, specs, and ACs to be defined before pickup.`

### Collection / Triage Hub Tickets
For a ticket whose job is to *gather inputs over time and hand them off*, not to ship a change itself (e.g. collecting failure findings or improvement ideas, then batching them into a follow-up ticket). Distinct from a placeholder — it has real ACs and a defined working mechanism, so it is not "to be defined before pickup":
- **No Story** — Business Context alone carries the why. The user-story framing is ceremony a process ticket doesn't need.
- **No `[AI-generated]` placeholder note** — it isn't an unscoped placeholder; the scope *is* the gather-and-handoff process.
- **No Implementation Pointers** — implementation detail lives in the downstream batched ticket, not the hub. (Same principle as parent epics: the hub stays high-level.)
- **Specs slot = the capture protocol**, not product behavior — state where the gathered content goes (e.g. *"Add improvement ideas as comments"*).
- **ACs = the process gates**, phrased as the workflow's phases: (1) all inputs reviewed + captured, (2) inputs reviewed together + batched into a follow-up ticket with the solution approach. The hub closes when the gather-and-handoff is done — the actual fixes ship elsewhere.
- **Status: Backlog** — collection happens over time; picked up when ready.
- **Comments are the data store** — the ticket body just frames the process; the gathered inputs accumulate in comments.

### Parent Epics
Parent epics group sub-tickets into a coherent body of work and track overall progress. They have specific structure rules that differ from leaf tickets:
- **No Implementation Pointers section** — sub-tickets carry the implementation detail. The parent stays high-level.
- **No sub-ticket section in the description** — Linear's UI lists sub-tickets automatically. Listing them in prose duplicates that and goes stale on every add/remove.
- **No "decisions from meeting X" framing in Business Context** — integrate the facts directly into the narrative. The reader cares about the current state, not the meeting that produced it.
- **No `[X]` pre-crossing on parent ACs** — even if the underlying work was done in earlier projects, the parent AC closes when its sub-ticket lands. Leave all parent ACs `[ ]` until the corresponding sub-ticket is Done.
- **No ticket links in ACs** — Linear's UI shows the sub-ticket relations; adding `(REN-XXX)` trailing references in ACs duplicates that.
- **Each AC maps 1:1 to a sub-ticket** — the parent closes when all sub-tickets do. ACs that cover multiple sub-tickets or partial work make tracking ambiguous.
- **High-level Specs only** — the parent describes product behavior across all sub-tickets; detail lives in each sub-ticket.

## Testing Tickets

### Structure
- **[Test] prefix** on ticket titles for visibility
- **Test tickets are sub-issues** of the feature ticket they test
- Use the **QA Test Ticket** template in Linear (Scope, References, Environment, Test Areas, How to Report Findings)
- **Out-of-scope notes** go in the Scope section, not inside individual test areas
- **Test area details use tables** (Check / Status / Comment columns) — testers fill in status and notes as they go. Keep checks outcome-focused, not listing specific example prompts. Testers should explore freely. Link to specs/Notion where they can find inspiration.
- **Link Notion specs directly in test areas** — put the link where the tester needs it (e.g. "Exclusion types: [CL3](link)" right above the exclusion checkboxes), not just in a References section at the top.
- **Don't duplicate documented processes** — if a flow is already documented (e.g., in a Notion spec), link to it instead of repeating steps in the test ticket
- **No cross-references to other tickets in Environment** — put actual URLs (e.g. vendor portal link, test user setup page), not "same as XXX-yyy"
- **References** should link to the relevant spec, testing strategy, and parent ticket

### Reporting
The test ticket's "How to Report Findings" section carries these instructions, addressed to the tester:
- Don't create tickets for what you find — report each finding as a comment on this ticket, as you go, in the order you find things.
- A good format for an agent finding: **Customer asks:** … **Agent says:** … **Correct is:** … **Link:** the source conversation (chat transcript, call recording, agent trace).
- A good format for a UI finding: what you did, what happened, what you expected (and where that expectation comes from), and a link or screenshot as evidence.

## Bug Tickets

Every defect report is a bug ticket. Two formats, by what was found:

### Single UI or tech finding
- **BUG: prefix** on ticket titles for visibility
- Use the **Bug Report** template in Linear (Summary, Root Cause & Possible Fixes, Expected Behavior)
- **Section order**: Summary → Root Cause & Possible Fixes → Expected Behavior
- **No backlog item story** — bugs don't need a user story, improvement story, or problem story
- Template auto-applies the `Bug` label

Sections:
- **Summary** — observed behavior, environment, screenshots/logs
- **Root Cause & Possible Fixes** — what's causing it (if known) and rough ideas for fixing. Can be expanded after investigation.
- **Expected Behavior** — checklist of what works correctly after the fix (replaces Acceptance Criteria)

### Agent findings
For a batch of agent findings — picking up the comments testers left on a test ticket, or findings the user describes directly:
- **BUG: prefix** on the title. Create from the **Bug Report** template so the `Bug` label applies, then replace the template body with the findings list.
- **One ticket per receiver** — split the findings by who will fix them, so each developer works through a single list. Never one shared ticket that every reader has to filter for their part.
- **The body is the sorted findings list** — no backlog item story, no standard section skeleton.
- **Sort by severity** — three blocks in fixed order: **Crucial**, **Important**, **Less important**.
- **Fixed form per finding** — normalize each into the same four lines, whatever shape it was reported in:
  - **Customer asks:** the customer's message or question
  - **Agent says:** what the agent actually answered
  - **Correct is:** the correct behavior, and where that expectation comes from (spec, KB, rule)
  - **Link:** the source conversation (chat transcript, call recording, agent trace)

## Organization
- **Linear Projects** for feature collections (not parent issues). One project per version/scope (e.g., "Voice Channel v1", "Sales Agent v2", "Authentication setup v1"). Issues are standalone within a project.
- **Always assign a project when creating a ticket** — projects are how work gets surfaced in the roadmap. If unsure which project, ask before creating.
- **Default ticket status is Todo** unless explicitly told otherwise. Don't create tickets in Backlog by default — Backlog hides them from active triage.
- **Every ticket carries exactly one go-live label** — `golive-blocker` (blocks launch), `golive-required` (must ship for go-live), `golive-nice` (ship if time allows) or `golive-post` (explicitly deferred past go-live). Applies to every ticket type (feature, bug, test, evaluation, epic), on create and on refine.
  - **Propose, don't guess silently**: show the proposed label with a one-line reason in the draft header next to project / milestone, and let the user confirm or change it with the draft. Never push a ticket without one.
  - **Decide the label before the project**: `golive-post` tickets belong in a post-launch project, so the label can change the project assignment.
  - **On refine**: if the ticket has no go-live label, flag it and propose one. If it has one, keep it unless the user changes it.
  - **Sub-issues don't inherit**: a child gets its own label, which can differ from the parent's.
  - Set it with `addLabels` on `save_issue` so existing labels stay in place.
- **Project assignment tiebreaker**: If a ticket relates to both a channel and an agent/domain, it goes in the **channel project**. Use domain labels to track the agent/area — define your team's labels in your project CLAUDE.md or a team-reference file. Channel-only tickets go in channel projects, agent-only tickets go in agent projects.
- **Stale tickets**: Cancel and re-create when needed. Don't let them rot in backlog.
- **[Evaluation] prefix** on evaluation tickets for visibility.
- **[Test] prefix** on testing/QA tickets for visibility.
- **Avoid sub-issues for regular tickets** — create standalone issues. Sub-issues clutter the board (parent + child both visible, parent becomes noise if its only progress is the sub-issue). Exception: [Test] tickets remain sub-issues of their feature ticket.
- **Never unlink Done sub-tickets** — they show the work trail.
- **Project/epic descriptions**: Keep broad and stable. Summarize Notion broadly and link — don't duplicate content.

## AI Usage
- **AI comments** on Linear must be prefixed with `**[AI-generated]**`
- **`ai-refined` label**: Only for tickets where AI drafted autonomously. Do NOT add when shaped collaboratively.
- **Always show draft before pushing** — never push without explicit approval.
- **Reference tickets as links** — in drafts and in conversation, write `[XXX-123](https://linear.app/{workspaceSlug}/issue/XXX-123)` rather than bare `XXX-123`. The `{workspaceSlug}` comes from `config.json` (the slug in your Linear URLs, e.g. `linear.app/<workspaceSlug>/...`).
- **Batch ticket drafting cap — max 2 drafts per chat message.** Rendering more than 2 in one block makes review impossible and loses overview. For a batch larger than 2:
  - Resolve assumptions upfront via Q&A (questions batched across all tickets, not per-ticket).
  - Once assumptions are locked, ask the user: "OK to create all N with the `ai-refined` label and review in the Linear UI step by step?"
  - On approval, create all tickets directly (skip rendering drafts in chat).
  - After creation, list every ticket link in chat (one per line, `[XXX-NNN](url) — title`) so the user can click through and review one at a time.
  - This overrides the default "shaped collaboratively → no ai-refined" rule for batch creation flows, because the review happens in the UI rather than in chat.
