"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const components: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-muted/50 px-1 py-0.5 font-mono text-xs"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="my-2 block overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-xs"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => (
    <h1 className="mb-2 mt-3 text-lg font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-3 text-base font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-2 text-sm font-medium">{children}</h4>
  ),
  hr: () => <hr className="my-3 border-border" />,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
