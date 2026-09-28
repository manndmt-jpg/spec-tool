# CLAUDE.md - Spec Tool

## Project Overview

Claude Code skill (`/spec`) and slash command (`/sync`) for managing Linear tickets and Notion specs. The skill carries opinionated conventions for ticket structure, refinement workflow, and spec page writing. Calls tools on the user's installed Linear and Notion MCP connectors — no custom MCP server lives in this repo.

## Quick Start

```bash
# Install MCP connectors via Claude Code Settings → Connectors:
#   - Linear (official connector)
#   - Notion (e.g. Notion Connect)

# Install skill + command
cp -r skills/spec ~/.claude/skills/      # /spec — ticket & spec management
cp commands/sync.md ~/.claude/commands/  # /sync — wrap-up docs

# Set up your workspace
cp config.example.json /your-team-folder/config.json
# Fill in linearTeamId, workspaceSlug, notionDatabaseId, teamName

# Use
cd your-team-folder
/spec
```

**Note:** Source files live in this repo. Claude Code reads from `~/.claude/skills/spec/` and `~/.claude/commands/`. After editing the repo, re-run the install copy commands.

## Project Structure

```
spec-tool/
├── skills/
│   └── spec/                 # /spec skill (directory)
│       ├── SKILL.md          # Entry point + interactive setup + prerequisites
│       ├── ticket-conventions.md
│       ├── ticket-workflows.md
│       ├── page-conventions.md
│       └── spec-workflows.md
├── commands/
│   └── sync.md               # /sync — wrap-up docs command
├── config.example.json       # Config template (per-team)
├── CLAUDE.md                 # This file
└── README.md                 # Public-facing setup docs
```

## Connectors

The `/spec` skill expects two MCP connectors installed in Claude Code:

- **Linear connector** — function names referenced throughout: `list_issues`, `get_issue`, `list_comments`, `save_issue`, `save_comment`, `list_milestones`, `save_milestone`, `list_projects`, `save_project`, `list_initiatives`.
- **Notion connector** — function names referenced: `notion-fetch`, `notion-search`, `notion-update-page` / `update_content`.

Exact tool IDs (including any prefix) vary by connector vendor. The skill uses the function-name suffix and assumes the user's installed connector exposes them.

## Ticket Format

Refined tickets follow this section order (full rules in [skills/spec/ticket-conventions.md](skills/spec/ticket-conventions.md)):

1. **Story** (User / Improvement / Problem)
2. **Business Context** — business facts only, no implementation
3. **Product / Feature Specifications** — concrete behavior
4. **Implementation Pointers** — codebase entry points
5. **Acceptance Criteria** — outcome-focused checklist

## Conventions

- Always fetch comments when getting a ticket (contain important context)
- Config (team ID, workspace slug, database ID) comes from `config.json` in working directory
- Per-team conventions live in the team's own repo / project CLAUDE.md — this repo only carries generic conventions
