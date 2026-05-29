import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const model = openrouter(process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    messages: [
      {
        role: 'system',
        content: `You are a friendly and patient English teacher. 
        - Respond naturally to the user's messages
        - After responding, gently correct any grammar or vocabulary mistakes 
        - Maintain an encouraging and supportive tone
        - Keep corrections brief and educational`
      },
      ...messages
    ],
  });

  return result.toTextStreamResponse();
}