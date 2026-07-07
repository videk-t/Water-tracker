import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  addIntakeLog,
  deleteIntakeLog,
  fetchTodayLogs,
  updateIntakeLog,
} from '../services/intake';
import { hydrationValueMl } from '../constants/drinks';
import { DrinkType, IntakeLog } from '../types';

interface IntakeContextValue {
  todayLogs: IntakeLog[];
  todayTotalMl: number;
  todayHydrationMl: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addLog: (amountMl: number, drinkType?: DrinkType) => Promise<IntakeLog>;
  editLog: (id: string, amountMl: number) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
}

const IntakeContext = createContext<IntakeContextValue | undefined>(undefined);

export function IntakeProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [todayLogs, setTodayLogs] = useState<IntakeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTodayLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const logs = await fetchTodayLogs(userId);
      setTodayLogs(logs);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = useCallback(
    async (amountMl: number, drinkType: DrinkType = 'water') => {
      if (!userId) throw new Error('Not signed in');
      const log = await addIntakeLog(userId, amountMl, drinkType);
      setTodayLogs((prev) => [log, ...prev]);
      return log;
    },
    [userId]
  );

  const editLog = useCallback(async (id: string, amountMl: number) => {
    const updated = await updateIntakeLog(id, amountMl);
    setTodayLogs((prev) => prev.map((l) => (l.id === id ? updated : l)));
  }, []);

  const removeLog = useCallback(async (id: string) => {
    await deleteIntakeLog(id);
    setTodayLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const todayTotalMl = useMemo(
    () => todayLogs.reduce((sum, l) => sum + l.amount_ml, 0),
    [todayLogs]
  );

  const todayHydrationMl = useMemo(
    () => todayLogs.reduce((sum, l) => sum + hydrationValueMl(l.amount_ml, l.drink_type), 0),
    [todayLogs]
  );

  const value = useMemo<IntakeContextValue>(
    () => ({
      todayLogs,
      todayTotalMl,
      todayHydrationMl,
      loading,
      refresh,
      addLog,
      editLog,
      removeLog,
    }),
    [todayLogs, todayTotalMl, todayHydrationMl, loading, refresh, addLog, editLog, removeLog]
  );

  return <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>;
}

export function useIntake(): IntakeContextValue {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error('useIntake must be used within IntakeProvider');
  return ctx;
}
