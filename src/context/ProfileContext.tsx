import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchProfile, upsertProfile } from '../services/profile';
import { Profile } from '../types';

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchProfile(userId);
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (patch: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
      if (!userId) return;
      const updated = await upsertProfile(userId, patch);
      setProfile(updated);
    },
    [userId]
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, loading, refresh, updateProfile }),
    [profile, loading, refresh, updateProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
