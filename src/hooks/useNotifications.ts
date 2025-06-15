import React, { useState, useEffect } from 'react';

export interface NotificationSettings {
  enabled: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  exerciseReminders: boolean;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  waterInterval: number; // minuti
}

const defaultSettings: NotificationSettings = {
  enabled: false,
  mealReminders: true,
  waterReminders: true,
  exerciseReminders: false,
  mealTimes: {
    breakfast: '08:00',
    lunch: '13:00',
    dinner: '20:00',
    snacks: ['10:30', '16:00']
  },
  waterInterval: 120 // 2 ore
};

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verifica supporto notifiche
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
    
    if (settings.enabled && permission === 'granted') {
      scheduleNotifications();
    }
  }, [settings, permission]);

  const requestPermission = async () => {
    if (!isSupported) {
      return 'not-supported';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return 'error';
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const scheduleNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    // Cancella notifiche precedenti
    clearScheduledNotifications();

    // Programma promemoria pasti
    if (settings.mealReminders) {
      scheduleMealReminders();
    }

    // Programma promemoria acqua
    if (settings.waterReminders) {
      scheduleWaterReminders();
    }

    // Programma promemoria esercizio
    if (settings.exerciseReminders) {
      scheduleExerciseReminders();
    }
  };

  const scheduleMealReminders = () => {
    const { breakfast, lunch, dinner, snacks } = settings.mealTimes;
    
    const meals = [
      { time: breakfast, name: 'Colazione' },
      { time: lunch, name: 'Pranzo' },
      { time: dinner, name: 'Cena' },
      ...snacks.map((time, index) => ({ time, name: `Spuntino ${index + 1}` }))
    ];

    meals.forEach(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // Se l'orario è già passato oggi, programma per domani
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        showNotification(
          `Promemoria: ${meal.name}`,
          'È ora di registrare il tuo pasto!',
          '/pwa-192x192.png'
        );
      }, timeUntilNotification);
    });
  };

  const scheduleWaterReminders = () => {
    const intervalMs = settings.waterInterval * 60 * 1000;
    
    const waterInterval = setInterval(() => {
      showNotification(
        'Promemoria Idratazione',
        'Ricordati di bere acqua! 💧',
        '/pwa-192x192.png'
      );
    }, intervalMs);

    // Salva l'ID dell'intervallo per poterlo cancellare
    (window as Window & { waterReminderInterval?: NodeJS.Timeout }).waterReminderInterval = waterInterval;
  };

  const scheduleExerciseReminders = () => {
    // Promemoria esercizio ogni giorno alle 18:00
    const now = new Date();
    const exerciseTime = new Date();
    exerciseTime.setHours(18, 0, 0, 0);

    if (exerciseTime <= now) {
      exerciseTime.setDate(exerciseTime.getDate() + 1);
    }

    const timeUntilExercise = exerciseTime.getTime() - now.getTime();

    setTimeout(() => {
      showNotification(
        'Promemoria Esercizio',
        'È ora di fare un po\' di movimento! 🏃‍♂️',
        '/pwa-192x192.png'
      );
    }, timeUntilExercise);
  };

  const clearScheduledNotifications = () => {
    // Cancella intervalli acqua
    const windowWithInterval = window as Window & { waterReminderInterval?: NodeJS.Timeout };
    if (windowWithInterval.waterReminderInterval) {
      clearInterval(windowWithInterval.waterReminderInterval);
    }
  };

  const showNotification = (title: string, body: string, icon?: string) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'diet-reminder',
      requireInteraction: false
    });

    // Auto-chiudi dopo 5 secondi
    setTimeout(() => {
      notification.close();
    }, 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const testNotification = () => {
    showNotification(
      'Test Notifica',
      'Le notifiche funzionano correttamente! 🎉'
    );
  };

  return {
    settings,
    permission,
    isSupported,
    requestPermission,
    updateSettings,
    scheduleNotifications,
    testNotification,
    showNotification
  };
};