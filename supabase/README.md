# HydroTrack Supabase setup

1. Create a new project at https://supabase.com.
2. In the SQL editor, run `schema.sql` from this folder. It creates:
   - `profiles` — one row per user (goal, unit, gender, weight/height, reminder settings)
   - `intake_logs` — every logged drink
   - `reminders` — the notification schedule
   - Row Level Security policies so each user can only read/write their own rows
   - A trigger that auto-creates a `profiles` row when a new `auth.users` row is inserted (covers email and anonymous sign-ups)
3. In **Authentication → Providers**, enable:
   - **Email** (with "Confirm email" off if you want instant sign-in during development)
   - **Anonymous sign-ins** (Authentication → Settings → toggle "Allow anonymous sign-ins")
4. Copy your project URL and anon public key (Project Settings → API) into `.env` at the repo root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. **Password reset uses a 6-digit code instead of an email link**, since the app has no
   website to redirect a magic link back to. In **Authentication → Email Templates → Reset
   Password**, edit the template so it shows `{{ .Token }}` as plain text (e.g. add a line like
   `Your code is: {{ .Token }}`) instead of relying solely on `{{ .ConfirmationURL }}`. Without
   this change, `ForgotPasswordScreen` will send an email but the code shown in
   `ResetPasswordScreen` won't match anything.
