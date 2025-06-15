import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardFriendly: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderOptimized: false,
  keyboardFriendly: true
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings();
  }, [settings]);

  const applyAccessibilitySettings = () => {
    // Applica modalità alto contrasto
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Applica testo grande
    if (settings.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }

    // Applica movimento ridotto
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Applica ottimizzazione per screen reader
    if (settings.screenReaderOptimized) {
      document.documentElement.classList.add('screen-reader');
    } else {
      document.documentElement.classList.remove('screen-reader');
    }

    // Applica navigazione da tastiera
    if (settings.keyboardFriendly) {
      document.documentElement.classList.add('keyboard-friendly');
    } else {
      document.documentElement.classList.remove('keyboard-friendly');
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });

    // Mostra toast di conferma
    const settingNames: Record<keyof AccessibilitySettings, string> = {
      highContrast: 'Alto contrasto',
      largeText: 'Testo grande',
      reducedMotion: 'Movimento ridotto',
      screenReaderOptimized: 'Ottimizzazione screen reader',
      keyboardFriendly: 'Navigazione da tastiera'
    };

    const changedSettings = Object.entries(newSettings)
      .map(([key, value]) => {
        const settingKey = key as keyof AccessibilitySettings;
        return `${settingNames[settingKey]}: ${value ? 'Attivato' : 'Disattivato'}`;
      })
      .join(', ');

    toast.success(`Impostazioni aggiornate: ${changedSettings}`);
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
  };

  const toggleLargeText = () => {
    updateSettings({ largeText: !settings.largeText });
  };

  const toggleReducedMotion = () => {
    updateSettings({ reducedMotion: !settings.reducedMotion });
  };

  const toggleScreenReaderOptimized = () => {
    updateSettings({ screenReaderOptimized: !settings.screenReaderOptimized });
  };

  const toggleKeyboardFriendly = () => {
    updateSettings({ keyboardFriendly: !settings.keyboardFriendly });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast.success('Impostazioni di accessibilità ripristinate');
  };

  return {
    settings,
    updateSettings,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderOptimized,
    toggleKeyboardFriendly,
    resetSettings
  };
};