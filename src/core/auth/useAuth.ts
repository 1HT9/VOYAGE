import { useEffect } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

type AuthState = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  setSession: (session: Session | null) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initializing: true,
  setSession: (session) => set({ session, user: session?.user ?? null, initializing: false }),
}));

/**
 * Branche le store sur les évènements d'auth Supabase. À monter une fois,
 * au plus haut niveau de l'app (cf. app/_layout.tsx).
 */
export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => sub.subscription.unsubscribe();
  }, [setSession]);
}

export function useAuth() {
  // useShallow : sans lui, ce sélecteur renvoie un nouvel objet à chaque rendu
  // et provoque une boucle de re-render infinie (React #185) sous Zustand v5.
  return useAuthStore(
    useShallow((s) => ({
      session: s.session,
      user: s.user,
      initializing: s.initializing,
      isAuthenticated: Boolean(s.session),
    })),
  );
}

export async function signInWithEmail(email: string) {
  // OTP par e-mail (lien magique / code). Apple & Google viendront en Phase 1.
  return supabase.auth.signInWithOtp({ email });
}

export async function signOut() {
  return supabase.auth.signOut();
}
