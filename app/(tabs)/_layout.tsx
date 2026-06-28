import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/core/theme/ThemeProvider';

/**
 * Navigation par onglets calée sur le cycle de vie du voyage (cf. docs/06).
 * Icônes en emoji pour le squelette ; à remplacer par un set d'icônes en Phase 1.
 */
function Icon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 22, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.color.accent,
        tabBarInactiveTintColor: t.color.textMuted,
        tabBarStyle: {
          backgroundColor: t.color.surface,
          borderTopColor: t.color.hairline,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Aujourd'hui", tabBarIcon: ({ color }) => <Icon glyph="🧭" color={color} /> }}
      />
      <Tabs.Screen
        name="trips"
        options={{ title: 'Voyages', tabBarIcon: ({ color }) => <Icon glyph="🧳" color={color} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Carte', tabBarIcon: ({ color }) => <Icon glyph="🗺️" color={color} /> }}
      />
      <Tabs.Screen
        name="us"
        options={{ title: 'Nous', tabBarIcon: ({ color }) => <Icon glyph="💞" color={color} /> }}
      />
    </Tabs>
  );
}
