import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Webhook + cron routes bypass Clerk auth (use their own secret verification)
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks/:path*',
  '/api/cron/:path*',
])

// Routes that only Clerk-authenticated users can call server-side
// (app pages allow guests via client-side check in layout instead)
const isClerkProtectedApi = createRouteMatcher([
  '/api/plan/:path*',
  '/api/push/:path*',
  '/api/workout/:path*',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) return
  if (isClerkProtectedApi(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
