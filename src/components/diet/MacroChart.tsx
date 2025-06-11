import React from 'react';

interface MacroChartProps {
  foods: Array<{
    name: string;
    nutritionalData: {
      calories: number;
      proteins: number;
      carbs: number;
      fats: number;
      category: string;
    };
  }>;
}

export const MacroChart: React.FC<MacroChartProps> = ({ foods }) => {
  // Verifica che foods sia un array valido
  if (!Array.isArray(foods) || foods.length === 0) {
    return <div className="text-center text-sage-500 text-sm">Aggiungi alimenti per visualizzare la distribuzione dei macronutrienti</div>;
  }

  // Calcola le calorie totali per macronutriente con controlli di sicurezza
  const proteinCalories = foods.reduce((sum, food) => {
    const proteins = food?.nutritionalData?.proteins || 0;
    return sum + proteins * 4;
  }, 0);
  
  const carbCalories = foods.reduce((sum, food) => {
    const carbs = food?.nutritionalData?.carbs || 0;
    return sum + carbs * 4;
  }, 0);
  
  const fatCalories = foods.reduce((sum, food) => {
    const fats = food?.nutritionalData?.fats || 0;
    return sum + fats * 9;
  }, 0);
  
  const totalCalories = proteinCalories + carbCalories + fatCalories;
  
  // Se non ci sono calorie, mostra un messaggio
  if (totalCalories === 0) {
    return <div className="text-center text-sage-500 text-sm">Aggiungi alimenti per visualizzare la distribuzione dei macronutrienti</div>;
  }
  
  // Calcola le percentuali
  const proteinPercentage = (proteinCalories / totalCalories) * 100;
  const carbPercentage = (carbCalories / totalCalories) * 100;
  const fatPercentage = (fatCalories / totalCalories) * 100;

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-red-600 font-medium text-xs mb-1">
          Proteine: {proteinPercentage.toFixed(1)}% (30%)
        </p>
        <p className="text-yellow-500 font-medium text-xs mb-1">
          Carboidrati: {carbPercentage.toFixed(1)}% (50%)
        </p>
        <p className="text-green-600 font-medium text-xs">
          Lipidi: {fatPercentage.toFixed(1)}% (20%)
        </p>
      </div>
    </div>
  );
};