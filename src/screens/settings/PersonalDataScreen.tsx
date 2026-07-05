import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '../../components/BackHeader';
import Button from '../../components/Button';
import Card from '../../components/Card';
import TextField from '../../components/TextField';
import { useProfile } from '../../context/ProfileContext';
import { calculateSuggestedGoalMl } from '../../services/goal';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Gender } from '../../types';
import { displayAmount, ozToMl } from '../../utils/units';

const GENDERS: { key: Gender; label: string }[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'other', label: 'Other' },
];

export default function PersonalDataScreen() {
  const { profile, updateProfile } = useProfile();
  const unit = profile?.unit ?? 'ml';

  const [gender, setGender] = useState<Gender>(profile?.gender ?? 'other');
  const [weight, setWeight] = useState(profile?.weight_kg ? String(profile.weight_kg) : '');
  const [height, setHeight] = useState(profile?.height_cm ? String(profile.height_cm) : '');
  const [goal, setGoal] = useState(
    profile ? String(displayAmount(profile.daily_goal_ml, unit)) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const weightKg = parseFloat(weight) || profile?.weight_kg || undefined;
      const heightCm = parseFloat(height) || profile?.height_cm || undefined;
      const goalValue = parseFloat(goal);
      const goalMl = unit === 'oz' ? ozToMl(goalValue) : goalValue;

      await updateProfile({
        gender,
        weight_kg: weightKg,
        height_cm: heightCm,
        daily_goal_ml: Number.isFinite(goalMl) && goalMl > 0 ? Math.round(goalMl) : profile?.daily_goal_ml,
      });
      Alert.alert('Saved', 'Your personal data has been updated.');
    } catch (e: any) {
      Alert.alert('Could not save', e.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculate = () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    if (!weightKg || !heightCm) {
      Alert.alert('Missing info', 'Enter your weight and height first.');
      return;
    }
    const suggested = calculateSuggestedGoalMl(weightKg, heightCm, gender);
    setGoal(String(displayAmount(suggested, unit)));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackHeader title="Personal Data" />

        <Card style={styles.card}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={[styles.pill, gender === g.key && styles.pillActive]}
                onPress={() => setGender(g.key)}
              >
                <Text style={[styles.pillText, gender === g.key && styles.pillTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextField
            label="Weight (kg)"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
          <TextField
            label="Height (cm)"
            keyboardType="decimal-pad"
            value={height}
            onChangeText={setHeight}
          />
          <TextField
            label={`Daily goal (${unit})`}
            keyboardType="decimal-pad"
            value={goal}
            onChangeText={setGoal}
          />
          <Button
            label="Recalculate suggested goal"
            variant="secondary"
            onPress={handleRecalculate}
            style={styles.recalcBtn}
          />
        </Card>

        <Button label="Save Changes" onPress={handleSave} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  card: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  row: { flexDirection: 'row', marginBottom: spacing.md, gap: spacing.sm },
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
  recalcBtn: { marginTop: spacing.xs },
});
