# English Teacher Chatbot Implementation Plan

## Project Overview
Create a Next.js 14+ chatbot application using TypeScript, Tailwind CSS, and shadcn/ui where users can practice English with an AI that acts as a friendly, patient teacher who gently corrects mistakes.

## Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: Vercel AI SDK + OpenRouter API
- **State Management**: Vercel AI's `useChat` hook

## Folder Structure
```
english-teacher/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenRouter API handler
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main chat interface
├── components/
│   └── chat-ui.tsx               # Reusable chat UI components (optional)
├── lib/
│   └── openrouter.ts             # OpenRouter client helper (optional)
├── public/
│   └── ...                       # Static assets
├── styles/
│   └── globals.css               # Global styles
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Implementation Steps

### 1. Project Initialization
```bash
npx create-next-app@latest english-teacher --ts --tailwind --app --eslint --src-dir --import-alias="@/*"
cd english-teacher
```

### 2. Dependency Installation
```bash
npm install ai @ai-sdk/openrouter
npm install -D @types/node
# shadcn/ui components (follow their installation guide)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input textarea scroll-area
```

### 3. Environment Setup
Create `.env.example`:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
```

### 4. Main Chat Page (`app/page.tsx`)
```typescript
import { useChat } from '@ai-sdk/react';
import { Button, Input } from '@/components/ui';
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaViewport } from '@/components/ui/scroll-area';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free'
    }
  });

  return (
    <div className="flex h-[90vh] w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-hidden border">
        <ScrollArea className="h-full w-full">
          <ScrollAreaViewport className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                <div className={`${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg p-3`}>
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollAreaViewport>
          {isLoading && <div className="p-2 text-center">AI is typing...</div>}
          <ScrollAreaScrollbar />
        </ScrollArea>
        
        <div className="flex p-2 gap-2 border-t">
          <Input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSubmit} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5. API Route Handler (`app/api/chat/route.ts`)
```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenRouter } from '@ai-sdk/openrouter';

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openrouter.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
    stream: true,
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

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

### 6. Configuration Files

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**app/layout.tsx**
```typescript
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'English Teacher Chatbot',
  description: 'Practice English with an AI teacher',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**styles/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}
```

### 7. Key Features to Implement

**Chat Interface:**
- Scrollable message container (using shadcn/ui ScrollArea)
- Adaptive text input that expands with content
- Send button that disables on empty input or loading state
- Visual distinction between user and AI messages

**AI Behavior:**
- System prompt that defines AI as English teacher
- Gentle correction approach: respond first, then suggest improvements
- Encouraging, natural tone throughout conversation

**Technical Implementation:**
- Streaming responses via Vercel AI SDK
- Proper error handling in API route
- Environment variable validation
- Responsive design for mobile/desktop

### 8. Development Commands
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

### 9. Testing Considerations
- Test with various English proficiency levels
- Verify correction mechanism works appropriately
- Check streaming response handling
- Validate mobile responsiveness
- Ensure API key is never exposed in client code

### 10. Optional Enhancements
- Message persistence using localStorage or database
- Voice input/output capabilities
- Topic selection for practice sessions
- Progress tracking and streaks
- Customizable correction intensity
- Translation assistance feature

This plan provides a complete roadmap for building the English teacher chatbot application with all requested features and technical specifications.