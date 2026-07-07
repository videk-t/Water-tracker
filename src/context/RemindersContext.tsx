import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  updateReminder,
} from '../services/reminders';
import { Reminder, ReminderSound } from '../types';

interface RemindersContextValue {
  reminders: Reminder[];
  loading: boolean;
  refresh: () => Promise<void>;
  addReminder: (
    time: string,
    daysOfWeek: number[],
    sound?: ReminderSound,
    message?: string | null
  ) => Promise<void>;
  toggleReminder: (id: string, enabled: boolean) => Promise<void>;
  editReminder: (
    id: string,
    patch: Partial<Pick<Reminder, 'time' | 'days_of_week' | 'enabled' | 'sound' | 'message'>>
  ) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
}

const RemindersContext = createContext<RemindersContextValue | undefined>(undefined);

export function RemindersProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setReminders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchReminders(userId);
      setReminders(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReminder = useCallback(
    async (
      time: string,
      daysOfWeek: number[],
      sound: ReminderSound = 'default',
      message: string | null = null
    ) => {
      if (!userId) return;
      const created = await createReminder(userId, time, daysOfWeek, sound, message);
      setReminders((prev) => [...prev, created].sort((a, b) => a.time.localeCompare(b.time)));
    },
    [userId]
  );

  const toggleReminder = useCallback(async (id: string, enabled: boolean) => {
    const updated = await updateReminder(id, { enabled });
    setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  const editReminder = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Reminder, 'time' | 'days_of_week' | 'enabled' | 'sound' | 'message'>>
    ) => {
      const updated = await updateReminder(id, patch);
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? updated : r)).sort((a, b) => a.time.localeCompare(b.time))
      );
    },
    []
  );

  const removeReminder = useCallback(async (id: string) => {
    await deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = useMemo<RemindersContextValue>(
    () => ({ reminders, loading, refresh, addReminder, toggleReminder, editReminder, removeReminder }),
    [reminders, loading, refresh, addReminder, toggleReminder, editReminder, removeReminder]
  );

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders(): RemindersContextValue {
  const ctx = useContext(RemindersContext);
  if (!ctx) throw new Error('useReminders must be used within RemindersProvider');
  return ctx;
}
