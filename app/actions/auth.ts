'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkRateLimit } from '@/lib/rate-limit'
import { createSession } from '@/lib/auth'

export async function loginAction(
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'

  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    const msg = rateCheck.retryAfter
      ? `Too many attempts. Try again in ${rateCheck.retryAfter} seconds.`
      : 'Too many attempts. Try again later.'
    return { error: msg }
  }

  const token = formData.get('token')?.toString().trim()

  if (!token) {
    return { error: 'Token is required.' }
  }

  if (!process.env.LOGIN_TOKEN) {
    return { error: 'Server authentication is not configured.' }
  }

  if (token !== process.env.LOGIN_TOKEN) {
    return { error: 'Invalid access token.' }
  }

  await createSession()
  redirect('/')
}
