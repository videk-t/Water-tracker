import React, { useEffect, useRef, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import EditLogModal from '../../components/EditLogModal';
import Mascot from '../../components/Mascot';
import ProgressRing from '../../components/ProgressRing';
import QuickAddGrid from '../../components/QuickAddGrid';
import TodayLogList from '../../components/TodayLogList';
import { useIntake } from '../../context/IntakeContext';
import { useProfile } from '../../context/ProfileContext';
import { scheduleFurtherReminder } from '../../services/notifications';
import { colors, spacing, typography } from '../../constants/theme';
import { IntakeLog } from '../../types';
import { getMascotState } from '../../utils/mascotMessage';

export default function HomeScreen() {
  const { profile } = useProfile();
  const { todayLogs, todayTotalMl, loading, refresh, addLog, editLog, removeLog } = useIntake();
  const [editingLog, setEditingLog] = useState<IntakeLog | null>(null);
  const goalHitNotified = useRef(false);

  const unit = profile?.unit ?? 'ml';
  const goalMl = profile?.daily_goal_ml ?? 2000;
  const progress = goalMl > 0 ? todayTotalMl / goalMl : 0;
  const { mood, message } = getMascotState(progress);

  useEffect(() => {
    if (progress >= 1 && !goalHitNotified.current && profile?.further_reminder) {
      goalHitNotified.current = true;
      scheduleFurtherReminder().catch(() => {});
    }
    if (progress < 1) {
      goalHitNotified.current = false;
    }
  }, [progress, profile?.further_reminder]);

  const handleAdd = async (amountMl: number) => {
    try {
      await addLog(amountMl);
    } catch (e: any) {
      Alert.alert('Could not log drink', e.message ?? 'Please try again.');
    }
  };

  const handleDelete = (log: IntakeLog) => {
    Alert.alert('Delete entry', 'Remove this drink from today’s log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeLog(log.id).catch((e: any) => Alert.alert('Error', e.message)),
      },
    ]);
  };

  const handleSaveEdit = async (amountMl: number) => {
    if (!editingLog) return;
    try {
      await editLog(editingLog.id, amountMl);
    } catch (e: any) {
      Alert.alert('Could not update entry', e.message ?? 'Please try again.');
    } finally {
      setEditingLog(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={styles.greeting}>Today</Text>

        <View style={styles.ringWrapper}>
          <ProgressRing currentMl={todayTotalMl} goalMl={goalMl} unit={unit} />
        </View>

        <Card style={styles.mascotCard}>
          <Mascot size={56} mood={mood} />
          <Text style={styles.mascotMessage}>{message}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Quick Add</Text>
        <QuickAddGrid unit={unit} onAdd={handleAdd} />

        <Text style={styles.sectionTitle}>Today's Log</Text>
        <Card>
          <TodayLogList
            logs={todayLogs}
            unit={unit}
            onEdit={setEditingLog}
            onDelete={handleDelete}
          />
        </Card>
      </ScrollView>

      <EditLogModal
        visible={!!editingLog}
        log={editingLog}
        unit={unit}
        onClose={() => setEditingLog(null)}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  ringWrapper: { alignItems: 'center', marginBottom: spacing.lg },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mascotMessage: { ...typography.body, color: colors.text, marginLeft: spacing.md, flex: 1 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.xs },
});
