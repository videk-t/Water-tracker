import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { DayBucket } from '../services/stats';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface CalendarDotsProps {
  buckets: DayBucket[];
  goalMl: number;
}

export default function CalendarDots({ buckets, goalMl }: CalendarDotsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <View style={styles.row}>
      {buckets.map((bucket, i) => {
        const met = goalMl > 0 && bucket.totalMl >= goalMl;
        const isToday = bucket.date.getTime() === today.getTime();
        const isFuture = bucket.date.getTime() > today.getTime();
        return (
          <View key={i} style={styles.column}>
            <Text style={styles.dayLabel}>{DAY_LABELS[bucket.date.getDay()]}</Text>
            <View
              style={[
                styles.dot,
                met && styles.dotMet,
                isToday && styles.dotToday,
                isFuture && styles.dotFuture,
              ]}
            >
              {met ? <Text style={styles.check}>✓</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { alignItems: 'center' },
  dayLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  dot: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotMet: { backgroundColor: colors.success },
  dotToday: { borderWidth: 2, borderColor: colors.primary },
  dotFuture: { opacity: 0.4 },
  check: { color: '#fff', fontWeight: '700' },
});
