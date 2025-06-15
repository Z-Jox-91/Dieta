import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('diet-theme');
    return (saved as Theme) || 'auto';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // Auto mode - segue le preferenze del sistema
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Ascolta i cambiamenti delle preferenze del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('diet-theme', newTheme);
    
    const themeNames = {
      light: 'Tema Chiaro',
      dark: 'Tema Scuro',
      auto: 'Automatico'
    };
    
    toast.success(`Tema cambiato: ${themeNames[newTheme]}`);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    changeTheme(newTheme);
  };

  return {
    theme,
    isDark,
    changeTheme,
    toggleTheme
  };
};