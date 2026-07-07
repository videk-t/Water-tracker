import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function BackHeader({ title }: { title: string }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    backText: { fontSize: 28, color: colors.primary, marginTop: -4 },
    title: { ...typography.h2, color: colors.text, flex: 1, textAlign: 'center' },
    spacer: { width: 32 },
  });
}
