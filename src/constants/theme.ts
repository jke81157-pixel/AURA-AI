export const COLORS = {
  // Backgrounds
  background: '#0B0F19',
  cardBackground: '#131B2E',
  cardBackgroundLight: '#1A233A',
  elevatedBackground: '#1E293B',
  surface: '#0F172A',
  overlay: 'rgba(5, 8, 16, 0.85)',
  
  // Accents
  primary: '#6366F1', // Indigo Neon
  primaryGradientStart: '#6366F1',
  primaryGradientEnd: '#A855F7',
  secondary: '#06B6D4', // Cyan Neon
  accent: '#EC4899', // Pink Neon
  warning: '#F59E0B', // Amber
  success: '#10B981', // Emerald
  error: '#EF4444', // Red
  gold: '#FBBF24', // Gold for Pro

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',
  
  // Borders & Dividers
  border: '#1E293B',
  borderHighlight: '#334155',
  borderPrimary: 'rgba(99, 102, 241, 0.4)',

  // Badges & Transparencies
  primaryAlpha10: 'rgba(99, 102, 241, 0.12)',
  primaryAlpha20: 'rgba(99, 102, 241, 0.25)',
  cyanAlpha10: 'rgba(6, 182, 212, 0.12)',
  goldAlpha15: 'rgba(251, 191, 36, 0.15)',
  glass: 'rgba(30, 41, 59, 0.7)',
};

export const GRADIENTS = {
  primary: ['#6366F1', '#A855F7'] as [string, string],
  secondary: ['#06B6D4', '#3B82F6'] as [string, string],
  hot: ['#F43F5E', '#FB7185'] as [string, string],
  gold: ['#F59E0B', '#FBBF24'] as [string, string],
  darkCard: ['#1A233A', '#131B2E'] as [string, string],
  banner: ['#4F46E5', '#7C3AED', '#DB2777'] as [string, string, string],
  cyber: ['#00F2FE', '#4FACFE'] as [string, string],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  goldGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
};
