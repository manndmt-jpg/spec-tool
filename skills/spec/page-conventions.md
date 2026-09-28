# NOTION SPEC PAGE CONVENTIONS

Rules for writing and maintaining Notion spec pages.

## Open Items
- **Open Items are for unresolved questions only.** When an open item gets answered, move the information into the relevant section of the page and mark the item as done. Don't leave resolved information buried in the Open Items list — the answer belongs in the page content where readers will look for it.

## Writing Style
- **Principles over implementation** — spec pages should document design principles and decision rules, not list current features. When implementation detail is tied to a principle (like sessionStorage for chat persistence), mention it. Otherwise keep it principle-level.
- **Timeless over current** — write content that stays valid as the project evolves. Describe concepts, approaches, and trade-offs — not what's currently being worked on or evaluated. Tickets become outdated, current situations change. Ticket links are fine for traceability, but the surrounding text should make sense even if the ticket is closed or obsolete.
- **Unified flow tables** — when chat and email flows are similar, use one table with an "Email (differences)" column instead of separate tables per channel.
- **Customer-facing language conventions** — if your team writes customer-facing text in a specific language or register (formal vs informal, dialect, special-character rules), document the conventions in your project CLAUDE.md or team-reference file and follow them in example messages, confirmation text, and edge case responses.

## Structure
Spec pages typically follow this structure (adapt as needed):
1. **Scenario** — what the customer wants to do, prerequisites
2. **Channels** — which channels support this, with status
3. **Flow** — step-by-step table (Step / Actor / What Happens / Email differences)
4. **Edge Cases** — what happens in unusual situations
5. **Conversational Examples** — example user inputs and system responses
6. **Open Items** — unresolved questions only (see rule above)

## Linking
- **Link to specific sections** when referencing from tickets — don't just link the page. Reference the heading or step number (e.g. "step 5 in the Flow table", "see Reason Collection section").
- **Don't link archived pages.** Verify in specs-cache or Notion that the page is active before linking from a ticket or another spec. Use the active replacement page instead.
- **After every edit, check your team's top-level LLM context page** (if you have one) for consistency. Document the page ID in your project CLAUDE.md or team-reference file.

## Page Edits
- **Always fetch fresh before editing** — pages may have been edited by a teammate since you last read them. Critical for `replace_content` (overwrites the whole page) and `update_content` (old_str may no longer match).
- **Prefer `update_content` over `replace_content`** when only changing parts of a page. `replace_content` discards anything not in the new content — including recent edits.
- **Verify after writing** — fetch the page back to confirm your changes landed and nothing else was lost.
