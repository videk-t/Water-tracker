import { Unit } from '../types';

const ML_PER_OZ = 29.5735;

export function mlToOz(ml: number): number {
  return ml / ML_PER_OZ;
}

export function ozToMl(oz: number): number {
  return oz * ML_PER_OZ;
}

export function formatAmount(ml: number, unit: Unit): string {
  if (unit === 'oz') {
    return `${Math.round(mlToOz(ml))}oz`;
  }
  return `${Math.round(ml)}ml`;
}

export function displayAmount(ml: number, unit: Unit): number {
  return unit === 'oz' ? Math.round(mlToOz(ml)) : Math.round(ml);
}
