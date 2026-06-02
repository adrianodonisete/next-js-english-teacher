'use client'

import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/actions/auth'

const NAV_LINKS = [
  { label: 'Models', href: 'https://openrouter.ai/models' },
  { label: 'OpenCode', href: 'https://opencode.ai/go' },
] as const

export function NavBar() {
  const pathname = usePathname()
  if (pathname === '/login') return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          >
            <LogOut className="size-3.5" />
            Logout
          </Button>
        </form>
      </div>
    </nav>
  )
}
