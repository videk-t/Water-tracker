import { supabase } from '../lib/supabase';
import { bucketByDay, DayBucket } from './stats';
import { Achievement, IntakeLog } from '../types';

export async function fetchAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Idempotent: does nothing if the achievement is already unlocked. */
export async function unlockAchievement(userId: string, key: string): Promise<Achievement | null> {
  const { data, error } = await supabase
    .from('achievements')
    .upsert({ user_id: userId, achievement_key: key }, { onConflict: 'user_id,achievement_key', ignoreDuplicates: true })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Longest run of consecutive days (ending at the most recent bucket) that hit the goal. */
export function currentStreak(buckets: DayBucket[], goalMl: number): number {
  let streak = 0;
  for (let i = buckets.length - 1; i >= 0; i--) {
    if (goalMl > 0 && buckets[i].hydrationMl >= goalMl) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function hasPerfectWeek(buckets: DayBucket[], goalMl: number): boolean {
  if (goalMl <= 0) return false;
  for (let start = 0; start + 7 <= buckets.length; start++) {
    const window = buckets.slice(start, start + 7);
    if (window.every((b) => b.hydrationMl >= goalMl)) return true;
  }
  return false;
}

interface EvaluateParams {
  /** Recent logs (recommend ~90 days) used for streak / perfect-week detection. */
  recentLogs: IntakeLog[];
  /** All-time count of logged drinks. */
  totalLogCount: number;
  goalMl: number;
  /** The drink that was just logged, if this evaluation was triggered by a new log. */
  newLog?: IntakeLog;
  /** Today's hydration-weighted total, for the overachiever check. */
  todayHydrationMl: number;
  alreadyUnlocked: Set<string>;
}

/** Pure function: returns achievement keys newly qualified for (caller persists them). */
export function evaluateAchievements({
  recentLogs,
  totalLogCount,
  goalMl,
  newLog,
  todayHydrationMl,
  alreadyUnlocked,
}: EvaluateParams): string[] {
  const earned: string[] = [];
  const qualifies = (key: string, condition: boolean) => {
    if (condition && !alreadyUnlocked.has(key)) earned.push(key);
  };

  const buckets = bucketByDay(recentLogs, 90);
  const streak = currentStreak(buckets, goalMl);

  qualifies('first_drop', totalLogCount >= 1);
  qualifies('streak_3', streak >= 3);
  qualifies('streak_7', streak >= 7);
  qualifies('streak_30', streak >= 30);
  qualifies('perfect_week', hasPerfectWeek(buckets, goalMl));
  qualifies('century_club', totalLogCount >= 100);
  qualifies('goal_crusher', buckets.filter((b) => goalMl > 0 && b.hydrationMl >= goalMl).length >= 50);
  qualifies('over_achiever', goalMl > 0 && todayHydrationMl >= goalMl * 1.5);

  if (newLog) {
    const hour = new Date(newLog.logged_at).getHours();
    qualifies('early_bird', hour < 7);
    qualifies('night_owl', hour >= 22);
  }

  return earned;
}
