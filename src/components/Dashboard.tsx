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
  const [activeTab, setActiveTab] = useState<'calculations' | 'diet' | 'recipes' | 'foods'>('calculations');
  const [error, setError] = useState<string | null>(null);

  // Resetta l'errore quando cambia la tab
  useEffect(() => {
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

  const renderActiveComponent = () => {
    try {
      return <ActiveComponent />;
    } catch (err) {
      console.error('Errore nel rendering del componente:', err);
      setError(`Si è verificato un errore nel caricamento della pagina ${activeTab === 'diet' ? 'Dieta' : activeTab === 'recipes' ? 'Ricette' : activeTab === 'foods' ? 'Alimenti' : 'Calcoli di Base'}. Riprova più tardi.`);
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-medium">Errore</p>
          <p>{error || 'Si è verificato un errore imprevisto.'}</p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sage-900 mb-2">
          Benvenuto, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-sage-600">Gestisci i tuoi calcoli nutrizionali e piano alimentare</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 mb-8 border border-white/20">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
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