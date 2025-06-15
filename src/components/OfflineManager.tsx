import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Database, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { toast } from 'react-hot-toast';

interface OfflineStatusProps {
  className?: string;
}

// Componente che mostra lo stato della connessione
export const OfflineStatus: React.FC<OfflineStatusProps> = ({ className = '' }) => {
  const { isOnline, syncData } = useOfflineStorage();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Non sei connesso a Internet. Impossibile sincronizzare.');
      return;
    }

    setIsSyncing(true);
    try {
      await syncData();
      toast.success('Dati sincronizzati con successo!');
    } catch (error) {
      console.error('Errore durante la sincronizzazione:', error);
      toast.error('Errore durante la sincronizzazione. Riprova più tardi.');
    } finally {
      setIsSyncing(false);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${className} ${
        isOnline 
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
      }`}
    >
      {isOnline ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isOnline ? 'Online' : 'Offline'}
      </span>
      {isOnline && (
        <motion.button
          onClick={handleSync}
          disabled={isSyncing}
          className="ml-1 p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800/30 focus:outline-none focus:ring-2 focus:ring-green-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Sincronizza dati"
          title="Sincronizza dati"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        </motion.button>
      )}
    </motion.div>
  );
};

interface OfflineManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ isOpen, onClose }) => {
  const {
    isOnline,
    lastSyncTime,
    syncData,
    getStorageInfo,
    clearCache
  } = useOfflineStorage();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ size: string; items: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      updateStorageInfo();
    }
  }, [isOpen]);

  const updateStorageInfo = async () => {
    const info = await getStorageInfo();
    setStorageInfo(info);
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Non sei connesso a Internet. Impossibile sincronizzare.');
      return;
    }

    setIsSyncing(true);
    try {
      await syncData();
      toast.success('Dati sincronizzati con successo!');
      await updateStorageInfo();
    } catch (error) {
      console.error('Errore durante la sincronizzazione:', error);
      toast.error('Errore durante la sincronizzazione. Riprova più tardi.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Sei sicuro di voler cancellare tutti i dati offline? Questa azione non può essere annullata.')) {
      setIsClearing(true);
      try {
        await clearCache();
        toast.success('Cache offline cancellata con successo!');
        await updateStorageInfo();
      } catch (error) {
        console.error('Errore durante la cancellazione della cache:', error);
        toast.error('Errore durante la cancellazione della cache. Riprova più tardi.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Mai';
    
    const date = new Date(lastSyncTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

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
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 inset-x-0 p-6 bg-white dark:bg-gray-800 rounded-t-xl shadow-xl z-50 max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offline-title"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="offline-title" className="text-xl font-semibold flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
                Gestione Offline
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isOnline
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dati Offline</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {storageInfo
                        ? `${storageInfo.items} elementi (${storageInfo.size})`
                        : 'Caricamento...'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium">Ultima sincronizzazione</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatLastSync()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm font-medium">Stato connessione</span>
                      </div>
                      <span
                        className={`text-sm ${
                          isOnline
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isOnline ? 'Connesso' : 'Disconnesso'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSync}
                  disabled={!isOnline || isSyncing}
                  className={`
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    ${isOnline
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                >
                  {isSyncing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>
                    {isSyncing
                      ? 'Sincronizzazione in corso...'
                      : 'Sincronizza dati con il server'}
                  </span>
                </button>

                <button
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                    hover:bg-red-100 dark:hover:bg-red-900/30
                    transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
                  "
                >
                  {isClearing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Database className="w-5 h-5" />
                  )}
                  <span>
                    {isClearing
                      ? 'Cancellazione in corso...'
                      : 'Cancella cache offline'}
                  </span>
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="mb-2">
                    <strong>Come funziona la modalità offline:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>I dati vengono salvati automaticamente sul tuo dispositivo</li>
                    <li>Puoi continuare a usare l'app anche senza connessione</li>
                    <li>Quando torni online, i dati vengono sincronizzati automaticamente</li>
                    <li>Puoi sincronizzare manualmente in qualsiasi momento</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Pulsante per aprire il gestore offline
export const OfflineButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOnline } = useOfflineStorage();

  const openManager = () => {
    setIsOpen(true);
  };

  const closeManager = () => {
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={openManager}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          ${isOnline
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}
          hover:bg-opacity-80 dark:hover:bg-opacity-80
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Gestione modalità offline"
      >
        {isOnline ? (
          <Wifi className="w-5 h-5" />
        ) : (
          <WifiOff className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </motion.button>

      <OfflineManager isOpen={isOpen} onClose={closeManager} />
    </>
  );
};