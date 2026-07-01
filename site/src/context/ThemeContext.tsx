import { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
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
