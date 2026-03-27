import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface ThemeContextType {
    theme: "vintage-noir" | "other-theme"; // Keeping for backward compatibility if needed, or deprecate
    setTheme: (theme: string) => void;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    language: "en" | "fr" | "sw" | "ar" | "pt" | "ha";
    setLanguage: (lang: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<"vintage-noir" | "other-theme">("vintage-noir");
    const [mode, setMode] = useState<ThemeMode>('light');
    const [accentColor, setAccentColor] = useState<AccentColor>('blue');
    const [language, setLanguage] = useState<"en" | "fr" | "sw" | "ar" | "pt" | "ha">("en");

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme: setTheme as any,
            mode,
            setMode,
            accentColor,
            setAccentColor,
            language,
            setLanguage: setLanguage as any
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
