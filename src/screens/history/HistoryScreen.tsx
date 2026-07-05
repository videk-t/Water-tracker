import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BarChart from '../../components/BarChart';
import CalendarDots from '../../components/CalendarDots';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { fetchLogsBetween } from '../../services/intake';
import { bucketByDay, summarize } from '../../services/stats';
import { colors, spacing, typography } from '../../constants/theme';
import { IntakeLog } from '../../types';
import { displayAmount } from '../../utils/units';

const screenWidth = Dimensions.get('window').width;
const CHART_WIDTH = screenWidth - spacing.lg * 2 - spacing.md * 2;

export default function HistoryScreen() {
  const { session } = useAuth();
  const { profile } = useProfile();
  const [logs30, setLogs30] = useState<IntakeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const from = new Date();
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const data = await fetchLogsBetween(userId, from.toISOString(), to.toISOString());
      setLogs30(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const unit = profile?.unit ?? 'ml';
  const goalMl = profile?.daily_goal_ml ?? 2000;

  const weekBuckets = bucketByDay(logs30, 7);
  const monthBuckets = bucketByDay(logs30, 30);
  const weekStats = summarize(weekBuckets, goalMl);
  const monthStats = summarize(monthBuckets, goalMl);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      >
        <Text style={styles.title}>History</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <BarChart buckets={weekBuckets} goalMl={goalMl} width={CHART_WIDTH} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Goal Streak</Text>
          <CalendarDots buckets={weekBuckets} goalMl={goalMl} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Weekly Stats</Text>
          <StatRow label="Average intake" value={`${displayAmount(weekStats.averageMl, unit)}${unit}/day`} />
          <StatRow label="Drink frequency" value={`${weekStats.drinkFrequency.toFixed(1)}x/day`} />
          <StatRow label="Completion" value={`${weekStats.completionPercent}%`} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly Stats</Text>
          <StatRow label="Average intake" value={`${displayAmount(monthStats.averageMl, unit)}${unit}/day`} />
          <StatRow label="Drink frequency" value={`${monthStats.drinkFrequency.toFixed(1)}x/day`} />
          <StatRow label="Completion" value={`${monthStats.completionPercent}%`} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: { ...typography.body, color: colors.textMuted },
  statValue: { ...typography.bodyBold, color: colors.text },
});
