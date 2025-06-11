import React, { useEffect, useState } from 'react';
import { Zap, Target } from 'lucide-react';

interface DayStatsProps {
  dayData: any;
  selectedDay: number;
}

export const DayStats: React.FC<DayStatsProps> = ({ dayData, selectedDay }) => {
  const [calorieLimit, setCalorieLimit] = useState<number | null>(null);
  const [proteinGoal, setProteinGoal] = useState<number | null>(null);
  const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  
  useEffect(() => {
    // Carica i limiti di calorie giornalieri dal localStorage
    try {
      const savedLimits = localStorage.getItem('bilanciamo_daily_limits');
      if (savedLimits) {
        const parsedLimits = JSON.parse(savedLimits);
        const dayName = daysOfWeek[selectedDay];
        setCalorieLimit(parsedLimits[dayName] || null);
      }
      
      // Carica l'obiettivo proteico giornaliero dal localStorage
      const savedCalculations = localStorage.getItem('bilanciamo_calculations');
      if (savedCalculations) {
        const parsedCalculations = JSON.parse(savedCalculations);
        if (parsedCalculations.results && parsedCalculations.results.dailyProteinRda) {
          setProteinGoal(parsedCalculations.results.dailyProteinRda);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      setCalorieLimit(null);
      setProteinGoal(null);
    }
  }, [selectedDay]);

  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProteins = 0;

    // Verifica che dayData sia un oggetto valido
    if (!dayData || typeof dayData !== 'object') {
      return { totalCalories, totalProteins };
    }

    Object.values(dayData).forEach((meal: any) => {
      if (Array.isArray(meal)) {
        meal.forEach((item: any) => {
          if (item && typeof item === 'object') {
            totalCalories += item.calories || 0;
            totalProteins += item.proteins || 0;
          }
        });
      }
    });

    return { totalCalories, totalProteins };
  };

  const { totalCalories, totalProteins } = calculateTotals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
        <div className="flex items-center space-x-3 mb-2">
          <Zap className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-primary-900">Calorie Totali</h3>
        </div>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-bold text-primary-900">{Math.round(totalCalories)}</p>
          {calorieLimit && (
            <p className="text-lg text-primary-700 mb-1">/ {calorieLimit} kcal limite</p>
          )}
        </div>
        <p className="text-sm text-primary-700 mt-1">kcal giornaliere</p>
      </div>

      <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl border border-accent-200">
        <div className="flex items-center space-x-3 mb-2">
          <Target className="w-6 h-6 text-accent-600" />
          <h3 className="text-lg font-semibold text-accent-900">Proteine Totali</h3>
        </div>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-bold text-accent-900">{totalProteins.toFixed(1)}</p>
          {proteinGoal && (
            <p className="text-lg text-accent-700 mb-1">/ {proteinGoal.toFixed(1)}g obiettivo</p>
          )}
        </div>
        <p className="text-sm text-accent-700 mt-1">grammi giornalieri</p>
      </div>
    </div>
  );
};