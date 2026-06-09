'use server'

import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

const model = openrouter(process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free')

export async function translateAction(source: string, target: string, prompt: string): Promise<string> {
  const result = await generateText({
    model,
    system: `You are a translator. Translate the following text from ${source} to ${target}. Return only the translated text, no explanations, no notes, no formatting.`,
    prompt,
  })

  return result.text
}