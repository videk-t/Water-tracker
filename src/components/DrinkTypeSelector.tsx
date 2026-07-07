import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DRINK_TYPES, DRINK_TYPE_ORDER } from '../constants/drinks';
import { radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { DrinkType } from '../types';

interface DrinkTypeSelectorProps {
  selected: DrinkType;
  onSelect: (type: DrinkType) => void;
}

export default function DrinkTypeSelector({ selected, onSelect }: DrinkTypeSelectorProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {DRINK_TYPE_ORDER.map((type) => {
        const info = DRINK_TYPES[type];
        const active = type === selected;
        return (
          <TouchableOpacity
            key={type}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onSelect(type)}
          >
            <Text style={styles.emoji}>{info.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{info.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { gap: spacing.sm, paddingVertical: spacing.xs },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    emoji: { fontSize: 16, marginRight: spacing.xs },
    label: { ...typography.bodyBold, color: colors.textMuted, fontSize: 13 },
    labelActive: { color: colors.textOnPrimary },
  });
}
