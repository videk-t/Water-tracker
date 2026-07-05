import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { IntakeProvider } from '../context/IntakeContext';
import { RemindersProvider } from '../context/RemindersContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import NotificationScheduler from '../components/NotificationScheduler';
import { colors } from '../constants/theme';

export default function RootNavigator() {
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const loading = authLoading || (session && profileLoading);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!session ? (
        <AuthNavigator />
      ) : !profile?.onboarding_completed ? (
        <OnboardingScreen />
      ) : (
        <IntakeProvider>
          <RemindersProvider>
            <NotificationScheduler />
            <MainTabNavigator />
          </RemindersProvider>
        </IntakeProvider>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
