import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function InsightsCard({ insights }: { insights: string[] }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View>
      {insights.map((insight, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.bullet}>💡</Text>
          <Text style={styles.text}>{insight}</Text>
        </View>
      ))}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
    bullet: { fontSize: 16, marginRight: spacing.sm },
    text: { ...typography.body, color: colors.text, flex: 1 },
  });
}
