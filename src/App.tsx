import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { AccessibilityButton } from './components/AccessibilityPanel';
import { NotificationButton } from './components/NotificationCenter';
import { UserLevel } from './components/Gamification';
import { OfflineStatus } from './components/OfflineManager';
import { useTheme } from './hooks/useTheme';
import { useOfflineStorage } from './hooks/useOfflineStorage';
import { useNotifications } from './hooks/useNotifications';
import { useGamification } from './hooks/useGamification';
import { useAccessibility } from './hooks/useAccessibility';

interface User {
  name: string;
  email: string;
}

import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, login, logout, loading } = useAuth();
  const { theme } = useTheme();
  const { isOnline } = useOfflineStorage();
  const { checkDailyLogin } = useGamification();
  const { settings: accessibilitySettings } = useAccessibility();
  const { requestPermission } = useNotifications();

  useEffect(() => {
    if (user) {
      checkDailyLogin();
      requestPermission();
    }
  }, [user, checkDailyLogin, requestPermission]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="animate-pulse-soft">
          <div className="w-16 h-16 bg-primary-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        min-h-screen transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-primary-50 to-accent-50 text-gray-900'
        }
        ${accessibilitySettings.highContrast ? 'high-contrast' : ''}
        ${accessibilitySettings.largeText ? 'large-text' : ''}
        ${accessibilitySettings.reducedMotion ? 'reduced-motion' : ''}
        ${accessibilitySettings.screenReaderOptimized ? 'screen-reader-optimized' : ''}
        ${accessibilitySettings.keyboardFriendly ? 'keyboard-friendly' : ''}
        ${!isOnline ? 'offline-mode' : ''}
      `}
    >
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Fixed controls */}
      <div className="floating-controls floating-controls-top">
        <div className="flex flex-col gap-2">
          <OfflineStatus />
          {user && <UserLevel />}
        </div>
      </div>

      <div className="floating-controls floating-controls-bottom">
        <div className="flex flex-col gap-2">
          <ThemeToggle className="floating-button" />
          <AccessibilityButton className="floating-button" />
          {user && <NotificationButton className="floating-button" />}
        </div>
      </div>

      <Header user={user} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <Login onLogin={login} />
        )}
      </main>
    </div>
  );
}

export default App;