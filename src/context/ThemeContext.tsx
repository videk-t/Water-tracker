import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useProfile } from './ProfileContext';
import { darkColors, lightColors, ThemeColors } from '../constants/theme';
import { ThemePreference } from '../types';

interface ThemeContextValue {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { profile, updateProfile } = useProfile();
  const preference = profile?.theme ?? 'system';

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: scheme === 'dark' ? darkColors : lightColors,
      scheme,
      preference,
      setPreference: (next) => {
        updateProfile({ theme: next });
      },
    }),
    [scheme, preference, updateProfile]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
