import { IntakeLog } from '../types';
import { bucketByDay, DayBucket } from './stats';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function weekdayVsWeekendInsight(buckets: DayBucket[]): string | null {
  const weekday = buckets.filter((b) => b.date.getDay() >= 1 && b.date.getDay() <= 5);
  const weekend = buckets.filter((b) => b.date.getDay() === 0 || b.date.getDay() === 6);
  if (weekday.length < 3 || weekend.length < 2) return null;

  const weekdayAvg = average(weekday.map((b) => b.hydrationMl));
  const weekendAvg = average(weekend.map((b) => b.hydrationMl));
  if (weekdayAvg <= 0 || weekendAvg <= 0) return null;

  const diffPercent = Math.round(((weekdayAvg - weekendAvg) / weekdayAvg) * 100);
  if (Math.abs(diffPercent) < 10) return "You're equally consistent on weekdays and weekends.";
  if (diffPercent > 0) return `You drink about ${diffPercent}% less on weekends than weekdays.`;
  return `You drink about ${Math.abs(diffPercent)}% more on weekends than weekdays.`;
}

function weekOverWeekInsight(buckets: DayBucket[]): string | null {
  if (buckets.length < 14) return null;
  const lastWeek = buckets.slice(-7);
  const priorWeek = buckets.slice(-14, -7);
  const lastAvg = average(lastWeek.map((b) => b.hydrationMl));
  const priorAvg = average(priorWeek.map((b) => b.hydrationMl));
  if (priorAvg <= 0) return null;

  const diffPercent = Math.round(((lastAvg - priorAvg) / priorAvg) * 100);
  if (Math.abs(diffPercent) < 5) return "Your intake is steady compared to last week.";
  if (diffPercent > 0) return `You're trending up — ${diffPercent}% more than last week.`;
  return `You're trending down — ${Math.abs(diffPercent)}% less than last week.`;
}

function bestDayInsight(buckets: DayBucket[]): string | null {
  if (buckets.length < 7) return null;
  const byDay = new Map<number, number[]>();
  for (const b of buckets) {
    const day = b.date.getDay();
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(b.hydrationMl);
  }
  let bestDay = -1;
  let bestAvg = -1;
  for (const [day, values] of byDay) {
    const avg = average(values);
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = day;
    }
  }
  if (bestDay < 0 || bestAvg <= 0) return null;
  return `${DAY_NAMES[bestDay]} is your best day on average.`;
}

function timeOfDayInsight(logs: IntakeLog[]): string | null {
  if (logs.length < 10) return null;
  const periods = { morning: 0, afternoon: 0, evening: 0 };
  for (const log of logs) {
    const hour = new Date(log.logged_at).getHours();
    if (hour < 12) periods.morning += 1;
    else if (hour < 18) periods.afternoon += 1;
    else periods.evening += 1;
  }
  const entries = Object.entries(periods) as [keyof typeof periods, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const [topPeriod, topCount] = entries[0];
  if (topCount === 0) return null;
  return `You log the most drinks in the ${topPeriod}.`;
}

/** Generates a short list of pattern-based observations from the user's own history. */
export function generateInsights(logs: IntakeLog[], goalMl: number, days = 30): string[] {
  const buckets = bucketByDay(logs, days);
  const insights = [
    weekOverWeekInsight(buckets),
    weekdayVsWeekendInsight(buckets),
    bestDayInsight(buckets),
    timeOfDayInsight(logs),
  ].filter((i): i is string => !!i);

  if (insights.length === 0) {
    return ['Log a few more days to unlock personalized insights.'];
  }

  return insights.slice(0, 3);
}
