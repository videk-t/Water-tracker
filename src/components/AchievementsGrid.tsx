import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ACHIEVEMENTS } from '../constants/achievements';
import { radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Achievement } from '../types';

interface AchievementsGridProps {
  unlocked: Achievement[];
}

export default function AchievementsGrid({ unlocked }: AchievementsGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const unlockedKeys = new Set(unlocked.map((a) => a.achievement_key));

  return (
    <View style={styles.grid}>
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedKeys.has(achievement.key);
        return (
          <TouchableOpacity
            key={achievement.key}
            style={[styles.tile, !isUnlocked && styles.tileLocked]}
            onPress={() => Alert.alert(achievement.title, achievement.description)}
          >
            <Text style={[styles.emoji, !isUnlocked && styles.emojiLocked]}>{achievement.emoji}</Text>
            <Text style={[styles.title, !isUnlocked && styles.titleLocked]} numberOfLines={1}>
              {achievement.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const TILE_WIDTH = '31%';

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    tile: {
      width: TILE_WIDTH,
      backgroundColor: colors.backgroundAlt,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    tileLocked: { opacity: 0.4 },
    emoji: { fontSize: 26, marginBottom: spacing.xs },
    emojiLocked: {},
    title: { ...typography.caption, color: colors.text, textAlign: 'center', fontWeight: '600' },
    titleLocked: { color: colors.textMuted },
  });
}
