import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
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
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.time}>{displayTime(reminder.time)}</Text>
        <Text style={styles.days}>{summarizeDays(reminder.days_of_week)}</Text>
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: {},
  time: { ...typography.h3, color: colors.text },
  days: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
