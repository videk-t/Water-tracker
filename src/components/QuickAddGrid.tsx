import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUICK_ADD_ML } from '../constants/cupSizes';
import { getShadow, radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Unit } from '../types';
import { displayAmount } from '../utils/units';

interface QuickAddGridProps {
  unit: Unit;
  onAdd: (amountMl: number) => void;
  disabled?: boolean;
}

export default function QuickAddGrid({ unit, onAdd, disabled }: QuickAddGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.grid}>
      {QUICK_ADD_ML.map((ml) => (
        <TouchableOpacity
          key={ml}
          style={styles.item}
          activeOpacity={0.75}
          disabled={disabled}
          onPress={() => onAdd(ml)}
        >
          <View style={styles.dropIcon}>
            <Text style={styles.dropIconText}>+</Text>
          </View>
          <Text style={styles.label}>
            {displayAmount(ml, unit)}
            {unit}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ITEM_WIDTH = '31%';

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    item: {
      width: ITEM_WIDTH,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.sm,
      ...getShadow(colors).soft,
    },
    dropIcon: {
      width: 32,
      height: 32,
      borderRadius: radius.pill,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    dropIconText: { color: colors.primary, fontSize: 18, fontWeight: '700' },
    label: { ...typography.bodyBold, color: colors.text },
  });
}
