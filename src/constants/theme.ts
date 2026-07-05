export const colors = {
  background: '#EAF4FE',
  backgroundAlt: '#DCEBFC',
  card: '#FFFFFF',
  primary: '#4A90E2',
  primaryDark: '#2E6DC7',
  primaryLight: '#8EC3F5',
  secondary: '#7FD3E8',
  accent: '#3AB6E8',
  text: '#1B2A4A',
  textMuted: '#6E85A8',
  textOnPrimary: '#FFFFFF',
  border: '#D6E6FB',
  success: '#3FC896',
  warning: '#F5A623',
  danger: '#EF5A5A',
  track: '#D9E9FC',
  night: '#3A4A73',
} as const;

export const gradients = {
  primary: ['#5CA8F2', '#2E6DC7'] as const,
  drop: ['#7FD3E8', '#4A90E2'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#2E6DC7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  soft: {
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};
