import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useReminders } from '../../context/RemindersContext';
import { ALL_DAYS } from '../../constants/cupSizes';
import { generateAutoScheduleTimes } from '../../services/reminders';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { ReminderMode, Unit } from '../../types';
import { SettingsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

export default function SettingsHomeScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { reminders, addReminder } = useReminders();
  const [switchingMode, setSwitchingMode] = useState(false);

  const handleUnitChange = (unit: Unit) => updateProfile({ unit });

  const handleModeChange = async (mode: ReminderMode) => {
    setSwitchingMode(true);
    try {
      await updateProfile({ reminder_mode: mode });
      if (mode === 'auto' && reminders.length === 0) {
        const times = generateAutoScheduleTimes();
        for (const time of times) {
          await addReminder(time, ALL_DAYS, 'default');
        }
      }
    } catch (e: any) {
      Alert.alert('Could not update reminder mode', e.message ?? 'Please try again.');
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.card}>
          <SettingsLink title="Reminder Schedule" subtitle={`${reminders.length} reminder(s)`} onPress={() => navigation.navigate('Reminders')} />
          <SettingsLink title="Personal Data" subtitle="Gender, weight, height, goal" onPress={() => navigation.navigate('PersonalData')} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Reminder Mode</Text>
          <View style={styles.row}>
            <ModePill
              label="Auto"
              active={profile?.reminder_mode === 'auto'}
              onPress={() => handleModeChange('auto')}
              disabled={switchingMode}
            />
            <ModePill
              label="Manual"
              active={profile?.reminder_mode === 'manual'}
              onPress={() => handleModeChange('manual')}
              disabled={switchingMode}
            />
          </View>
          <Text style={styles.hint}>
            Auto fills your schedule with evenly spaced reminders. Manual leaves it entirely up to you.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Unit</Text>
          <View style={styles.row}>
            <ModePill label="ml" active={profile?.unit === 'ml'} onPress={() => handleUnitChange('ml')} />
            <ModePill label="oz" active={profile?.unit === 'oz'} onPress={() => handleUnitChange('oz')} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Language</Text>
          <View style={styles.row}>
            <ModePill label="English" active onPress={() => {}} />
          </View>
          <Text style={styles.hint}>More languages coming soon.</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Account</Text>
          <Text style={styles.accountEmail}>{session?.user?.email ?? 'Guest account'}</Text>
        </Card>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsLink({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress}>
      <View>
        <Text style={styles.linkTitle}>{title}</Text>
        <Text style={styles.linkSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function ModePill({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  sectionLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textMuted },
  pillTextActive: { color: colors.textOnPrimary },
  hint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkTitle: { ...typography.bodyBold, color: colors.text },
  linkSubtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  chevron: { ...typography.h2, color: colors.textMuted },
  accountEmail: { ...typography.body, color: colors.text },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  signOutText: { ...typography.bodyBold, color: colors.danger },
});
