import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - NeverDown',
  description: 'Sign in to your NeverDown account or create a new one to get started.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {children}
    </div>
  )
}
