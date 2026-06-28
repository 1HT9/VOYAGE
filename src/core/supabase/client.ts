import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // En dev on alerte tôt : sans config, l'app tourne en mode offline-only.
  console.warn(
    '[Voyage] EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY manquants. ' +
      'Copier .env.example en .env. Mode hors-ligne uniquement en attendant.',
  );
}

/**
 * Client Supabase partagé. La session est persistée via AsyncStorage et
 * rafraîchie automatiquement. C'est le point d'entrée du cloud (cf. docs/03).
 */
export const supabase = createClient(supabaseUrl ?? 'http://localhost', supabaseAnonKey ?? 'anon', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
