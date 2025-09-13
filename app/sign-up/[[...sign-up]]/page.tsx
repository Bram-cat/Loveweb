import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Lovelock</h1>
          <p className="text-gray-600">Start your journey to discover your love destiny</p>
        </div>

        <SignUp
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#667eea',
              colorBackground: '#ffffff',
              borderRadius: '12px'
            },
            elements: {
              rootBox: 'shadow-2xl',
              card: 'shadow-2xl border-0',
            }
          }}
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}