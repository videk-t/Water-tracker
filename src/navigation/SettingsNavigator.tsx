import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsHomeScreen from '../screens/settings/SettingsHomeScreen';
import RemindersScreen from '../screens/settings/RemindersScreen';
import PersonalDataScreen from '../screens/settings/PersonalDataScreen';
import { colors } from '../constants/theme';
import { SettingsStackParamList } from './types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Reminders" component={RemindersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
