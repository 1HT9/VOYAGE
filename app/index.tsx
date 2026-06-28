import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/core/auth/useAuth';
import { isSupabaseConfigured } from '@/core/supabase/client';

export default function Index() {
  const { initializing, isAuthenticated } = useAuth();

  // Tant que Supabase n'est pas configuré, on laisse entrer (mode offline-only)
  // pour pouvoir développer l'UI sans backend.
  if (!isSupabaseConfigured) return <Redirect href="/(tabs)" />;

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/sign-in'} />;
}
