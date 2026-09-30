---
description: Update all project docs before wrapping up
---

Update all project documentation before we wrap up:

**File locations:** `SCRATCHPAD.md`, `HANDOFF.md`, `SESSION_HISTORY.md`, and `CLAUDE.md` all live at the **main repo root** (gitignored except `CLAUDE.md`). When the session runs in a worktree, resolve the main repo via `git -C "$PWD" worktree list --porcelain | awk '/^worktree /{print $2; exit}'` and read/write from there.

**IMPORTANT: Read each file fresh from disk before editing.** Do not rely on versions already in your context — another terminal may have updated them since you last read them.

**IMPORTANT: All file updates via the Read + Edit/Write tools — never via bash.** No `printf`/`echo`/`cat` appends or redirects, not even for a simple append at the end of a file. Bash file writes force a manual approval prompt every single time; Edit/Write don't. If Edit requires reading the file first, read it with the Read tool (use `offset` for the tail of a long file), not with `tail`/`head`.

## 1. SCRATCHPAD.md
Read the current file first. **Make targeted Edits, not a full Write** — most of the file (todos, Backlog, Notes, older session summaries) is unchanged on a typical sync. Use Edit for:
- Insert new todos at the top of `## To Do List` (if any)
- Insert the new session summary at the top of `## Session Summaries`
- Drop the oldest displayed session summary if more than 3 are now shown — but **never drop one before it exists in SESSION_HISTORY.md.** Grep the history for that session number first (`grep -n "Session <N>" SESSION_HISTORY.md`); if it is missing, archive it in step 4 first, then delete it here. Deleting an unarchived summary loses it permanently — SCRATCHPAD and SESSION_HISTORY are the only two copies. Do not infer presence from a date-filtered grep: match on the session number, since date formats vary (`2026-09-17 – 24`, `2026-09-04 + 2026-09-30`).

A full Write is fine if the file is heavily restructured, but it's the slower path — prefer Edit.

### To Do List
- Keep a list of open To Dos at the top.
- Finished tasks are deleted and become part of the session summary.
- The todos can span over all sessions in the past
- Don't delete anything that wasn't done. 
- Don't invent to do items. If something might be a todo but wasn't stated, ask first.
    - Note: Ticket housekeeping (assigning, labeling) is never a todo — it's low effort and can be done immediately or left intentionally.
### Session Summaries
- **Session boundaries**: One session = from the last /sync to the current one, regardless of how many calendar days it spans. Don't split by date. If a continuous task spanned a long weekend, it's still one session.
- Write a session summary, with a name/title which consists of the date(s) the work was done (Date of the sync is not a day of work, if only sync was done on that date.) and an increasing number.
    - **The session number is assigned only now**: highest number in the Session Summaries (read fresh from disk) plus one. It was never reserved at session start, so there is nothing to "renumber" and nothing to announce if other sessions synced in between.
    - For multi-day sessions, use a date range: `2026-04-23 – 27 (Session 89)`
    - What tasks or to do items we were working on this session 
    - In larger tasks, what's done, what's in progress
    - Open questions or blockers
    - Don't create checkboxes or open items for what's in progress or open questions, those go into the to do list. Just write a summary of what's open.
- Keep the session summaries of the previous 3 sessions. Don't update them, if we finished something from a previous session that goes into the current session summary.
- **Length: target ~400 words per summary, hard ceiling 600.** SCRATCHPAD summaries should be richer than the SESSION_HISTORY compact entry (recent history matters more than archived), but not unbounded — cut prose padding and repetition, keep the load-bearing detail. Small sessions stay naturally tight; don't pad.
- Older session summaries get stored as a more compact version in SESSION_HISTORY.md

## 2. HANDOFF.md
One file, one section per task in flight. A handoff only matters when the sync happens mid-task, so this step is often a no-op.

Read the file fresh, then decide for the task this session worked on:
- **Still in progress** → find its section (match by ticket ID or topic in the heading) and update it with a targeted Edit. No matching section → append a new one at the bottom.
- **Finished this session** → delete its section. The outcome goes into the session summary, not here.
- **Nothing was in flight this session** → don't touch the file.

**Never overwrite the whole file.** Other parallel sessions keep their own sections in it. Edit only yours. If it's unclear which section belongs to this session's work, ask.

Section format, under ~10 lines, written so the next session can continue without asking:

```
## <Ticket ID or topic> (last synced YYYY-MM-DD)
- **Task:** what it is
- **Done so far:** …
- **Next step:** the one concrete next action
- **Blocked:** only if something blocks this task
- **Decisions:** only those that shape the rest of this task
```

Nothing below the file's header means nothing is in progress.

## 3. CLAUDE.md

1. **Decide first** — did this session surface a new convention, gotcha, or structural codebase change worth documenting in CLAUDE.md? Most sessions don't.
2. **If yes** — read the current file, then update:
   - Add new conventions we established
   - Add new gotchas we discovered
   - Update structure notes if codebase changed significantly
   - Remove outdated info
3. **If no** — don't read the file. Report "no CLAUDE.md changes" in the summary.

Don't invent — only add things we actually discussed or discovered this session.

Show me a summary of what you updated in each file.

## 4. SESSION_HISTORY.md
Read the current file first (Read tool with `offset` — the file is long, you only need the tail), then create a compact version of the current session summary from SCRATCHPAD.md (max 15 lines). Append it at the bottom of the file **with the Edit tool** (anchor on the last entry's closing lines) — never with a shell append.
- **This step covers every session still unarchived, not just the current one.** Before finishing, check that each session summary in SCRATCHPAD has an entry here (by session number). A parallel session that wrote its SCRATCHPAD summary but skipped this step leaves a gap — write the missing entry from its SCRATCHPAD summary and insert it in number order, not at the end. (Seen 2026-09-30.)
- Entries are in chronological order (oldest at top, newest at bottom). New sessions always go at the end.
- No open checkboxes. Only what was done. If things were left open, write it down, but we don't use this to track. 
- Point of this document is only to have a history we can search, if needed. This could be for questions like, "when did we decide xy" or "remember when we talked about xy" Usually this file goes ignored. 
