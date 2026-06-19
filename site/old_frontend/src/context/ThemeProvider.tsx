import { useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import { ThemeContext } from './ThemeContext';
import { useAuth } from './AuthContext';


export function ThemeProvider({children}: PropsWithChildren) {

    const { user } = useAuth();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'light';
    });

    const [prevUserTheme, setPrevUserTheme] = useState<string | undefined>(undefined);

    if (user?.settings?.theme && user.settings.theme !== prevUserTheme) {
        setPrevUserTheme(user.settings.theme);
        setTheme(user.settings.theme);
    }

    useEffect(() => {
        const classesToRemove = Array.from(document.body.classList).filter(
            (c) => c.startsWith('theme-'));
        document.body.classList.remove(...classesToRemove);
        document.body.classList.add(`theme-${theme}`);

        localStorage.setItem('app-theme', theme);
    }, [theme]);
    return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`theme-${theme}`}> 
            {children}
        </div>
    </ThemeContext.Provider>
    );
};
