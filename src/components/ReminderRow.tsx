import React, { useMemo } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { WEEKDAY_LABELS } from '../constants/cupSizes';
import { Reminder } from '../types';

function summarizeDays(days: number[]): string {
  const sorted = [...days].sort();
  if (sorted.length === 7) return 'Everyday';
  if (sorted.length === 0) return 'Never';
  return sorted.map((d) => WEEKDAY_LABELS[d]).join(' ');
}

function displayTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

interface ReminderRowProps {
  reminder: Reminder;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
}

export default function ReminderRow({ reminder, onPress, onToggle }: ReminderRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.time}>{displayTime(reminder.time)}</Text>
        <Text style={styles.days}>{summarizeDays(reminder.days_of_week)}</Text>
        {reminder.message ? (
          <Text style={styles.message} numberOfLines={1}>
            "{reminder.message}"
          </Text>
        ) : null}
      </View>
      <Switch
        value={reminder.enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={reminder.enabled ? colors.primary : '#fff'}
      />
    </TouchableOpacity>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    info: { flex: 1, marginRight: spacing.sm },
    time: { ...typography.h3, color: colors.text },
    days: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    message: { ...typography.caption, color: colors.primary, marginTop: 2, fontStyle: 'italic' },
  });
}
