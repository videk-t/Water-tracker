# HydroTrack

A water intake tracker built with Expo, React Native, and Supabase.

## Features

- Email + anonymous (guest) auth
- Onboarding that suggests a daily goal from weight/height/gender
- Home screen with an SVG progress ring, quick-add buttons, a mascot with
  contextual messages, and an editable/deletable log of today's drinks
- Reminder scheduling (custom times + weekday repeat, mute-at-night window,
  "further reminder" nudge after the goal is hit) backed by local
  notifications (`expo-notifications`) synced from Supabase
- History screen with a weekly SVG bar chart, weekly/monthly stats, and a
  calendar-dot streak view
- Settings: reminder management, sound picker, Auto/Manual reminder mode,
  unit toggle (ml/oz), personal data, sign out

## Setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Create a Supabase project** and run `supabase/schema.sql` (see
   `supabase/README.md` for the full walkthrough — tables, RLS policies, and
   which auth providers to enable).

3. **Configure environment variables**

   ```sh
   cp .env.example .env
   # then fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

4. **Run the app**

   ```sh
   npm start
   ```

   Local push notifications require a development build or Expo Go on a
   physical device/simulator with notification permissions granted.

## Building for the Play Store

1. `npm install --save-dev eas-cli && npx eas login`
2. Fill in `PRIVACY.md` (replace the `[bracketed]` placeholders) and host it somewhere public
   — the Play Console requires a live privacy policy URL before you can submit.
3. `android.package` in `app.json` is set to `com.vip.hydrotrack`; change it if you want a
   different app ID (it must be globally unique on the Play Store).
4. Build a release bundle: `npx eas build --platform android --profile production` (see
   `eas.json` for build profiles — `development` and `preview` produce installable APKs for
   testing, `production` produces the `.aab` the Play Console expects).
5. Complete the Play Console listing: screenshots, description, content rating
   questionnaire, and the privacy policy URL from step 2.

## Project structure

```
src/
  components/   Reusable UI (progress ring, bar chart, mascot, cards, ...)
  constants/    Theme, cup sizes, weekday labels
  context/      Auth, profile, intake, and reminders state
  lib/          Supabase client
  navigation/   Root/auth/tab/settings navigators
  screens/      Auth, onboarding, home, history, settings screens
  services/     Supabase CRUD + goal calculation + notification scheduling
  types/        Shared TypeScript types
  utils/        Unit conversion, mascot messaging helpers
supabase/
  schema.sql    Tables, RLS policies, triggers
  README.md     Supabase project setup instructions
```
