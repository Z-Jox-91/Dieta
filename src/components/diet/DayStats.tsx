import React, { useState, useEffect } from 'react';
import { Zap, Target } from 'lucide-react';

interface MealItem {
  calories?: number;
  proteins?: number;
  [key: string]: unknown;
}

interface DayData {
  [mealName: string]: MealItem[];
}

interface DayStatsProps {
  dayData: DayData;
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
    let totalCarbs = 0;
    let totalFats = 0;

    // Verifica che dayData sia un oggetto valido
    if (!dayData || typeof dayData !== 'object') {
      return { totalCalories, totalProteins, totalCarbs, totalFats };
    }

    Object.values(dayData).forEach((meal: any[]) => {
      if (Array.isArray(meal)) {
        meal.forEach((item: any) => {
          if (item && typeof item === 'object') {
            totalCalories += item.calories || 0;
            totalProteins += item.proteins || 0;
            totalCarbs += item.carbs || 0;
            totalFats += item.fats || 0;
          }
        });
      }
    });

    return { totalCalories, totalProteins, totalCarbs, totalFats };
  };

  const { totalCalories, totalProteins, totalCarbs, totalFats } = calculateTotals();

  return (
    <div className="space-y-6">
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

      {/* Sezione Percentuali Macronutrienti Giornalieri */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Macronutrienti Giornaliera</h3>
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          {/* Carboidrati - Area Gialla */}
          <div className="flex-1 bg-yellow-100/80 p-4">
            <p className="text-sm font-medium text-gray-600">Carboidrati</p>
            <p className="text-lg font-bold text-gray-800">
              {((totalCarbs * 4) / (totalCalories || 1) * 100).toFixed(1)}% (45-60%)
            </p>
            <p className="text-sm text-gray-800">{totalCarbs.toFixed(1)}g</p>
          </div>
          
          {/* Proteine - Area Rossa */}
          <div className="flex-1 bg-red-100/80 p-4">
            <p className="text-sm font-medium text-gray-600">Proteine</p>
            <p className="text-lg font-bold text-gray-800">
              {((totalProteins * 4) / (totalCalories || 1) * 100).toFixed(1)}% (10-20%)
            </p>
            <p className="text-sm text-gray-800">{totalProteins.toFixed(1)}g</p>
          </div>
          
          {/* Lipidi - Area Verde */}
          <div className="flex-1 bg-green-100/80 p-4">
            <p className="text-sm font-medium text-gray-600">Lipidi</p>
            <p className="text-lg font-bold text-gray-800">
              {((totalFats * 9) / (totalCalories || 1) * 100).toFixed(1)}% (20-35%)
            </p>
            <p className="text-sm text-gray-800">{totalFats.toFixed(1)}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};