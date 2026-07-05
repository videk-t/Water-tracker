import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';
import TimeField from './TimeField';
import WeekdaySelector from './WeekdaySelector';
import { ALL_DAYS, REMINDER_SOUNDS } from '../constants/cupSizes';
import { colors, radius, spacing, typography } from '../constants/theme';
import { Reminder, ReminderSound } from '../types';

interface ReminderEditModalProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onSave: (data: { time: string; days_of_week: number[]; sound: ReminderSound }) => void;
  onDelete?: () => void;
}

export default function ReminderEditModal({
  visible,
  reminder,
  onClose,
  onSave,
  onDelete,
}: ReminderEditModalProps) {
  const [time, setTime] = useState('08:00:00');
  const [days, setDays] = useState<number[]>(ALL_DAYS);
  const [sound, setSound] = useState<ReminderSound>('default');

  useEffect(() => {
    if (visible) {
      setTime(reminder?.time ?? '08:00:00');
      setDays(reminder?.days_of_week ?? ALL_DAYS);
      setSound(reminder?.sound ?? 'default');
    }
  }, [visible, reminder]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{reminder ? 'Edit reminder' : 'New reminder'}</Text>

          <Text style={styles.label}>Time</Text>
          <TimeField value={time} onChange={setTime} />

          <Text style={[styles.label, styles.spaced]}>Repeat</Text>
          <WeekdaySelector selected={days} onChange={setDays} />

          <Text style={[styles.label, styles.spaced]}>Sound</Text>
          <View style={styles.soundRow}>
            {REMINDER_SOUNDS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.soundPill, sound === s && styles.soundPillActive]}
                onPress={() => setSound(s)}
              >
                <Text style={[styles.soundText, sound === s && styles.soundTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            {onDelete ? (
              <Button label="Delete" variant="danger" onPress={onDelete} style={styles.actionBtn} />
            ) : (
              <Button label="Cancel" variant="secondary" onPress={onClose} style={styles.actionBtn} />
            )}
            <Button
              label="Save"
              onPress={() => onSave({ time, days_of_week: days, sound })}
              style={styles.actionBtn}
              disabled={days.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27,42,74,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: { width: '100%', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  spaced: { marginTop: spacing.md },
  soundRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  soundPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  soundPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  soundText: { ...typography.caption, color: colors.textMuted },
  soundTextActive: { color: colors.textOnPrimary },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionBtn: { flex: 1 },
});
