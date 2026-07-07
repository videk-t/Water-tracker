export const DEFAULT_REMINDER_MESSAGES = [
  "Let's drink some water!",
  'Time for a quick sip 💧',
  'Your body will thank you — grab some water.',
  'Hydration check! Take a drink.',
  "Don't forget to hydrate.",
  'A little water goes a long way. Drink up!',
  'Quick reminder: drink some water.',
];

/** Deterministically picks a message so the same reminder shows the same text each time. */
export function pickDefaultMessage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % DEFAULT_REMINDER_MESSAGES.length;
  return DEFAULT_REMINDER_MESSAGES[index];
}
