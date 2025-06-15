import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { toast } from 'react-hot-toast';

// Configurazione di localforage
localforage.config({
  name: 'DietBilanciamo',
  version: 1.0,
  storeName: 'dietData',
  description: 'Storage offline per Diet Bilanciamo'
});

export interface OfflineData {
  calculations: Record<string, unknown>[];
  foods: Record<string, unknown>[];
  meals: Record<string, unknown>[];
  userPreferences: Record<string, unknown>;
  lastSync: number;
}

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connessione ripristinata!');
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Modalità offline attivata');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carica l'ultimo sync
    loadLastSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveData = async (key: string, data: unknown) => {
    try {
      await localforage.setItem(key, {
        data,
        timestamp: Date.now(),
        synced: isOnline
      });
      
      if (!isOnline) {
        toast('Dati salvati offline', { icon: '💾' });
      }
    } catch (err) {
      console.error('Errore nel salvataggio:', err);
      toast.error('Errore nel salvataggio dei dati');
    }
  };

  const loadData = async (key: string) => {
    try {
      const result = await localforage.getItem(key) as Record<string, unknown> | null;
      return result?.data || null;
    } catch (err) {
      console.error('Errore nel caricamento:', err);
      return null;
    }
  };

  const syncData = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    
    try {
      // Simula sincronizzazione con server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      setLastSync(now);
      await localforage.setItem('lastSync', now.getTime());
      
      setSyncStatus('idle');
      toast.success('Dati sincronizzati!');
    } catch {
      setSyncStatus('error');
      toast.error('Errore nella sincronizzazione');
    }
  };

  const loadLastSync = async () => {
    try {
      const timestamp = await localforage.getItem('lastSync') as number;
      if (timestamp) {
        setLastSync(new Date(timestamp));
      }
    } catch (error) {
      console.error('Errore nel caricamento ultimo sync:', error);
    }
  };

  const clearOfflineData = async () => {
    try {
      await localforage.clear();
      setLastSync(null);
      toast.success('Cache offline pulita');
    } catch {
      toast.error('Errore nella pulizia della cache');
    }
  };

  const getStorageInfo = async () => {
    try {
      const keys = await localforage.keys();
      const size = keys.length;
      return { keys, size };
    } catch {
      return { keys: [], size: 0 };
    }
  };

  return {
    isOnline,
    syncStatus,
    lastSync,
    saveData,
    loadData,
    syncData,
    clearOfflineData,
    getStorageInfo
  };
};