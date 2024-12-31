import { createContext, useContext } from 'react';

type ColorScheme = 'light' | 'dark';

const ThemeContext = createContext<ColorScheme>('dark');

export const ThemeProvider = ThemeContext.Provider;

export function useTheme() {
  return useContext(ThemeContext);
} 