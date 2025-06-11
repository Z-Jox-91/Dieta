import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

interface User {
  name: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated authentication check
    const savedUser = localStorage.getItem('bilanciamo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('bilanciamo_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
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