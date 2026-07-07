import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Unit } from '../types';
import { displayAmount } from '../utils/units';

interface ProgressRingProps {
  currentMl: number;
  goalMl: number;
  unit: Unit;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  currentMl,
  goalMl,
  unit,
  size = 220,
  strokeWidth = 18,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goalMl > 0 ? Math.min(currentMl / goalMl, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;
  const percent = Math.round(progress * 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.secondary} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.center}>
          <Text style={styles.amount}>
            {displayAmount(currentMl, unit)}
            <Text style={styles.goalText}>/{displayAmount(goalMl, unit)}{unit}</Text>
          </Text>
          <Text style={styles.percent}>{percent}% of goal</Text>
        </View>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    amount: { ...typography.h1, fontSize: 32, color: colors.text },
    goalText: { ...typography.h3, color: colors.textMuted },
    percent: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  });
}
