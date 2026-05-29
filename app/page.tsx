"use client";

import React, { useState } from 'react';
import { useChat, Chat } from '@ai-sdk/react';
import { createOpenAI } from '@ai-sdk/openai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const model = openrouter(process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free');
  const chat = new Chat({ model });
  const { messages, status, sendMessage, error } = useChat({
    chat,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div>test</div>
  );
}