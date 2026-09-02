'use client'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">CenturyFit</h1>
        <p className="text-muted-foreground text-center mb-8">
          100 push-ups, pull-ups, and squats every day
        </p>

        <div className="space-y-4">
          <button
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            onClick={() => alert('Sign in with Google would appear with Clerk keys configured')}
          >
            Continue with Google
          </button>

          <button
            className="w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold"
            onClick={() => alert('Sign in with Apple would appear with Clerk keys configured')}
          >
            Continue with Apple
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full py-3 px-4 bg-input border border-border rounded-lg text-foreground"
            />
            <button className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-lg font-semibold">
              Continue with Email
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}