import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { radius, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const { styles, variantStyles, labelVariantStyles } = useMemo(() => getStyles(colors), [colors]);
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnPrimary : colors.primary} />
      ) : (
        <Text style={[styles.label, labelVariantStyles[variant]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

function getStyles(colors: ThemeColors) {
  const styles = StyleSheet.create({
    base: {
      height: 52,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    label: {
      ...typography.bodyBold,
      fontSize: 16,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  const variantStyles = StyleSheet.create({
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.danger },
  });

  const labelVariantStyles = StyleSheet.create({
    primary: { color: colors.textOnPrimary },
    secondary: { color: colors.primary },
    ghost: { color: colors.primary },
    danger: { color: colors.textOnPrimary },
  });

  return { styles, variantStyles, labelVariantStyles };
}
