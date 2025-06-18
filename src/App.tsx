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

function App() {
  const [user, setUser] = useState<User | null>(null);
  console.log('App.tsx: user state initialized', user);
  const [loading, setLoading] = useState(true);
  
  // Initialize hooks
  const { theme } = useTheme();
  const { isOnline } = useOfflineStorage();
  const { checkDailyLogin } = useGamification();
  const { settings: accessibilitySettings } = useAccessibility();
  const { requestPermission } = useNotifications();

  useEffect(() => {
    // Simulated authentication check
    const savedUser = localStorage.getItem('bilanciamo_user');
    console.log('App.tsx: useEffect - savedUser from localStorage', savedUser);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('App.tsx: useEffect - parsedUser', parsedUser);
      setUser(parsedUser);
      // Check daily login for gamification
      checkDailyLogin();
    }
    setLoading(false);
  }, [checkDailyLogin]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // Request notification permission on first login
  useEffect(() => {
    if (user) {
      requestPermission();
    }
  }, [user, requestPermission]);

  const handleLogin = (userData: User) => {
    console.log('App.tsx: handleLogin - userData', userData);
    setUser(userData);
    localStorage.setItem('bilanciamo_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    console.log('App.tsx: handleLogout');
    setUser(null);
    localStorage.removeItem('bilanciamo_user');
    localStorage.removeItem('bilanciamo_calculations');
    localStorage.removeItem('bilanciamo_meals');
  };

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

      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {console.log('App.tsx: rendering Dashboard or Login, user:', user)}
        {user ? (
          <Dashboard user={user} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;