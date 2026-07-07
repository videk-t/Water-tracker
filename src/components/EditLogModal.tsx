import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import TextField from './TextField';
import { radius, spacing, typography, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { IntakeLog, Unit } from '../types';
import { displayAmount, ozToMl } from '../utils/units';

interface EditLogModalProps {
  visible: boolean;
  log: IntakeLog | null;
  unit: Unit;
  onClose: () => void;
  onSave: (amountMl: number) => void;
}

export default function EditLogModal({ visible, log, unit, onClose, onSave }: EditLogModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (log) {
      setValue(String(displayAmount(log.amount_ml, unit)));
    }
  }, [log, unit]);

  const handleSave = () => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    const amountMl = unit === 'oz' ? ozToMl(parsed) : parsed;
    onSave(Math.round(amountMl));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Edit amount</Text>
          <TextField
            keyboardType="decimal-pad"
            value={value}
            onChangeText={setValue}
            autoFocus
            placeholder={`Amount (${unit})`}
          />
          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={onClose} style={styles.actionBtn} />
            <Button label="Save" onPress={handleSave} style={styles.actionBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(27,42,74,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    sheet: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    title: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    actionBtn: { flex: 1 },
  });
}
