<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mem0-memory -->
## Memory persistence with mem0

This project has mem0 memory tools in `.opencode/tools/memory.ts`.

**Rules:**
- At the start of every session (or when a user gives non-trivial context), call `memory_search` with the user's query to retrieve relevant past context.
- When you learn important information about the user (name, preferences, goals, constraints), call `memory_add` to persist it.
- Always pass `userId` as `"opencode-default"` unless told otherwise.
- Don't store trivial or transient info. Store facts that would be useful in future sessions.
<!-- END:mem0-memory -->
