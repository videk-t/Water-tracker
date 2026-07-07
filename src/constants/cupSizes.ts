export const QUICK_ADD_ML = [100, 200, 300, 400, 500, 1000] as const;

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAY_LABELS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

// Only these two are wired to real behavior in services/notifications.ts — there are no
// bundled custom audio files, so "droplet/chime/bell" would silently fall back to default.
export const REMINDER_SOUNDS = ['default', 'none'] as const;
