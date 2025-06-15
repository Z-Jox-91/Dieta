import React from 'react';
import { User, LogOut, Activity } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-sage-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-sage-900 dark:text-white truncate">Bilanciamo</h1>
              <p className="text-xs text-sage-600 dark:text-gray-400 hidden sm:block">D.ssa Giulia Biondi</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-800 dark:to-accent-800 rounded-full flex items-center justify-center border border-primary-200 dark:border-primary-700">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-medium text-sage-900 dark:text-white truncate max-w-32">{user.name}</p>
                  <p className="text-xs text-sage-600 dark:text-gray-400 truncate max-w-32">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-3 sm:p-2 text-sage-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};