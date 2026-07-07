import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../constants/theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const { confirmPasswordReset } = useAuth();
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Missing info', 'Enter the code from your email and a new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(email, otp.trim(), newPassword);
      // A successful reset also signs the user in — RootNavigator takes over from here.
    } catch (e: any) {
      Alert.alert('Could not reset password', e.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.content}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code we sent to {email} and choose a new password.
          </Text>

          <View style={styles.form}>
            <TextField
              label="Code"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              maxLength={6}
            />
            <TextField
              label="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="At least 6 characters"
            />
            <Button label="Reset Password" onPress={handleSubmit} loading={loading} />
            <Button
              label="Back"
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={styles.spaced}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  form: { marginTop: spacing.md },
  spaced: { marginTop: spacing.sm },
});
