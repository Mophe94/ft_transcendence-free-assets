import { createContext, useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';

interface ThemeContextType {
    theme: string,
    setTheme: (theme: string) => void;
}

export  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: PropsWithChildren) {

    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const classesToRemove = Array.from(document.body.classList)
                               .filter(c => c.startsWith('theme-'));
        document.body.classList.remove(...classesToRemove);
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`theme-${theme}`}> 
        {children}
        </div>
    </ThemeContext.Provider>
    );
};
