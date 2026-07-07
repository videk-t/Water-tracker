import { supabase } from '../lib/supabase';
import { DrinkType, IntakeLog } from '../types';

export function startOfDayIso(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function endOfDayIso(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export async function fetchLogsBetween(
  userId: string,
  fromIso: string,
  toIso: string
): Promise<IntakeLog[]> {
  const { data, error } = await supabase
    .from('intake_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', fromIso)
    .lte('logged_at', toIso)
    .order('logged_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchTodayLogs(userId: string): Promise<IntakeLog[]> {
  return fetchLogsBetween(userId, startOfDayIso(), endOfDayIso());
}

export async function addIntakeLog(
  userId: string,
  amountMl: number,
  drinkType: DrinkType = 'water'
): Promise<IntakeLog> {
  const { data, error } = await supabase
    .from('intake_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
      drink_type: drinkType,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchTotalLogCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('intake_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchLogsSince(userId: string, sinceIso: string): Promise<IntakeLog[]> {
  const { data, error } = await supabase
    .from('intake_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', sinceIso)
    .order('logged_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateIntakeLog(id: string, amountMl: number): Promise<IntakeLog> {
  const { data, error } = await supabase
    .from('intake_logs')
    .update({ amount_ml: amountMl })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIntakeLog(id: string): Promise<void> {
  const { error } = await supabase.from('intake_logs').delete().eq('id', id);
  if (error) throw error;
}
