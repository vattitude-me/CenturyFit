import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'centuryfit-offline'
const DB_VERSION = 1
const STORE_NAME = 'offline_sets'

export interface OfflineSet {
  id?: number
  user_id: string
  exercise: 'pushup' | 'pullup' | 'squat'
  reps_completed: number
  cadence_bpm?: number | null
  completed_at: string
}

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise && typeof window !== 'undefined') {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          })
        }
      },
    })
  }
  return dbPromise
}

export async function queueOfflineSet(set: Omit<OfflineSet, 'id'>): Promise<number> {
  const db = await getDB()
  if (!db) return -1
  return await db.add(STORE_NAME, set) as number
}

export async function getOfflineSets(): Promise<OfflineSet[]> {
  const db = await getDB()
  if (!db) return []
  return await db.getAll(STORE_NAME)
}

export async function deleteOfflineSet(id: number): Promise<void> {
  const db = await getDB()
  if (!db) return
  await db.delete(STORE_NAME, id)
}

export async function syncOfflineSets(): Promise<number> {
  const sets = await getOfflineSets()
  if (sets.length === 0) return 0

  let syncedCount = 0
  for (const set of sets) {
    try {
      const res = await fetch('/api/workout/complete-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: set.exercise,
          reps_completed: set.reps_completed,
          cadence_bpm: set.cadence_bpm,
          completed_at: set.completed_at,
        }),
      })

      if (res.ok) {
        if (set.id) await deleteOfflineSet(set.id)
        syncedCount++
      }
    } catch (err) {
      console.warn('Failed to sync set, will retry later:', err)
      break // Stop trying if offline
    }
  }

  return syncedCount
}