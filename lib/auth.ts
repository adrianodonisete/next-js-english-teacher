import { createHmac } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000
const SESSION_MAX_AGE_SEC = 24 * 60 * 60

function getSecret(): string {
  return process.env.LOGIN_TOKEN ?? ''
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function isSessionValid(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false

  const parts = cookieValue.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const expectedSig = signPayload(payload)

  if (signature !== expectedSig) return false

  const expiresAt = Number(payload)
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false

  return true
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const value = `${expiresAt}.${signPayload(String(expiresAt))}`

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
