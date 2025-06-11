import React from 'react';
import { User, LogOut, Activity } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sage-900">Bilanciamo</h1>
              <p className="text-xs text-sage-600">D.ssa Giulia Biondi</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-sage-900">{user.name}</p>
                  <p className="text-xs text-sage-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-sage-600 hover:text-sage-900 hover:bg-sage-100 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};