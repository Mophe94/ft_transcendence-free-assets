import { createContext, useContext } from 'react';
import type { ThemeConfig, ThemeKey } from '../constants/Theme';

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeKey: (theme: ThemeKey) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme needs to be executed inside useAuth');
  }
  return context;
};
