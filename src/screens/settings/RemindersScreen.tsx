import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '../../components/BackHeader';
import Card from '../../components/Card';
import ReminderEditModal from '../../components/ReminderEditModal';
import ReminderRow from '../../components/ReminderRow';
import TimeField from '../../components/TimeField';
import { useProfile } from '../../context/ProfileContext';
import { useReminders } from '../../context/RemindersContext';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Reminder, ReminderSound } from '../../types';

export default function RemindersScreen() {
  const { profile, updateProfile } = useProfile();
  const { reminders, addReminder, editReminder, toggleReminder, removeReminder } = useReminders();
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [creating, setCreating] = useState(false);
  const [muteEnabled, setMuteEnabled] = useState(!!(profile?.mute_start && profile?.mute_end));

  const handleSave = async (data: { time: string; days_of_week: number[]; sound: ReminderSound }) => {
    try {
      if (editing) {
        await editReminder(editing.id, data);
      } else {
        await addReminder(data.time, data.days_of_week, data.sound);
      }
    } catch (e: any) {
      Alert.alert('Could not save reminder', e.message ?? 'Please try again.');
    } finally {
      setEditing(null);
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      await removeReminder(editing.id);
    } catch (e: any) {
      Alert.alert('Could not delete reminder', e.message ?? 'Please try again.');
    } finally {
      setEditing(null);
    }
  };

  const toggleMute = async (enabled: boolean) => {
    setMuteEnabled(enabled);
    if (enabled) {
      await updateProfile({ mute_start: '22:00:00', mute_end: '07:00:00' });
    } else {
      await updateProfile({ mute_start: null, mute_end: null });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackHeader title="Reminders" />

        <Card style={styles.card}>
          {reminders.length === 0 ? (
            <Text style={styles.empty}>No reminders yet. Add one to stay on track.</Text>
          ) : (
            reminders.map((r) => (
              <ReminderRow
                key={r.id}
                reminder={r}
                onPress={() => setEditing(r)}
                onToggle={(enabled) => toggleReminder(r.id, enabled)}
              />
            ))
          )}
          <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
            <Text style={styles.addBtnText}>+ Add reminder</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <View style={styles.muteHeader}>
            <Text style={styles.sectionTitle}>Mute at Night</Text>
            <TouchableOpacity
              style={[styles.toggle, muteEnabled && styles.toggleActive]}
              onPress={() => toggleMute(!muteEnabled)}
            >
              <Text style={[styles.toggleText, muteEnabled && styles.toggleTextActive]}>
                {muteEnabled ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          {muteEnabled ? (
            <View style={styles.muteRow}>
              <View style={styles.muteField}>
                <TimeField
                  label="From"
                  value={profile?.mute_start ?? '22:00:00'}
                  onChange={(v) => updateProfile({ mute_start: v })}
                />
              </View>
              <View style={styles.muteField}>
                <TimeField
                  label="To"
                  value={profile?.mute_end ?? '07:00:00'}
                  onChange={(v) => updateProfile({ mute_end: v })}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.mutedHint}>Reminders will fire all day and night.</Text>
          )}
        </Card>

        <Card style={styles.card}>
          <View style={styles.muteHeader}>
            <Text style={styles.sectionTitle}>Further Reminder</Text>
            <TouchableOpacity
              style={[styles.toggle, profile?.further_reminder && styles.toggleActive]}
              onPress={() => updateProfile({ further_reminder: !profile?.further_reminder })}
            >
              <Text
                style={[
                  styles.toggleText,
                  profile?.further_reminder && styles.toggleTextActive,
                ]}
              >
                {profile?.further_reminder ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mutedHint}>
            Get a friendly nudge to keep drinking after you hit your daily goal.
          </Text>
        </Card>
      </ScrollView>

      <ReminderEditModal
        visible={!!editing || creating}
        reminder={editing}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSave={handleSave}
        onDelete={editing ? handleDelete : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.text },
  empty: { ...typography.body, color: colors.textMuted, paddingVertical: spacing.sm },
  addBtn: { paddingVertical: spacing.md, alignItems: 'center' },
  addBtnText: { ...typography.bodyBold, color: colors.primary },
  muteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { ...typography.bodyBold, color: colors.textMuted, fontSize: 13 },
  toggleTextActive: { color: colors.textOnPrimary },
  muteRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  muteField: { flex: 1 },
  mutedHint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
});
