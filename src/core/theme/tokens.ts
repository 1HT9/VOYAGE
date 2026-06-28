/**
 * Design tokens — la source de vérité visuelle de Voyage.
 * Inspiration : Apple (profondeur, mouvement), Airbnb (chaleur, photo),
 * Notion (structure), Polarsteps (la carte comme héros).
 * Voir docs/06-ux-et-ecrans.md
 */

export const palette = {
  // Fonds "papier chaud" / nuit
  paper: '#FBFAF7',
  paperDark: '#0E1116',
  surface: '#FFFFFF',
  surfaceDark: '#171B22',

  // Encre
  ink: '#1A1A1A',
  inkMuted: '#6B6F76',
  inkInverse: '#FBFAF7',

  // Accent : dégradé soleil -> mer
  sun: '#FF8A5B',
  sea: '#2E7CF6',
  sunset: '#F5576C',

  // Sémantique
  success: '#2BB673',
  warning: '#F2B705',
  danger: '#E5484D',

  // Lignes / séparateurs
  hairline: 'rgba(0,0,0,0.08)',
  hairlineDark: 'rgba(255,255,255,0.10)',
} as const;

export const gradients = {
  brand: [palette.sun, palette.sea] as const, // soleil -> mer
  sunset: [palette.sun, palette.sunset] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  // Titres : serif éditoriale (carnet de voyage). Texte : sans-serif géométrique.
  display: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.2 },
  title: { fontSize: 24, fontWeight: '700' as const },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;

export type ThemeMode = 'light' | 'dark';

export function makeTheme(mode: ThemeMode) {
  const dark = mode === 'dark';
  return {
    mode,
    color: {
      background: dark ? palette.paperDark : palette.paper,
      surface: dark ? palette.surfaceDark : palette.surface,
      text: dark ? palette.inkInverse : palette.ink,
      textMuted: palette.inkMuted,
      accent: palette.sea,
      accentWarm: palette.sun,
      hairline: dark ? palette.hairlineDark : palette.hairline,
      success: palette.success,
      warning: palette.warning,
      danger: palette.danger,
    },
    spacing,
    radius,
    typography,
    shadow,
    gradients,
  };
}

export type Theme = ReturnType<typeof makeTheme>;
