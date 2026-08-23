import { useState, useEffect, type PropsWithChildren } from 'react';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME_KEY, Theme, type ThemeKey } from '../constants/Theme';
import { ThemeContext } from './ThemeContext';

const STORAGE_KEY = 'app-theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (saved && saved in Theme) return saved;
    return DEFAULT_THEME_KEY;
  });

  const [prevUserTheme, setPrevUserTheme] = useState(user?.settings?.theme);

  if (user?.settings?.theme !== prevUserTheme) {
    setPrevUserTheme(user?.settings?.theme);
    const userTheme = user?.settings?.theme as ThemeKey | undefined;
    if (userTheme && userTheme in Theme) {
      setActiveThemeKey(userTheme);
    }
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeThemeKey);
  }, [activeThemeKey]);

  const activeTheme = Theme[activeThemeKey];

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setThemeKey: setActiveThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}