import { supabase } from '../lib/supabase';
import { Reminder, ReminderSound } from '../types';

export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createReminder(
  userId: string,
  time: string,
  daysOfWeek: number[],
  sound: ReminderSound = 'default'
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .insert({ user_id: userId, time, days_of_week: daysOfWeek, sound, enabled: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReminder(
  id: string,
  patch: Partial<Pick<Reminder, 'time' | 'days_of_week' | 'enabled' | 'sound'>>
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  if (error) throw error;
}

/** Evenly spaced reminder times (e.g. every 2h from 08:00 to 20:00) for "Auto" mode. */
export function generateAutoScheduleTimes(
  startHour = 8,
  endHour = 20,
  intervalHours = 2
): string[] {
  const times: string[] = [];
  for (let h = startHour; h <= endHour; h += intervalHours) {
    times.push(`${String(h).padStart(2, '0')}:00:00`);
  }
  return times;
}
