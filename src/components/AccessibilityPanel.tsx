import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility,
  Eye,
  Type,
  Zap,
  Keyboard,
  Monitor,
  RefreshCw,
  X
} from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderOptimized,
    toggleKeyboardFriendly,
    resetSettings
  } = useAccessibility();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
            onKeyDown={handleKeyDown}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Accessibility className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2
                    id="accessibility-title"
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    Impostazioni Accessibilità
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Chiudi pannello accessibilità"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="space-y-6">
                  {/* Alto contrasto */}
                  <div className="flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id="high-contrast"
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={toggleHighContrast}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="high-contrast"
                        className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white"
                      >
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Modalità Alto Contrasto
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Aumenta il contrasto dei colori per migliorare la leggibilità.
                      </p>
                    </div>
                  </div>

                  {/* Testo grande */}
                  <div className="flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id="large-text"
                        type="checkbox"
                        checked={settings.largeText}
                        onChange={toggleLargeText}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="large-text"
                        className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white"
                      >
                        <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Testo Grande
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Aumenta la dimensione del testo per una migliore leggibilità.
                      </p>
                    </div>
                  </div>

                  {/* Movimento ridotto */}
                  <div className="flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id="reduced-motion"
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={toggleReducedMotion}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="reduced-motion"
                        className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white"
                      >
                        <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Movimento Ridotto
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Riduce o elimina le animazioni e gli effetti di movimento.
                      </p>
                    </div>
                  </div>

                  {/* Ottimizzazione screen reader */}
                  <div className="flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id="screen-reader"
                        type="checkbox"
                        checked={settings.screenReaderOptimized}
                        onChange={toggleScreenReaderOptimized}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="screen-reader"
                        className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white"
                      >
                        <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Ottimizzazione Screen Reader
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Migliora la compatibilità con i lettori di schermo.
                      </p>
                    </div>
                  </div>

                  {/* Navigazione da tastiera */}
                  <div className="flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id="keyboard-friendly"
                        type="checkbox"
                        checked={settings.keyboardFriendly}
                        onChange={toggleKeyboardFriendly}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label
                        htmlFor="keyboard-friendly"
                        className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white"
                      >
                        <Keyboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Navigazione da Tastiera
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Migliora la navigazione tramite tastiera con indicatori di focus visibili.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Ripristina impostazioni predefinite</span>
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Queste impostazioni vengono salvate automaticamente e si applicano a tutte le pagine dell'applicazione.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Pulsante per aprire il pannello di accessibilità
export const AccessibilityButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={openPanel}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Apri impostazioni accessibilità"
      >
        <Accessibility className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Accessibilità
        </span>
      </motion.button>

      <AccessibilityPanel isOpen={isOpen} onClose={closePanel} />
    </>
  );
};