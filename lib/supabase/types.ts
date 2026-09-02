export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ExerciseType = 'pushup' | 'pullup' | 'squat'
export type TimeSlot = 'morning' | 'afternoon' | 'evening'
export type FriendStatus = 'pending' | 'accepted' | 'blocked'
export type ReactionType = 'fire' | 'clap' | 'muscle' | 'star'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          invite_code: string
          timezone: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          invite_code?: string
          timezone?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          invite_code?: string
          timezone?: string
          created_at?: string
        }
      }
      baselines: {
        Row: {
          id: string
          user_id: string
          pushup_max: number
          pullup_max: number
          squat_max: number
          assessed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          pushup_max: number
          pullup_max: number
          squat_max: number
          assessed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          pushup_max?: number
          pullup_max?: number
          squat_max?: number
          assessed_at?: string
          is_active?: boolean
        }
      }
      daily_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
        }
      }
      planned_sets: {
        Row: {
          id: string
          daily_plan_id: string
          exercise: ExerciseType
          set_number: number
          target_reps: number
          slot: TimeSlot
          scheduled_time: string | null
          sort_order: number
          is_completed: boolean
        }
        Insert: {
          id?: string
          daily_plan_id: string
          exercise: ExerciseType
          set_number: number
          target_reps: number
          slot: TimeSlot
          scheduled_time?: string | null
          sort_order: number
          is_completed?: boolean
        }
        Update: {
          id?: string
          daily_plan_id?: string
          exercise?: ExerciseType
          set_number?: number
          target_reps?: number
          slot?: TimeSlot
          scheduled_time?: string | null
          sort_order?: number
          is_completed?: boolean
        }
      }
      completed_sets: {
        Row: {
          id: string
          user_id: string
          planned_set_id: string | null
          exercise: ExerciseType
          reps_completed: number
          cadence_bpm: number | null
          completed_at: string
          log_date: string
        }
        Insert: {
          id?: string
          user_id: string
          planned_set_id?: string | null
          exercise: ExerciseType
          reps_completed: number
          cadence_bpm?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          planned_set_id?: string | null
          exercise?: ExerciseType
          reps_completed?: number
          cadence_bpm?: number | null
          completed_at?: string
        }
      }
      streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: FriendStatus
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: FriendStatus
          created_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: FriendStatus
          created_at?: string
        }
      }
      cheers: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          completed_set_id: string | null
          reaction: ReactionType
          created_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          completed_set_id?: string | null
          reaction: ReactionType
          created_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          completed_set_id?: string | null
          reaction?: ReactionType
          created_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth_key: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth_key: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth_key?: string
          created_at?: string
        }
      }
      notification_prefs: {
        Row: {
          user_id: string
          set_reminders: boolean
          reminder_lead_mins: number
          idle_reminder_mins: number
          streak_alerts: boolean
          friend_cheers: boolean
          quiet_start: string
          quiet_end: string
        }
        Insert: {
          user_id: string
          set_reminders?: boolean
          reminder_lead_mins?: number
          idle_reminder_mins?: number
          streak_alerts?: boolean
          friend_cheers?: boolean
          quiet_start?: string
          quiet_end?: string
        }
        Update: {
          user_id?: string
          set_reminders?: boolean
          reminder_lead_mins?: number
          idle_reminder_mins?: number
          streak_alerts?: boolean
          friend_cheers?: boolean
          quiet_start?: string
          quiet_end?: string
        }
      }
    }
  }
}