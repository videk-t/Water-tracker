import { hydrationValueMl } from '../constants/drinks';
import { IntakeLog } from '../types';

export interface DayBucket {
  date: Date;
  totalMl: number;
  hydrationMl: number;
  drinkCount: number;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Builds one bucket per day for the last `days` days (oldest first, today last). */
export function bucketByDay(logs: IntakeLog[], days: number): DayBucket[] {
  const buckets: DayBucket[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({ date: d, totalMl: 0, hydrationMl: 0, drinkCount: 0 });
  }

  const byKey = new Map(buckets.map((b) => [dateKey(b.date), b]));
  for (const log of logs) {
    const bucket = byKey.get(dateKey(new Date(log.logged_at)));
    if (bucket) {
      bucket.totalMl += log.amount_ml;
      bucket.hydrationMl += hydrationValueMl(log.amount_ml, log.drink_type);
      bucket.drinkCount += 1;
    }
  }

  return buckets;
}

export interface SummaryStats {
  averageMl: number;
  drinkFrequency: number; // average drinks per day
  completionPercent: number; // % of days that hit the goal
}

export function summarize(buckets: DayBucket[], goalMl: number): SummaryStats {
  if (buckets.length === 0) {
    return { averageMl: 0, drinkFrequency: 0, completionPercent: 0 };
  }
  const totalMl = buckets.reduce((sum, b) => sum + b.totalMl, 0);
  const totalDrinks = buckets.reduce((sum, b) => sum + b.drinkCount, 0);
  const daysGoalMet = buckets.filter((b) => goalMl > 0 && b.hydrationMl >= goalMl).length;

  return {
    averageMl: totalMl / buckets.length,
    drinkFrequency: totalDrinks / buckets.length,
    completionPercent: Math.round((daysGoalMet / buckets.length) * 100),
  };
}
