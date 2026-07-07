-- HydroTrack v2 migration: run this against an existing project that
-- already has the original schema.sql applied (i.e. your live project).
-- Safe to re-run.

alter table public.profiles
  add column if not exists theme text not null default 'system'
    check (theme in ('system', 'light', 'dark'));

alter table public.intake_logs
  add column if not exists drink_type text not null default 'water'
    check (drink_type in ('water', 'coffee', 'tea', 'soda', 'juice', 'alcohol'));

alter table public.reminders
  add column if not exists message text;

create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

create index if not exists achievements_user_id_idx on public.achievements (user_id);

alter table public.achievements enable row level security;

drop policy if exists "achievements_select_own" on public.achievements;
create policy "achievements_select_own" on public.achievements
  for select using (auth.uid() = user_id);

drop policy if exists "achievements_insert_own" on public.achievements;
create policy "achievements_insert_own" on public.achievements
  for insert with check (auth.uid() = user_id);

drop policy if exists "achievements_delete_own" on public.achievements;
create policy "achievements_delete_own" on public.achievements
  for delete using (auth.uid() = user_id);
