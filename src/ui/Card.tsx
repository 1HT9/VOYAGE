import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';

/** Carte "papier" : surface arrondie + ombre douce. */
export function Card({ style, children, ...rest }: ViewProps) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: t.color.surface,
          borderRadius: t.radius.lg,
          padding: t.spacing.lg,
          gap: t.spacing.sm,
          borderWidth: 1,
          borderColor: t.color.hairline,
          ...t.shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
