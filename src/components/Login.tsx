import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      onLogin(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-sage-900 mb-2">Accesso Bilanciamo</h2>
          <p className="text-sage-600">Inserisci i tuoi dati per continuare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Nome completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Il tuo nome"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="la-tua-email@esempio.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <span>Accedi</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-sage-500">
            Demo - I dati vengono salvati localmente nel browser
          </p>
        </div>
      </div>
    </div>
  );
};