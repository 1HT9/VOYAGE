import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/core/theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

/** Conteneur d'écran : safe area + fond du thème. */
export function Screen({ children, scroll = true, style }: Props) {
  const t = useTheme();
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.color.background }]} edges={['top']}>
      <Body
        style={styles.flex}
        contentContainerStyle={scroll ? { padding: t.spacing.xl, gap: t.spacing.lg } : undefined}
      >
        <View style={[!scroll && { flex: 1, padding: t.spacing.xl, gap: t.spacing.lg }, style]}>{children}</View>
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
