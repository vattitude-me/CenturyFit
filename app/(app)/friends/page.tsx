import { auth } from '@clerk/nextjs/server'

export default async function FriendsPage() {
  const { userId } = await auth()

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Friends</h1>
        <a
          href="/friends/invite"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
        >
          Invite
        </a>
      </div>

      <div className="space-y-4">
        {/* Friends list placeholder */}
        <div className="bg-secondary rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-3">Your Friends</h2>
          <p className="text-muted-foreground text-sm">
            Invite friends to see their progress and send cheers!
          </p>
          <button className="mt-4 w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Generate Invite Link
          </button>
        </div>

        {/* Activity feed placeholder */}
        <div className="bg-secondary rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-3">Activity Feed</h2>
          <p className="text-muted-foreground text-sm">
            Your friends' workouts will appear here. Tap to send a cheer! 🔥
          </p>
        </div>

        {/* Leaderboard placeholder */}
        <div className="bg-secondary rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-3">Weekly Leaderboard</h2>
          <p className="text-muted-foreground text-sm">
            Compete with your friends and climb the ranks!
          </p>
        </div>
      </div>
    </div>
  )
}