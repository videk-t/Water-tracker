import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { getShadow, radius, spacing, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return <View style={[styles.card, style]}>{children}</View>;
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.md,
      ...getShadow(colors).card,
    },
  });
}
