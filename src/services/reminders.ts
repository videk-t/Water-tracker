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
  sound: ReminderSound = 'default',
  message: string | null = null
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .insert({ user_id: userId, time, days_of_week: daysOfWeek, sound, message, enabled: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReminder(
  id: string,
  patch: Partial<Pick<Reminder, 'time' | 'days_of_week' | 'enabled' | 'sound' | 'message'>>
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
