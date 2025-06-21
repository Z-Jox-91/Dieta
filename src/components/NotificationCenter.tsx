import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Clock, Settings, X, Calendar, Droplet, Dumbbell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { toast } from 'react-hot-toast';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notificationSettings,
    requestPermission,
    permissionState,
    cancelAllReminders
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(notificationSettings || defaultSettings); // Provide default settings if notificationSettings is undefined

  // Define defaultSettings within this component or import it if it's defined elsewhere
  const defaultSettings = {
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
    waterInterval: 120
  };
  const [activeTab, setActiveTab] = useState<'settings' | 'schedule'>('settings');

  useEffect(() => {
    // Ensure localSettings is updated only if notificationSettings is defined
    if (notificationSettings) {
      setLocalSettings(notificationSettings);
    }
  }, [notificationSettings]);

  const handleSave = () => {
    updateNotificationSettings(localSettings);
    toast.success('Impostazioni notifiche salvate');
    onClose();
  };

  const handleToggleNotifications = async () => {
    if (!localSettings.enabled) {
      const result = await requestPermission();
      if (result === 'granted') {
        setLocalSettings({ ...localSettings, enabled: true });
        toast.success('Notifiche abilitate');
      } else {
        toast.error('Permesso notifiche negato');
      }
    } else {
      setLocalSettings({ ...localSettings, enabled: false });
      cancelAllReminders();
      toast.success('Notifiche disabilitate');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isSupported) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 inset-x-0 p-6 bg-white dark:bg-gray-800 rounded-t-xl shadow-xl z-50"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <BellOff className="w-12 h-12 text-gray-400" />
                <h2 className="text-xl font-semibold">Notifiche non supportate</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Il tuo browser non supporta le notifiche push. Prova ad utilizzare un browser più recente o installa l'app.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 inset-x-0 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-t-xl shadow-xl z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-title"
            onKeyDown={handleKeyDown}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
              <h2 id="notification-title" className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Centro Notifiche
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Chiudi centro notifiche"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'settings'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Impostazioni
                </div>
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'schedule'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Programmazione
                </div>
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {localSettings.enabled ? (
                        <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <BellOff className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-medium">Notifiche Push</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {localSettings.enabled ? 'Abilitate' : 'Disabilitate'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleNotifications}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full
                        ${localSettings.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white
                          transition-transform duration-200
                          ${localSettings.enabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-medium mb-3">Tipi di Promemoria</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>Promemoria pasti</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={localSettings.mealReminders}
                            onChange={() =>
                              setLocalSettings({
                                ...localSettings,
                                mealReminders: !localSettings.mealReminders
                              })
                            }
                            disabled={!localSettings.enabled}
                          />
                          <div
                            className={`
                              w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500
                              rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                              after:transition-all dark:border-gray-600 peer-checked:bg-primary-600
                              ${!localSettings.enabled ? 'opacity-50' : ''}
                            `}
                          ></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Droplet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>Promemoria acqua</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={localSettings.waterReminders}
                            onChange={() =>
                              setLocalSettings({
                                ...localSettings,
                                waterReminders: !localSettings.waterReminders
                              })
                            }
                            disabled={!localSettings.enabled}
                          />
                          <div
                            className={`
                              w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500
                              rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                              after:transition-all dark:border-gray-600 peer-checked:bg-primary-600
                              ${!localSettings.enabled ? 'opacity-50' : ''}
                            `}
                          ></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Dumbbell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>Promemoria esercizio</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={localSettings.exerciseReminders}
                            onChange={() =>
                              setLocalSettings({
                                ...localSettings,
                                exerciseReminders: !localSettings.exerciseReminders
                              })
                            }
                            disabled={!localSettings.enabled}
                          />
                          <div
                            className={`
                              w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500
                              rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                              after:transition-all dark:border-gray-600 peer-checked:bg-primary-600
                              ${!localSettings.enabled ? 'opacity-50' : ''}
                            `}
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-medium mb-3">Orari Pasti</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {['Colazione', 'Pranzo', 'Cena', 'Spuntino'].map((meal) => (
                        <div key={meal} className="flex items-center justify-between">
                          <span>{meal}</span>
                          <input
                            type="time"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={
                              localSettings.mealTimes[
                                meal.toLowerCase() as keyof typeof localSettings.mealTimes
                              ] || ''
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                mealTimes: {
                                  ...localSettings.mealTimes,
                                  [meal.toLowerCase()]: e.target.value
                                }
                              })
                            }
                            disabled={!localSettings.enabled || !localSettings.mealReminders}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-medium mb-3">Intervallo Promemoria Acqua</h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="30"
                        max="240"
                        step="30"
                        value={localSettings.waterInterval}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            waterInterval: parseInt(e.target.value)
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        disabled={!localSettings.enabled || !localSettings.waterReminders}
                      />
                      <span className="w-20 text-center">
                        {localSettings.waterInterval} min
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-medium mb-3">Orario Esercizio</h3>
                    <div className="flex items-center justify-between">
                      <span>Promemoria giornaliero</span>
                      <input
                        type="time"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={localSettings.exerciseTime}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            exerciseTime: e.target.value
                          })
                        }
                        disabled={!localSettings.enabled || !localSettings.exerciseReminders}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Stato permesso: {permissionState === 'granted' ? 'Concesso' : permissionState === 'denied' ? 'Negato' : 'Non richiesto'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        disabled={!isSupported}
                      >
                        Salva impostazioni
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Pulsante per aprire il centro notifiche
export const NotificationButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notificationSettings } = useNotifications();

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
        aria-label="Apri centro notifiche"
      >
        {notificationSettings.enabled ? (
          <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Notifiche
        </span>
      </motion.button>

      <NotificationCenter isOpen={isOpen} onClose={closePanel} />
    </>
  );
};