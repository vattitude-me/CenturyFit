import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border backdrop-blur-lg bg-opacity-95">
        <div className="max-w-xl mx-auto flex justify-around items-center h-16 px-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">🏠</span>
            <span>Today</span>
          </Link>

          <Link
            href="/progress"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">📊</span>
            <span>Progress</span>
          </Link>

          <Link
            href="/friends"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">👥</span>
            <span>Friends</span>
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}