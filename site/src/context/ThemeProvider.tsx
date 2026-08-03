import { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';
import { useAuth } from './AuthContext';

import lightCloudsBg from '../assets/background/light_clouds.png'
import darkCloudsBg from '../assets/background/dark_clouds.png'

const themeStyles = {
  '--light-cloud-img': `url(${lightCloudsBg})`,
  '--dark-cloud-img': `url(${darkCloudsBg})`,
}  as React.CSSProperties;

export function ThemeProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const [prevUserTheme, setPrevUserTheme] = useState<string | undefined>(
    undefined,
  );

  if (user?.settings?.theme && user.settings.theme !== prevUserTheme) {
    setPrevUserTheme(user.settings.theme);
    setTheme(user.settings.theme);
  }

  useEffect(() => {
    const classesToRemove = Array.from(document.body.classList).filter((c) =>
      c.startsWith('theme-'),
    );
    document.body.classList.remove(...classesToRemove);
    document.body.classList.add(`theme-${theme}`);

    localStorage.setItem('app-theme', theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div id='main' className={`theme-${theme}`} style={themeStyles}>{children}</div>
    </ThemeContext.Provider>
  );
}
