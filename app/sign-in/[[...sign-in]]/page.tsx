import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Continue your journey to unlock your heart&apos;s secrets</p>
        </div>

        <SignIn
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
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}