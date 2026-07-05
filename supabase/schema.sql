-- HydroTrack Supabase schema
-- Run this file in the Supabase SQL editor (or via `supabase db push`)
-- against a fresh project. Safe to re-run: uses IF NOT EXISTS / OR REPLACE.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles
-- One row per auth.users row. Holds onboarding + settings data.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  gender text check (gender in ('male', 'female', 'other')) default 'other',
  weight_kg numeric(5, 2),
  height_cm numeric(5, 2),
  daily_goal_ml integer not null default 2000,
  unit text not null check (unit in ('ml', 'oz')) default 'ml',
  language text not null default 'en',
  reminder_mode text not null check (reminder_mode in ('auto', 'manual')) default 'auto',
  mute_start time,
  mute_end time,
  further_reminder boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Per-user HydroTrack profile & settings, one row per auth user.';

-- ============================================================
-- intake_logs
-- Every logged drink of water.
-- ============================================================
create table if not exists public.intake_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount_ml integer not null check (amount_ml > 0),
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists intake_logs_user_id_logged_at_idx
  on public.intake_logs (user_id, logged_at desc);

-- ============================================================
-- reminders
-- Local-notification schedule, synced across devices.
-- ============================================================
create table if not exists public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  time time not null,
  days_of_week integer[] not null default '{0,1,2,3,4,5,6}',
  enabled boolean not null default true,
  sound text not null default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reminders_user_id_idx on public.reminders (user_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at
  before update on public.reminders
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auto-create a profile row whenever a new auth user signs up
-- (covers email, anonymous, and OAuth signups alike).
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.intake_logs enable row level security;
alter table public.reminders enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

drop policy if exists "intake_logs_select_own" on public.intake_logs;
create policy "intake_logs_select_own" on public.intake_logs
  for select using (auth.uid() = user_id);

drop policy if exists "intake_logs_insert_own" on public.intake_logs;
create policy "intake_logs_insert_own" on public.intake_logs
  for insert with check (auth.uid() = user_id);

drop policy if exists "intake_logs_update_own" on public.intake_logs;
create policy "intake_logs_update_own" on public.intake_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "intake_logs_delete_own" on public.intake_logs;
create policy "intake_logs_delete_own" on public.intake_logs
  for delete using (auth.uid() = user_id);

drop policy if exists "reminders_select_own" on public.reminders;
create policy "reminders_select_own" on public.reminders
  for select using (auth.uid() = user_id);

drop policy if exists "reminders_insert_own" on public.reminders;
create policy "reminders_insert_own" on public.reminders
  for insert with check (auth.uid() = user_id);

drop policy if exists "reminders_update_own" on public.reminders;
create policy "reminders_update_own" on public.reminders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "reminders_delete_own" on public.reminders;
create policy "reminders_delete_own" on public.reminders
  for delete using (auth.uid() = user_id);
