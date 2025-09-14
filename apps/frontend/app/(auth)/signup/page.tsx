import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up - NeverDown',
  description: 'Create your NeverDown account and start monitoring your infrastructure with 99.9% uptime guarantee.',
}

export default function SignupPage() {
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
              "Setting up monitoring was incredibly easy. The onboarding process took less than 5 minutes."
            </p>
            <footer className="text-sm opacity-80">Marcus Rodriguez, DevOps Engineer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
