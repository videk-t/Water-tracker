import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../constants/theme';

export default function BackHeader({ title }: { title: string }) {
  const navigation = useNavigation();
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: colors.primary, marginTop: -4 },
  title: { ...typography.h2, color: colors.text, flex: 1, textAlign: 'center' },
  spacer: { width: 32 },
});
