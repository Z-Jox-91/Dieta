import React from 'react';
import { User, LogOut, Activity } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-sage-900 truncate">Bilanciamo</h1>
              <p className="text-xs text-sage-600 hidden sm:block">D.ssa Giulia Biondi</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center border border-primary-200">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-medium text-sage-900 truncate max-w-32">{user.name}</p>
                  <p className="text-xs text-sage-600 truncate max-w-32">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-sage-600 hover:text-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};