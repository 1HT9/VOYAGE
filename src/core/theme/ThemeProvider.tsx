import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { makeTheme, type Theme } from './tokens';

const ThemeContext = createContext<Theme>(makeTheme('light'));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => makeTheme(scheme === 'dark' ? 'dark' : 'light'), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Accès au thème courant (clair/sombre selon le système). */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
