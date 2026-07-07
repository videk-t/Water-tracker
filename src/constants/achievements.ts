export interface AchievementInfo {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementInfo[] = [
  {
    key: 'first_drop',
    title: 'First Drop',
    description: 'Logged your very first drink.',
    emoji: '💧',
  },
  {
    key: 'streak_3',
    title: 'Warming Up',
    description: 'Hit your goal 3 days in a row.',
    emoji: '🔥',
  },
  {
    key: 'streak_7',
    title: 'Week Streak',
    description: 'Hit your goal 7 days in a row.',
    emoji: '🔥',
  },
  {
    key: 'streak_30',
    title: 'Month Streak',
    description: 'Hit your goal 30 days in a row.',
    emoji: '🏆',
  },
  {
    key: 'perfect_week',
    title: 'Perfect Week',
    description: 'Met your goal every day in a rolling 7-day window.',
    emoji: '🌟',
  },
  {
    key: 'century_club',
    title: 'Century Club',
    description: 'Logged 100 drinks in total.',
    emoji: '💯',
  },
  {
    key: 'early_bird',
    title: 'Early Bird',
    description: 'Logged a drink before 7am.',
    emoji: '🌅',
  },
  {
    key: 'night_owl',
    title: 'Night Owl',
    description: 'Logged a drink after 10pm.',
    emoji: '🌙',
  },
  {
    key: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Hit your daily goal 50 times in total.',
    emoji: '💪',
  },
  {
    key: 'over_achiever',
    title: 'Overachiever',
    description: 'Hit 150% of your goal in a single day.',
    emoji: '🚀',
  },
];

export const ACHIEVEMENTS_BY_KEY: Record<string, AchievementInfo> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.key, a])
);
