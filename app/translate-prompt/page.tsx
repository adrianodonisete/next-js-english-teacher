'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { translateAction } from '@/app/actions/translate'
import { Languages, Loader2, ArrowRight } from 'lucide-react'

const LANGUAGES = [
  'Brazilian Portuguese',
  'English',
  'Spanish',
  'French',
  'German',
] as const

export default function TranslatePromptPage() {
  const [sourceLang, setSourceLang] = useState('Brazilian Portuguese')
  const [targetLang, setTargetLang] = useState('English')
  const [prompt, setPrompt] = useState('')
  const [translated, setTranslated] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async () => {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    setError('')
    try {
      const result = await translateAction(sourceLang, targetLang, prompt)
      setTranslated(result)
    } catch {
      setError('Translation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <header className="border-b border-border px-4 py-3 text-center">
        <h1 className="text-lg font-semibold">Translate Prompt</h1>
        <p className="text-xs text-muted-foreground">Translate text between languages</p>
      </header>

      <div className="flex items-center justify-center gap-4 border-b border-border px-4 py-3">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <Languages className="size-4 shrink-0 text-muted-foreground" />

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 items-stretch gap-2 p-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter text to translate..."
          className="flex-1 resize-none"
        />

        <div className="flex shrink-0 items-center">
          <Button
            onClick={handleTranslate}
            size="icon"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </Button>
        </div>

        <Textarea
          value={translated}
          readOnly
          placeholder="Translation will appear here..."
          className="flex-1 resize-none"
        />
      </div>

      {error && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}
    </div>
  )
}