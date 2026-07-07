import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WEEKDAY_LABELS } from '../constants/cupSizes';
import { radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface WeekdaySelectorProps {
  selected: number[];
  onChange: (days: number[]) => void;
}

export default function WeekdaySelector({ selected, onChange }: WeekdaySelectorProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const toggle = (day: number) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day].sort());
    }
  };

  return (
    <View style={styles.row}>
      {WEEKDAY_LABELS.map((label, day) => {
        const active = selected.includes(day);
        return (
          <TouchableOpacity
            key={day}
            style={[styles.dayBtn, active && styles.dayBtnActive]}
            onPress={() => toggle(day)}
          >
            <Text style={[styles.dayText, active && styles.dayTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    dayBtn: {
      width: 34,
      height: 34,
      borderRadius: radius.pill,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    dayText: { ...typography.bodyBold, color: colors.textMuted, fontSize: 13 },
    dayTextActive: { color: colors.textOnPrimary },
  });
}
