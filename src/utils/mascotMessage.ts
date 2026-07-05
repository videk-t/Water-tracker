import { MascotMood } from '../components/Mascot';

export function getMascotState(progress: number): { mood: MascotMood; message: string } {
  if (progress >= 1) {
    return { mood: 'proud', message: "Goal smashed! You're on fire today." };
  }
  if (progress >= 0.75) {
    return { mood: 'excited', message: 'Almost there — just a little more!' };
  }
  if (progress >= 0.4) {
    return { mood: 'happy', message: "Nice pace, keep the sips coming." };
  }
  if (progress > 0) {
    return { mood: 'thirsty', message: "Good start! Let's drink some more water." };
  }
  return { mood: 'sleepy', message: 'Rise and hydrate! Log your first drink.' };
}
