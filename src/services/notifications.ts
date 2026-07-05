import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Profile, Reminder } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const HYDRATION_CATEGORY = 'hydration-reminder';
const FURTHER_REMINDER_ID = 'further-reminder';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const result = await Notifications.requestPermissionsAsync();
    status = result.status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Hydration reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  return status === 'granted';
}

function isMuted(time: { hour: number; minute: number }, profile: Profile): boolean {
  if (!profile.mute_start || !profile.mute_end) return false;
  const [muteStartH, muteStartM] = profile.mute_start.split(':').map(Number);
  const [muteEndH, muteEndM] = profile.mute_end.split(':').map(Number);

  const toMinutes = (h: number, m: number) => h * 60 + m;
  const t = toMinutes(time.hour, time.minute);
  const start = toMinutes(muteStartH, muteStartM);
  const end = toMinutes(muteEndH, muteEndM);

  if (start === end) return false;
  if (start < end) {
    return t >= start && t < end;
  }
  // Range wraps past midnight (e.g. 22:00 -> 07:00)
  return t >= start || t < end;
}

/**
 * Clears every scheduled hydration notification and re-schedules one
 * weekly-repeating local notification per enabled reminder / active day,
 * skipping any time inside the user's "mute at night" window.
 */
export async function syncScheduledReminders(
  reminders: Reminder[],
  profile: Profile
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  for (const reminder of reminders) {
    if (!reminder.enabled) continue;
    const [hourStr, minuteStr] = reminder.time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (isMuted({ hour, minute }, profile)) continue;

    for (const weekday of reminder.days_of_week) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to hydrate 💧',
          body: "Let's drink some water!",
          categoryIdentifier: HYDRATION_CATEGORY,
          sound: reminder.sound === 'none' ? undefined : 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday + 1, // expo-notifications uses 1=Sunday..7=Saturday
          hour,
          minute,
        },
      });
    }
  }
}

/**
 * Fires a one-off "further reminder" a short while after the daily goal is
 * hit, nudging the user to keep sipping. Cancelled/re-armed each time the
 * goal is reached so only the latest one is pending.
 */
export async function scheduleFurtherReminder(minutesFromNow = 90): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(FURTHER_REMINDER_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: FURTHER_REMINDER_ID,
    content: {
      title: 'Goal reached! 🎉',
      body: 'Great job! A little more water never hurts — keep sipping.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: minutesFromNow * 60,
      repeats: false,
    },
  });
}

export async function cancelFurtherReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(FURTHER_REMINDER_ID).catch(() => {});
}
