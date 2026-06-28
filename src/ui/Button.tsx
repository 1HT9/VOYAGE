import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/core/theme/ThemeProvider';

type Props = PressableProps & {
  title: string;
  variant?: 'primary' | 'ghost';
};

export function Button({ title, variant = 'primary', style, ...rest }: Props) {
  const t = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      {...rest}
      style={(state) => [
        {
          backgroundColor: primary ? t.color.accent : 'transparent',
          borderRadius: t.radius.pill,
          paddingVertical: t.spacing.md,
          paddingHorizontal: t.spacing.xl,
          alignItems: 'center',
          opacity: state.pressed ? 0.85 : 1,
          borderWidth: primary ? 0 : 1,
          borderColor: t.color.hairline,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text variant="heading" color={primary ? '#fff' : t.color.text}>
        {title}
      </Text>
    </Pressable>
  );
}
