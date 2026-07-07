export type Unit = 'ml' | 'oz';
export type Gender = 'male' | 'female' | 'other';
export type ReminderMode = 'auto' | 'manual';
export type ReminderSound = 'default' | 'none';
export type ThemePreference = 'system' | 'light' | 'dark';
export type DrinkType = 'water' | 'coffee' | 'tea' | 'soda' | 'juice' | 'alcohol';

export interface Profile {
  id: string;
  gender: Gender;
  weight_kg: number | null;
  height_cm: number | null;
  daily_goal_ml: number;
  unit: Unit;
  language: string;
  reminder_mode: ReminderMode;
  mute_start: string | null; // "HH:mm:ss"
  mute_end: string | null;
  further_reminder: boolean;
  onboarding_completed: boolean;
  theme: ThemePreference;
  created_at: string;
  updated_at: string;
}

export interface IntakeLog {
  id: string;
  user_id: string;
  amount_ml: number;
  drink_type: DrinkType;
  logged_at: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  time: string; // "HH:mm:ss"
  days_of_week: number[]; // 0=Sunday .. 6=Saturday
  enabled: boolean;
  sound: ReminderSound;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
}
