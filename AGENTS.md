<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mem0-memory -->

## Memory persistence with mem0

**OpenCode** (`memory.ts` plugin): tools are `search` and `add`, reads `MEM0_API_KEY` from `.env.local`.

**Cursor** (`user-mem0` MCP): tools are `search_memories` and `add_memory`. See `.cursor/rules/mem0.mdc`.

**Rules (both environments):**

- At the start of every session (or when a user gives non-trivial context), search memories with the user's query to retrieve relevant past context.
- When you learn important information about the user (name, preferences, goals, constraints), persist it.
- Always use `userId` / `user_id` = `"opencode-default"` unless told otherwise.
- Don't store trivial or transient info. Store facts that would be useful in future sessions.
  <!-- END:mem0-memory -->
