-- Enums
create type exercise_type as enum ('pushup', 'pullup', 'squat');
create type time_slot     as enum ('morning', 'afternoon', 'evening');
create type friend_status as enum ('pending', 'accepted', 'blocked');
create type reaction_type as enum ('fire', 'clap', 'muscle', 'star');

-- User profiles (synced from Clerk via webhook)
create table public.profiles (
  id            text primary key,            -- matches Clerk user ID string
  username      text unique not null,
  display_name  text,
  avatar_url    text,
  invite_code   text unique default gen_random_uuid()::text,
  timezone      text default 'UTC',
  created_at    timestamptz default now()
);

-- Baseline test results (one active per user)
create table public.baselines (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null references public.profiles(id) on delete cascade,
  pushup_max    int not null,
  pullup_max    int not null,
  squat_max     int not null,
  assessed_at   timestamptz default now(),
  is_active     boolean default true
);
create unique index baselines_active_user_idx on public.baselines(user_id) where is_active = true;

-- Daily plan container
create table public.daily_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null references public.profiles(id) on delete cascade,
  plan_date   date not null,
  unique(user_id, plan_date)
);

-- Individual sets within a daily plan
create table public.planned_sets (
  id              uuid primary key default gen_random_uuid(),
  daily_plan_id   uuid not null references public.daily_plans(id) on delete cascade,
  exercise        exercise_type not null,
  set_number      int not null,
  target_reps     int not null,
  slot            time_slot not null,
  scheduled_time  time,
  sort_order      int not null,
  is_completed    boolean default false,
  unique(daily_plan_id, exercise, set_number)
);

-- Completed set log
create table public.completed_sets (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null references public.profiles(id) on delete cascade,
  planned_set_id  uuid references public.planned_sets(id),
  exercise        exercise_type not null,
  reps_completed  int not null,
  cadence_bpm     int,
  completed_at    timestamptz default now(),
  log_date        date generated always as (completed_at::date) stored
);
create index completed_sets_user_date_idx on public.completed_sets(user_id, log_date);

-- Streak tracking
create table public.streaks (
  user_id         text primary key references public.profiles(id) on delete cascade,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_active_date date
);

-- Friendships
create table public.friendships (
  id              uuid primary key default gen_random_uuid(),
  requester_id    text not null references public.profiles(id) on delete cascade,
  addressee_id    text not null references public.profiles(id) on delete cascade,
  status          friend_status default 'pending',
  created_at      timestamptz default now(),
  check (requester_id <> addressee_id),
  unique(requester_id, addressee_id)
);

-- Cheer reactions on completions
create table public.cheers (
  id               uuid primary key default gen_random_uuid(),
  from_user_id     text not null references public.profiles(id) on delete cascade,
  to_user_id       text not null references public.profiles(id) on delete cascade,
  completed_set_id uuid references public.completed_sets(id),
  reaction         reaction_type not null,
  created_at       timestamptz default now()
);

-- Web Push subscriptions
create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null references public.profiles(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth_key   text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

-- Notification preferences
create table public.notification_prefs (
  user_id             text primary key references public.profiles(id) on delete cascade,
  set_reminders       boolean default true,
  reminder_lead_mins  int default 10,
  idle_reminder_mins  int default 60,
  streak_alerts       boolean default true,
  friend_cheers       boolean default true,
  quiet_start         time default '22:00',
  quiet_end           time default '07:00'
);

-- Row Level Security (RLS)
alter table public.profiles           enable row level security;
alter table public.baselines          enable row level security;
alter table public.daily_plans        enable row level security;
alter table public.planned_sets       enable row level security;
alter table public.completed_sets     enable row level security;
alter table public.streaks            enable row level security;
alter table public.friendships        enable row level security;
alter table public.cheers             enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_prefs enable row level security;

-- Profiles: Public read, self write
create policy "Allow public read of profiles" on public.profiles for select using (true);
create policy "Allow users to update own profile" on public.profiles for update using (auth.jwt() ->> 'sub' = id);
create policy "Allow service role insert" on public.profiles for insert with check (true);

-- Baselines: Read and write own
create policy "Users can read own baselines" on public.baselines for select using (auth.jwt() ->> 'sub' = user_id);
create policy "Users can insert own baselines" on public.baselines for insert with check (auth.jwt() ->> 'sub' = user_id);
create policy "Users can update own baselines" on public.baselines for update using (auth.jwt() ->> 'sub' = user_id);

-- Daily plans: Read and write own
create policy "Users can read own daily plans" on public.daily_plans for select using (auth.jwt() ->> 'sub' = user_id);
create policy "Users can insert own daily plans" on public.daily_plans for insert with check (auth.jwt() ->> 'sub' = user_id);

-- Planned sets: Read and update own via daily plans
create policy "Users can read planned sets" on public.planned_sets for select using (
  exists (select 1 from public.daily_plans where id = planned_sets.daily_plan_id and user_id = auth.jwt() ->> 'sub')
);
create policy "Users can update planned sets" on public.planned_sets for update using (
  exists (select 1 from public.daily_plans where id = planned_sets.daily_plan_id and user_id = auth.jwt() ->> 'sub')
);
create policy "Users can insert planned sets" on public.planned_sets for insert with check (
  exists (select 1 from public.daily_plans where id = planned_sets.daily_plan_id and user_id = auth.jwt() ->> 'sub')
);

-- Completed sets: Read own and friends', insert own
create policy "Users can read own completed sets" on public.completed_sets for select using (
  auth.jwt() ->> 'sub' = user_id or
  exists (
    select 1 from public.friendships
    where (requester_id = auth.jwt() ->> 'sub' and addressee_id = completed_sets.user_id and status = 'accepted')
       or (addressee_id = auth.jwt() ->> 'sub' and requester_id = completed_sets.user_id and status = 'accepted')
  )
);
create policy "Users can insert own completed sets" on public.completed_sets for insert with check (auth.jwt() ->> 'sub' = user_id);

-- Streaks: Read own and friends'
create policy "Users can read streaks" on public.streaks for select using (true);
create policy "Users can update own streaks" on public.streaks for update using (auth.jwt() ->> 'sub' = user_id);
create policy "Users can insert own streaks" on public.streaks for insert with check (auth.jwt() ->> 'sub' = user_id);

-- Friendships: Read and manage own
create policy "Users can read own friendships" on public.friendships for select using (
  auth.jwt() ->> 'sub' = requester_id or auth.jwt() ->> 'sub' = addressee_id
);
create policy "Users can insert friendships" on public.friendships for insert with check (
  auth.jwt() ->> 'sub' = requester_id
);
create policy "Users can update friendships" on public.friendships for update using (
  auth.jwt() ->> 'sub' = addressee_id or auth.jwt() ->> 'sub' = requester_id
);

-- Cheers: Read and send
create policy "Users can read cheers" on public.cheers for select using (
  auth.jwt() ->> 'sub' = from_user_id or auth.jwt() ->> 'sub' = to_user_id
);
create policy "Users can insert cheers" on public.cheers for insert with check (
  auth.jwt() ->> 'sub' = from_user_id
);

-- Push subscriptions: Own only
create policy "Users manage own push subscriptions" on public.push_subscriptions for all using (
  auth.jwt() ->> 'sub' = user_id
);

-- Notification prefs: Own only
create policy "Users manage own notification prefs" on public.notification_prefs for all using (
  auth.jwt() ->> 'sub' = user_id
);

-- Realtime (social feed tables)
alter publication supabase_realtime add table public.completed_sets;
alter publication supabase_realtime add table public.cheers;
alter publication supabase_realtime add table public.friendships;
