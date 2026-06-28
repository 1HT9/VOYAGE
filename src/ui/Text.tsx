import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';
import type { typography } from '@/core/theme/tokens';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
  color?: string;
};

/** Texte typé sur les tokens de typographie. */
export function Text({ variant = 'body', muted, color, style, ...rest }: Props) {
  const t = useTheme();
  return (
    <RNText
      {...rest}
      style={[t.typography[variant], { color: color ?? (muted ? t.color.textMuted : t.color.text) }, style]}
    />
  );
}
