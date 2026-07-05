import { Gender } from '../types';

const MIN_GOAL_ML = 1200;
const MAX_GOAL_ML = 4000;
const ML_PER_KG = 33;

/**
 * Rough hydration guideline (~33ml per kg of body weight), nudged by gender
 * and height, then clamped and rounded to the nearest 50ml.
 */
export function calculateSuggestedGoalMl(
  weightKg: number,
  heightCm: number,
  gender: Gender
): number {
  let goal = weightKg * ML_PER_KG;

  if (gender === 'male') {
    goal *= 1.05;
  } else if (gender === 'female') {
    goal *= 0.97;
  }

  if (heightCm > 170) {
    goal += (heightCm - 170) * 3;
  }

  goal = Math.min(MAX_GOAL_ML, Math.max(MIN_GOAL_ML, goal));
  return Math.round(goal / 50) * 50;
}
