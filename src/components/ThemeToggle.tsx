import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, changeTheme } = useTheme();

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Chiaro' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Scuro' },
    { value: 'auto', icon: <Monitor className="w-4 h-4" />, label: 'Auto' }
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === theme);

  const handleToggle = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    changeTheme(themes[nextIndex].value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tema:
        </span>
      )}
      
      <motion.button
        onClick={handleToggle}
        className={className || 'floating-button'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Cambia tema (attuale: ${themes[currentThemeIndex].label})`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-gray-600 dark:text-gray-400"
          >
            {themes[currentThemeIndex].icon}
          </motion.div>
        </AnimatePresence>
        
        {/* Indicatore del tema attivo */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      </motion.button>
      
      {showLabel && (
        <motion.span
          key={theme}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400 min-w-[50px]"
        >
          {themes[currentThemeIndex].label}
        </motion.span>
      )}
    </div>
  );
};

// Componente esteso con menu dropdown
export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes: { value: Theme; icon: React.ReactNode; label: string; description: string }[] = [
    { 
      value: 'light', 
      icon: <Sun className="w-4 h-4" />, 
      label: 'Tema Chiaro',
      description: 'Interfaccia luminosa'
    },
    { 
      value: 'dark', 
      icon: <Moon className="w-4 h-4" />, 
      label: 'Tema Scuro',
      description: 'Interfaccia scura'
    },
    { 
      value: 'auto', 
      icon: <Monitor className="w-4 h-4" />, 
      label: 'Automatico',
      description: 'Segue il sistema'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme)!;

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500
          min-w-[160px]
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currentTheme.icon}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {currentTheme.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentTheme.description}
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                absolute top-full left-0 mt-2 z-20
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-lg shadow-lg
                min-w-[200px]
                overflow-hidden
              `}
            >
              {themes.map((themeOption) => (
                <motion.button
                  key={themeOption.value}
                  onClick={() => {
                    changeTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${theme === themeOption.value ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                  `}
                  whileHover={{ x: 4 }}
                >
                  <div className={`
                    ${theme === themeOption.value 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {themeOption.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`
                      text-sm font-medium
                      ${theme === themeOption.value 
                        ? 'text-primary-900 dark:text-primary-100' 
                        : 'text-gray-900 dark:text-white'
                      }
                    `}>
                      {themeOption.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {themeOption.description}
                    </div>
                  </div>
                  {theme === themeOption.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary-500"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};