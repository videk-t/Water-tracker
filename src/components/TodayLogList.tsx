import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { DRINK_TYPES } from '../constants/drinks';
import { IntakeLog, Unit } from '../types';
import { displayAmount } from '../utils/units';

interface TodayLogListProps {
  logs: IntakeLog[];
  unit: Unit;
  onEdit: (log: IntakeLog) => void;
  onDelete: (log: IntakeLog) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function TodayLogList({ logs, unit, onEdit, onDelete }: TodayLogListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No drinks logged yet today.</Text>
      </View>
    );
  }

  return (
    <View>
      {logs.map((log) => (
        <TouchableOpacity
          key={log.id}
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => onEdit(log)}
          onLongPress={() => onDelete(log)}
        >
          <Text style={styles.emoji}>{DRINK_TYPES[log.drink_type].emoji}</Text>
          <Text style={styles.amount}>
            {displayAmount(log.amount_ml, unit)}
            {unit}
          </Text>
          <Text style={styles.time}>{formatTime(log.logged_at)}</Text>
          <TouchableOpacity onPress={() => onDelete(log)} hitSlop={10} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    empty: { paddingVertical: spacing.lg, alignItems: 'center' },
    emptyText: { ...typography.body, color: colors.textMuted },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    emoji: { fontSize: 18, marginRight: spacing.sm },
    amount: { ...typography.bodyBold, color: colors.text, flex: 1 },
    time: { ...typography.caption, color: colors.textMuted, marginRight: spacing.sm },
    deleteBtn: {
      width: 24,
      height: 24,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    deleteText: { color: colors.danger, fontSize: 16, fontWeight: '700', marginTop: -2 },
  });
}
