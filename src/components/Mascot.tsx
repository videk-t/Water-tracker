import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../constants/theme';

export type MascotMood = 'happy' | 'excited' | 'sleepy' | 'thirsty' | 'proud';

interface MascotProps {
  size?: number;
  mood?: MascotMood;
}

export default function Mascot({ size = 96, mood = 'happy' }: MascotProps) {
  const w = size;
  const h = size * 1.15;

  return (
    <Svg width={w} height={h} viewBox="0 0 100 115">
      <Path
        d="M50 2 C50 2 12 48 12 76 C12 97.5 29 112 50 112 C71 112 88 97.5 88 76 C88 48 50 2 50 2 Z"
        fill={colors.primary}
      />
      <Path
        d="M50 14 C50 14 26 47 22 68 C20 78 24 88 32 92 C29 82 32 70 38 62 C34 74 36 84 42 89"
        fill={colors.primaryLight}
        opacity={0.5}
      />
      <Face mood={mood} />
    </Svg>
  );
}

function Face({ mood }: { mood: MascotMood }) {
  const eyeY = 72;
  switch (mood) {
    case 'excited':
      return (
        <>
          <Circle cx={38} cy={eyeY} r={4.5} fill="#fff" />
          <Circle cx={62} cy={eyeY} r={4.5} fill="#fff" />
          <Path d="M36 88 Q50 100 64 88" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <Path d="M33 72 Q38 76 43 72" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Path d="M57 72 Q62 76 67 72" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Circle cx={50} cy={90} r={3} fill="#fff" opacity={0.8} />
        </>
      );
    case 'thirsty':
      return (
        <>
          <Circle cx={38} cy={eyeY} r={4} fill="#fff" />
          <Circle cx={62} cy={eyeY} r={4} fill="#fff" />
          <Circle cx={50} cy={90} r={5} fill="#fff" />
        </>
      );
    case 'proud':
      return (
        <>
          <Path d="M33 72 L43 72" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
          <Path d="M57 72 L67 72" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
          <Path d="M35 86 Q50 102 65 86" stroke="#fff" strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'happy':
    default:
      return (
        <>
          <Circle cx={38} cy={eyeY} r={4.5} fill="#fff" />
          <Circle cx={62} cy={eyeY} r={4.5} fill="#fff" />
          <Path d="M37 87 Q50 97 63 87" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      );
  }
}
