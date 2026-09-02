// Guest identity stored in localStorage. A guest is identified by a username
// they chose on the landing page. When they sign in via Clerk, the app syncs
// their local IDB data to Supabase and clears guest state.

const GUEST_KEY = 'centuryfit_guest'

export interface GuestUser {
  username: string
  createdAt: string
}

export function getGuest(): GuestUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? (JSON.parse(raw) as GuestUser) : null
  } catch {
    return null
  }
}

export function setGuest(username: string): GuestUser {
  const guest: GuestUser = { username, createdAt: new Date().toISOString() }
  localStorage.setItem(GUEST_KEY, JSON.stringify(guest))
  return guest
}

export function clearGuest(): void {
  localStorage.removeItem(GUEST_KEY)
}

export function isGuestUsername(username: string): boolean {
  return username.trim().length >= 2 && username.trim().length <= 30
}
