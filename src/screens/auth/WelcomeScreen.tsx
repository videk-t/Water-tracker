import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Mascot from '../../components/Mascot';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../constants/theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const { signInAnonymously } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymously();
    } catch (e: any) {
      Alert.alert('Could not continue as guest', e.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Mascot size={140} mood="happy" />
        <Text style={styles.title}>HydroTrack</Text>
        <Text style={styles.subtitle}>Drink water. Build the habit. Feel great.</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Sign In" onPress={() => navigation.navigate('SignIn')} />
        <Button
          label="Create Account"
          variant="secondary"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.spaced}
        />
        <Button
          label="Continue as Guest"
          variant="ghost"
          onPress={handleGuest}
          loading={loading}
          style={styles.spaced}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: spacing.xxl * 1.5 },
  title: { ...typography.h1, color: colors.text, marginTop: spacing.md },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  actions: { padding: spacing.lg, paddingBottom: spacing.xl },
  spaced: { marginTop: spacing.sm },
});
