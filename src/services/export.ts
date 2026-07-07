import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { DRINK_TYPES } from '../constants/drinks';
import { IntakeLog } from '../types';

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsv(logs: IntakeLog[]): string {
  const header = ['Date', 'Time', 'Amount (ml)', 'Drink Type'];
  const rows = logs.map((log) => {
    const d = new Date(log.logged_at);
    return [
      d.toLocaleDateString(),
      d.toLocaleTimeString(),
      String(log.amount_ml),
      DRINK_TYPES[log.drink_type]?.label ?? log.drink_type,
    ];
  });

  return [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
}

/** Writes the given logs to a CSV file and opens the native share sheet. */
export async function exportLogsAsCsv(logs: IntakeLog[]): Promise<void> {
  const csv = buildCsv(logs);
  const file = new File(Paths.cache, `hydrotrack-export-${Date.now()}.csv`);
  file.create();
  file.write(csv);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'Export HydroTrack data' });
}
