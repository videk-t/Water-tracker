import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors, radius, spacing, typography } from '../constants/theme';

interface TimeFieldProps {
  label?: string;
  value: string; // "HH:mm:ss" or "HH:mm"
  onChange: (value: string) => void;
}

function parseTime(value: string): Date {
  const [h, m] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}:00`;
}

function displayTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function TimeField({ label, value, onChange }: TimeFieldProps) {
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const date = parseTime(value);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'time',
        is24Hour: false,
        onChange: (_, selected) => {
          if (selected) onChange(formatTime(selected));
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity style={styles.field} onPress={openPicker}>
        <Text style={styles.value}>{displayTime(date)}</Text>
      </TouchableOpacity>
      {showIOSPicker && Platform.OS === 'ios' ? (
        <DateTimePicker
          value={date}
          mode="time"
          display="spinner"
          onChange={(_, selected) => {
            setShowIOSPicker(false);
            if (selected) onChange(formatTime(selected));
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  field: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  value: { ...typography.bodyBold, color: colors.text },
});
