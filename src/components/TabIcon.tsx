import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface TabIconProps {
  name: 'home' | 'history' | 'settings';
  color: string;
  size?: number;
}

export default function TabIcon({ name, color, size = 24 }: TabIconProps) {
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2 C12 2 4 9 4 14.5 C4 18.6 7.6 22 12 22 C16.4 22 20 18.6 20 14.5 C20 9 12 2 12 2 Z"
            fill={color}
          />
        </Svg>
      );
    case 'history':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={4} y={12} width={3.5} height={8} rx={1} fill={color} />
          <Rect x={10.25} y={7} width={3.5} height={13} rx={1} fill={color} />
          <Rect x={16.5} y={3} width={3.5} height={17} rx={1} fill={color} />
        </Svg>
      );
    case 'settings':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3.2} fill={color} />
          <Path
            d="M12 2.5 L13.2 5.3 L16.2 4.7 L16 7.8 L18.8 9.2 L16.6 11.3 L18.8 13.4 L16 14.8 L16.2 17.9 L13.2 17.3 L12 20.1 L10.8 17.3 L7.8 17.9 L8 14.8 L5.2 13.4 L7.4 11.3 L5.2 9.2 L8 7.8 L7.8 4.7 L10.8 5.3 Z"
            stroke={color}
            strokeWidth={1.4}
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      );
  }
}
