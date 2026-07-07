import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { fetchLogsSince, fetchTotalLogCount } from '../services/intake';
import {
  currentStreak,
  evaluateAchievements,
  fetchAchievements,
  unlockAchievement,
} from '../services/achievements';
import { bucketByDay } from '../services/stats';
import { ACHIEVEMENTS_BY_KEY } from '../constants/achievements';
import { Achievement, IntakeLog } from '../types';

const HISTORY_WINDOW_DAYS = 90;

interface AchievementsContextValue {
  unlocked: Achievement[];
  streak: number;
  loading: boolean;
  refresh: () => Promise<void>;
  checkForNewAchievements: (newLog?: IntakeLog, todayHydrationMl?: number) => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextValue | undefined>(undefined);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { profile } = useProfile();
  const userId = session?.user?.id;
  const goalMl = profile?.daily_goal_ml ?? 0;

  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setUnlocked([]);
      setStreak(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const since = new Date();
      since.setDate(since.getDate() - HISTORY_WINDOW_DAYS);
      const [achievements, logs] = await Promise.all([
        fetchAchievements(userId),
        fetchLogsSince(userId, since.toISOString()),
      ]);
      setUnlocked(achievements);
      setStreak(currentStreak(bucketByDay(logs, HISTORY_WINDOW_DAYS), goalMl));
    } finally {
      setLoading(false);
    }
  }, [userId, goalMl]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const checkForNewAchievements = useCallback(
    async (newLog?: IntakeLog, todayHydrationMl = 0) => {
      if (!userId) return;
      const since = new Date();
      since.setDate(since.getDate() - HISTORY_WINDOW_DAYS);
      const [recentLogs, totalLogCount] = await Promise.all([
        fetchLogsSince(userId, since.toISOString()),
        fetchTotalLogCount(userId),
      ]);

      const alreadyUnlocked = new Set(unlocked.map((a) => a.achievement_key));
      const newKeys = evaluateAchievements({
        recentLogs,
        totalLogCount,
        goalMl,
        newLog,
        todayHydrationMl,
        alreadyUnlocked,
      });

      if (newKeys.length === 0) {
        setStreak(currentStreak(bucketByDay(recentLogs, HISTORY_WINDOW_DAYS), goalMl));
        return;
      }

      const newlyUnlocked = await Promise.all(newKeys.map((key) => unlockAchievement(userId, key)));
      const confirmed = newlyUnlocked.filter((a): a is Achievement => !!a);

      setUnlocked((prev) => [...confirmed, ...prev]);
      setStreak(currentStreak(bucketByDay(recentLogs, HISTORY_WINDOW_DAYS), goalMl));

      if (confirmed.length > 0) {
        const names = confirmed
          .map((a) => ACHIEVEMENTS_BY_KEY[a.achievement_key]?.title ?? a.achievement_key)
          .join(', ');
        Alert.alert('Achievement unlocked! 🎉', names);
      }
    },
    [userId, goalMl, unlocked]
  );

  const value = useMemo<AchievementsContextValue>(
    () => ({ unlocked, streak, loading, refresh, checkForNewAchievements }),
    [unlocked, streak, loading, refresh, checkForNewAchievements]
  );

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements(): AchievementsContextValue {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementsProvider');
  return ctx;
}
