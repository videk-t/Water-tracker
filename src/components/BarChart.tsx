import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors, radius, typography } from '../constants/theme';
import { DayBucket } from '../services/stats';

interface BarChartProps {
  buckets: DayBucket[];
  goalMl: number;
  width?: number;
  height?: number;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function BarChart({ buckets, goalMl, width = 320, height = 180 }: BarChartProps) {
  const paddingBottom = 24;
  const paddingTop = 12;
  const chartHeight = height - paddingBottom - paddingTop;
  const maxValue = Math.max(goalMl, ...buckets.map((b) => b.totalMl), 1);

  const barCount = buckets.length;
  const gap = 10;
  const barWidth = (width - gap * (barCount - 1)) / barCount;
  const goalY = paddingTop + chartHeight * (1 - Math.min(goalMl / maxValue, 1));

  return (
    <View>
      <Svg width={width} height={height}>
        <Line
          x1={0}
          y1={goalY}
          x2={width}
          y2={goalY}
          stroke={colors.primaryLight}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        {buckets.map((bucket, i) => {
          const barHeight = Math.max((bucket.totalMl / maxValue) * chartHeight, bucket.totalMl > 0 ? 4 : 0);
          const x = i * (barWidth + gap);
          const y = paddingTop + chartHeight - barHeight;
          const met = goalMl > 0 && bucket.totalMl >= goalMl;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={barWidth / 2}
              fill={met ? colors.primary : colors.secondary}
            />
          );
        })}
      </Svg>
      <View style={styles.labelRow}>
        {buckets.map((bucket, i) => (
          <Text key={i} style={[styles.label, { width: barWidth + gap }]}>
            {DAY_LABELS[bucket.date.getDay()]}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', marginTop: 4 },
  label: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
