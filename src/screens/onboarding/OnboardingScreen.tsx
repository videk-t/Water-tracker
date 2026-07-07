import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Mascot from '../../components/Mascot';
import TextField from '../../components/TextField';
import { useProfile } from '../../context/ProfileContext';
import { calculateSuggestedGoalMl } from '../../services/goal';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Gender, Unit } from '../../types';
import { displayAmount } from '../../utils/units';

const GENDERS: { key: Gender; label: string }[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'other', label: 'Other' },
];

export default function OnboardingScreen() {
  const { updateProfile } = useProfile();
  const [gender, setGender] = useState<Gender>('female');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<Unit>('ml');
  const [saving, setSaving] = useState(false);

  const weightKg = parseFloat(weight);
  const heightCm = parseFloat(height);
  const validInputs = !Number.isNaN(weightKg) && !Number.isNaN(heightCm) && weightKg > 0 && heightCm > 0;

  const suggestedGoalMl = useMemo(() => {
    if (!validInputs) return null;
    return calculateSuggestedGoalMl(weightKg, heightCm, gender);
  }, [validInputs, weightKg, heightCm, gender]);

  const handleFinish = async () => {
    if (!suggestedGoalMl) {
      Alert.alert('Almost done', 'Enter your weight and height so we can suggest a goal.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        gender,
        weight_kg: weightKg,
        height_cm: heightCm,
        daily_goal_ml: suggestedGoalMl,
        unit,
        onboarding_completed: true,
      });
    } catch (e: any) {
      Alert.alert('Could not save', e.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Mascot size={80} mood="proud" />
            <Text style={styles.title}>Let's set your goal</Text>
            <Text style={styles.subtitle}>
              A few details so HydroTrack can suggest a daily water goal.
            </Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.sectionLabel}>Gender</Text>
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
              placeholder="65"
            />
            <TextField
              label="Height (cm)"
              keyboardType="decimal-pad"
              value={height}
              onChangeText={setHeight}
              placeholder="170"
            />

            <Text style={styles.sectionLabel}>Preferred unit</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.pill, unit === 'ml' && styles.pillActive]}
                onPress={() => setUnit('ml')}
              >
                <Text style={[styles.pillText, unit === 'ml' && styles.pillTextActive]}>ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pill, unit === 'oz' && styles.pillActive]}
                onPress={() => setUnit('oz')}
              >
                <Text style={[styles.pillText, unit === 'oz' && styles.pillTextActive]}>oz</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {suggestedGoalMl ? (
            <Card style={styles.goalCard}>
              <Text style={styles.goalLabel}>Suggested daily goal</Text>
              <Text style={styles.goalValue}>
                {displayAmount(suggestedGoalMl, unit)}
                {unit}
              </Text>
              <Text style={styles.goalHint}>You can fine-tune this anytime in Settings.</Text>
            </Card>
          ) : null}

          <Button label="Get Started" onPress={handleFinish} loading={saving} style={styles.cta} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.sm },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  card: { marginBottom: spacing.md },
  sectionLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
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
  goalCard: { alignItems: 'center', backgroundColor: colors.primary, marginBottom: spacing.lg },
  goalLabel: { ...typography.body, color: colors.textOnPrimary, opacity: 0.85 },
  goalValue: { ...typography.h1, color: colors.textOnPrimary, marginTop: spacing.xs },
  goalHint: { ...typography.caption, color: colors.textOnPrimary, opacity: 0.8, marginTop: spacing.xs },
  cta: { marginTop: spacing.sm },
});
