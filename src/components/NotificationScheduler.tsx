import { useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useReminders } from '../context/RemindersContext';
import { syncScheduledReminders } from '../services/notifications';

/**
 * Headless component: re-syncs the device's local notification schedule
 * whenever reminders or mute-window settings change, so Supabase stays the
 * single source of truth for "what should be scheduled".
 */
export default function NotificationScheduler() {
  const { profile } = useProfile();
  const { reminders, loading } = useReminders();

  useEffect(() => {
    if (loading || !profile) return;
    syncScheduledReminders(reminders, profile).catch((e) => {
      console.warn('Failed to sync reminder notifications', e);
    });
  }, [reminders, loading, profile]);

  return null;
}
