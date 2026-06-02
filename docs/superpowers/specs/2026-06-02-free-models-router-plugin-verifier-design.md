# Design: Set Free Models Router for plugin-verifier Agent

**Date:** 2026-06-02
**Status:** Draft
**Scope:** Single-file change

## Goal

Configure the `plugin-verifier` subagent to use OpenRouter's Free Models Router (`openrouter/free`) so the agent runs on free models with zero API cost.

## Context

- The `plugin-verifier` subagent exists at `.opencode/agents/agents/plugin-verifier.md`.
- OpenRouter is already authenticated in `~/.local/share/opencode/auth.json` with an API key.
- The Free Models Router (`openrouter/free`) automatically selects a random free model from OpenRouter, filtering by capabilities the request needs.
- Only this agent should use the router; other agents keep their current models.

## Approach

Add a single `model` field to the agent's YAML frontmatter:

```yaml
---
description: >-
  Check if the plugins superpowers, agent-md, rtk and caveman are installed and
  configured correctly in the opencode environment. If any plugin is missing or
  misconfigured, prompt the user to install or configure it appropriately.
mode: subagent
model: openrouter/free
permission:
  edit: deny
  webfetch: deny
  task: deny
  todowrite: deny
  websearch: deny
  lsp: deny
  skill: deny
---
```

The model field is self-contained in the agent definition — no CLI flag, no project-level config, no global config change.

## File to Change

- `.opencode/agents/agents/plugin-verifier.md` — add `model: openrouter/free` to frontmatter

## Verification

1. Run `opencode --agent plugin-verifier` and confirm the agent starts.
2. The first model call should hit OpenRouter. Confirm with `opencode stats` or the TUI which model responded.
3. Verify the response's `model` field (in TUI logs) shows one of the free models (e.g., `upstage/solar-pro-3:free`, `meta-llama/llama-3.3-70b-instruct:free`, etc.) — proves the router is active.

## Out of Scope

- Other agents (build, compaction, explore, general, plan, summary, title) keep their current models.
- No changes to `opencode.jsonc`.
- No changes to global config in `~/.config/opencode/`.
- No new plugins installed.

## Risks

- Free models may be slower, rate-limited, or unavailable. The agent's task is read-only verification, so worst case is the user gets a slow or unavailable response.
- The router picks a random model, so output quality may vary per invocation.
