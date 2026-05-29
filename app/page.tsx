"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function MessageBubble({ role, parts }: { role: string; parts: Array<{ type: string; text?: string }> }) {
  const isUser = role === 'user';
  const content = parts.map(p => (p.type === 'text' ? p.text : '')).join('');
  return (
    <div className={cn('flex items-start gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
        isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
      )}>
        {content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, status, sendMessage, error } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';
  const isReady = status === 'ready';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col">
      <header className="border-b border-border px-4 py-3 text-center">
        <h1 className="text-lg font-semibold">English Teacher</h1>
        <p className="text-xs text-muted-foreground">Practice English with AI</p>
      </header>

      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto mb-3 size-12 text-muted-foreground" />
              <h2 className="text-lg font-medium text-foreground">Start a conversation</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Say hello and practice your English!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} parts={m.parts} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="size-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {error && (
        <div className="mx-4 mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message || 'Something went wrong. Please try again.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!isReady}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!isReady || input.trim() === ''}>
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}