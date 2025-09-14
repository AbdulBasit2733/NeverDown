import { Metadata } from 'next'
import { SigninForm } from '@/components/auth/signin-form'

export const metadata: Metadata = {
  title: 'Sign In - NeverDown',
  description: 'Sign in to your NeverDown account to access your dashboard and monitoring tools.',
}

export default function SigninPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-600/90" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-6 w-6 rounded bg-white/20" />
          NeverDown
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "NeverDown has transformed our infrastructure monitoring. We've achieved 99.99% uptime since switching."
            </p>
            <footer className="text-sm opacity-80">Sofia Davis, CTO at TechFlow</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <SigninForm />
        </div>
      </div>
    </div>
  )
}
