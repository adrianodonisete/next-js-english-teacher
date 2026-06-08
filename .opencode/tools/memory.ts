import { tool } from "@opencode-ai/plugin"
import { readFileSync } from "fs"
import { join } from "path"

const MEM0_API_URL = "https://api.mem0.ai"

function loadEnvFile(): Record<string, string> {
  try {
    const envPath = join(process.cwd(), ".env.local")
    const content = readFileSync(envPath, "utf-8")
    const vars: Record<string, string> = {}
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim()
    }
    return vars
  } catch {
    return {}
  }
}

async function getApiKey(): Promise<string> {
  const key = process.env.MEM0_API_KEY || loadEnvFile().MEM0_API_KEY
  if (!key) {
    throw new Error(
      "MEM0_API_KEY not set. Set it in your shell profile:\n" +
        '  export MEM0_API_KEY="m0-your-key-here"\n' +
        "Or prepend when launching opencode:\n" +
        '  MEM0_API_KEY="m0-your-key-here" opencode'
    )
  }
  return key
}

async function mem0Fetch(
  path: string,
  options: { method?: string; body?: Record<string, unknown> }
) {
  const apiKey = await getApiKey()
  const response = await fetch(`${MEM0_API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`mem0 API error (${response.status}): ${text}`)
  }
  return response.json()
}

function formatMemories(results: { results?: Array<{ id: string; memory: string }> }): string {
  if (!results.results?.length) return "No relevant memories found."
  return results.results
    .map((m, i) => `${i + 1}. ${m.memory}`)
    .join("\n")
}

export const search = tool({
  description:
    "Search mem0 memory for relevant context from past conversations. Call this at the start of every session to retrieve information about the user, project, or task.",
  args: {
    query: tool.schema
      .string()
      .describe(
        "The search query. Use the user's message or current task as the query."
      ),
    userId: tool.schema
      .string()
      .optional()
      .describe("User ID to scope the search. Defaults to 'opencode-default'."),
  },
  async execute(args) {
    const results = await mem0Fetch("/v1/memories/search/", {
      method: "POST",
      body: {
        query: args.query,
        user_id: args.userId ?? "opencode-default",
      },
    })
    return formatMemories(results as { results?: Array<{ id: string; memory: string }> })
  },
})

export const add = tool({
  description:
    "Store a new memory in mem0. Call this after learning important information about the user (preferences, goals, constraints) or project context that should persist across sessions.",
  args: {
    text: tool.schema
      .string()
      .describe("The information to remember. Write it as a clear, concise statement."),
    userId: tool.schema
      .string()
      .optional()
      .describe("User ID to associate the memory with. Defaults to 'opencode-default'."),
  },
  async execute(args) {
    const result = await mem0Fetch("/v1/memories/", {
      method: "POST",
      body: {
        messages: [{ role: "user", content: args.text }],
        user_id: args.userId ?? "opencode-default",
      },
    })
    return `Memory stored successfully.\n${JSON.stringify(result)}`
  },
})