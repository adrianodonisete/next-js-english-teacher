'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeyRound, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, { error: '' })

  return (
    <div className="mx-auto flex h-dvh max-w-sm flex-col items-center justify-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
            <KeyRound className="size-6 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Access Required</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your access token to continue
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            name="token"
            type="password"
            placeholder="Access token"
            disabled={pending}
            autoFocus
            autoComplete="off"
          />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Verifying...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
