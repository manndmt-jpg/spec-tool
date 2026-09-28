# Spec Tool

A Claude Code skill (`/spec`) and slash command (`/sync`) for managing Linear tickets and Notion specs together. Conventions for ticket structure, refinement, and spec writing — designed to be installed alongside your team's private config repo.

## Quick Start

**Joining an existing team?** Ask your team lead for their team config repo URL, then see [Team Setup](#team-setup).

**Setting up for yourself or a new team?** Follow [Full Setup](#full-setup) below.

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
| **Refine** | Format tickets to the standard structure (Story → Business Context → Specs → Implementation Pointers → Acceptance Criteria). Detail level: minimal or standard. |
| **Review** | View a ticket with comments, update description / priority / estimate / labels. |
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

---

## Full Setup

### 1. Install MCP Connectors

In Claude Code: Settings → Connectors → install:

- **Linear** (official connector — provides `list_issues`, `get_issue`, `save_issue`, `save_comment`, milestones, projects, initiatives, etc.)
- **Notion** (e.g. Notion Connect — provides `notion-fetch`, `notion-search`, `update_content`, etc.)

### 2. Install the Skill + Command

```bash
git clone https://github.com/manndmt-jpg/spec-tool
cd spec-tool

# Skill (directory)
cp -r skills/spec ~/.claude/skills/

# Slash command (single file)
cp commands/sync.md ~/.claude/commands/
```

### 3. Create Your Team Config Folder

Create a folder per team you work with. From inside that folder, run `/spec` — if no `config.json` exists, the skill walks you through interactive setup.

You can also create it by hand from the template:

```bash
cp /path/to/spec-tool/config.example.json ./config.json
# Edit linearTeamId, workspaceSlug, notionDatabaseId, teamName
```

### 4. Use

```bash
cd /path/to/your-team-folder
/spec
```

---

## Team Setup

**For teammates joining an existing team:**

```bash
# 1. Install the skill + command (one-time, see Full Setup step 2)
git clone https://github.com/manndmt-jpg/spec-tool
cp -r spec-tool/skills/spec ~/.claude/skills/
cp spec-tool/commands/sync.md ~/.claude/commands/

# 2. Install Linear + Notion MCP connectors (Settings → Connectors)

# 3. Clone your team's private config repo (your team lead has the URL)
git clone https://github.com/YOUR_ORG/your-team-config
cd your-team-config

# 4. Run /spec
/spec
```

The team config repo holds `config.json` (team IDs), a `CLAUDE.md` with team-specific conventions, optional team-shared reference docs, and any additional MCP server configs your team needs.

---

## Finding Your IDs

**Linear Team ID:**
- Team Settings → URL shows: `linear.app/team/TEAM_ID/settings`

**Linear Workspace Slug:**
- The slug in your Linear URLs: `linear.app/YOUR-SLUG/issue/...`
- Used to construct ticket links in drafts.

**Notion Database ID:**
- Open your specs database → URL shows: `notion.so/WORKSPACE/DATABASE_ID?v=...`
- Copy the 32-character ID before `?v=`.

---

## Conventions

The skill carries opinionated conventions for ticket structure, AC writing, spec page style, etc. See:
- [skills/spec/ticket-conventions.md](skills/spec/ticket-conventions.md) — ticket structure, ACs, testing tickets, bug tickets, organization
- [skills/spec/page-conventions.md](skills/spec/page-conventions.md) — Notion spec page writing rules
- [skills/spec/ticket-workflows.md](skills/spec/ticket-workflows.md) — Refine / Review / Validate / Status / Summarize
- [skills/spec/spec-workflows.md](skills/spec/spec-workflows.md) — Browse / Review / Update / Gap Analysis

Team-specific extensions (e.g. customer-facing language conventions, agent label lists, top-level LLM context page) belong in your team's private CLAUDE.md or reference file.
