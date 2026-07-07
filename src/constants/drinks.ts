import { DrinkType } from '../types';

interface DrinkTypeInfo {
  label: string;
  emoji: string;
  /**
   * Fraction of the logged volume that counts toward the hydration goal.
   * Water/tea/juice hydrate fully; coffee and soda are mild diuretics so
   * only partially count; alcohol is net-dehydrating so it barely counts.
   * This is a simplified model, not medical advice.
   */
  hydrationMultiplier: number;
}

export const DRINK_TYPES: Record<DrinkType, DrinkTypeInfo> = {
  water: { label: 'Water', emoji: '💧', hydrationMultiplier: 1 },
  tea: { label: 'Tea', emoji: '🍵', hydrationMultiplier: 0.9 },
  juice: { label: 'Juice', emoji: '🧃', hydrationMultiplier: 0.9 },
  coffee: { label: 'Coffee', emoji: '☕', hydrationMultiplier: 0.8 },
  soda: { label: 'Soda', emoji: '🥤', hydrationMultiplier: 0.85 },
  alcohol: { label: 'Alcohol', emoji: '🍷', hydrationMultiplier: 0.2 },
};

export const DRINK_TYPE_ORDER: DrinkType[] = ['water', 'coffee', 'tea', 'soda', 'juice', 'alcohol'];

export function hydrationValueMl(amountMl: number, drinkType: DrinkType): number {
  return amountMl * DRINK_TYPES[drinkType].hydrationMultiplier;
}
