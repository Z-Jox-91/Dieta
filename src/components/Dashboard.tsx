import React, { useState, useEffect } from 'react';
import { Calculator, Calendar, CookingPot, Apple } from 'lucide-react';
import { Calculations } from './Calculations';
import { Diet } from './Diet';
import { Recipes } from './Recipes';
import { Foods } from './Foods';

interface DashboardProps {
  user: { name: string; email: string };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  console.log('Dashboard.tsx: props.user', user);
  const [activeTab, setActiveTab] = useState<'calculations' | 'diet' | 'recipes' | 'foods'>('calculations');
  console.log('Dashboard.tsx: activeTab initialized', activeTab);
  const [error, setError] = useState<string | null>(null);

  // Resetta l'errore quando cambia la tab
  useEffect(() => {
    console.log('Dashboard.tsx: activeTab changed to', activeTab);
    setError(null);
  }, [activeTab]);

  const tabs = [
    {
      id: 'calculations' as const,
      label: 'Calcoli di Base',
      icon: Calculator,
      component: Calculations
    },
    {
      id: 'diet' as const,
      label: 'Dieta',
      icon: Calendar,
      component: Diet
    },
    {
      id: 'recipes' as const,
      label: 'Ricette',
      icon: CookingPot,
      component: Recipes
    },
    {
      id: 'foods' as const,
      label: 'Alimenti',
      icon: Apple,
      component: Foods
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Calculations;
  console.log('Dashboard.tsx: ActiveComponent selected', ActiveComponent);

  const renderActiveComponent = () => {
    try {
      return <ActiveComponent />;
    } catch (err) {
      console.error('Errore nel rendering del componente:', err);
      setError(`Si è verificato un errore nel caricamento della pagina ${activeTab === 'diet' ? 'Dieta' : activeTab === 'recipes' ? 'Ricette' : activeTab === 'foods' ? 'Alimenti' : 'Calcoli di Base'}. Riprova più tardi.`);
      console.log('Dashboard.tsx: rendering, user:', user, 'activeTab:', activeTab);
  return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-medium">Errore</p>
          <p>{error || 'Si è verificato un errore imprevisto.'}</p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 dark:text-white mb-2">
          Benvenuto, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-sage-600 dark:text-gray-300 text-sm sm:text-base">Gestisci i tuoi calcoli nutrizionali e piano alimentare</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 mb-6 sm:mb-8 border border-white/20 shadow-lg">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none min-w-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg transform scale-105'
                    : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-slide-up">
        {renderActiveComponent()}
      </div>
    </div>
  );
};