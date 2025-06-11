import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { FoodAutocomplete } from './FoodAutocomplete';

interface MealItem {
  id: string;
  food: string;
  grams: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category?: string;
}

interface MealSectionProps {
  title: string;
  mealData: MealItem[];
  onUpdate: (data: MealItem[]) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({ 
  title, 
  mealData, 
  onUpdate 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const addItem = () => {
    const newItem: MealItem = {
      id: Date.now().toString(),
      food: '',
      grams: 0,
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      category: ''
    };
    onUpdate([...mealData, newItem]);
  };

  const updateItem = (id: string, updates: Partial<MealItem>) => {
    const updatedData = mealData.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate(updatedData);
  };

  const removeItem = (id: string) => {
    onUpdate(mealData.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    return mealData.reduce((totals, item) => ({
      calories: totals.calories + (item.calories || 0),
      proteins: totals.proteins + (item.proteins || 0),
      carbs: totals.carbs + (item.carbs || 0),
      fats: totals.fats + (item.fats || 0)
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-sage-50/50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-sage-900">{title}</h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-sage-600">
                {Math.round(totals.calories)} kcal • {totals.proteins.toFixed(1)}g proteine
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-sage-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sage-600" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {mealData.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-sage-50/50 rounded-lg">
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Alimento</label>
                  <FoodAutocomplete
                    value={item.food}
                    onChange={(food, nutritionalData) => {
                      updateItem(item.id, {
                        food,
                        ...nutritionalData
                      });
                    }}
                    grams={item.grams}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Grammi</label>
                  <input
                    type="number"
                    value={item.grams || ''}
                    onChange={(e) => {
                      const grams = parseFloat(e.target.value) || 0;
                      // Ricalcola i valori nutrizionali se abbiamo i dati base
                      if (item.food && item.calories > 0) {
                        const baseCalories = (item.calories / (item.grams || 1)) * 100;
                        const baseProteins = (item.proteins / (item.grams || 1)) * 100;
                        const baseCarbs = (item.carbs / (item.grams || 1)) * 100;
                        const baseFats = (item.fats / (item.grams || 1)) * 100;
                        
                        updateItem(item.id, {
                          grams,
                          calories: (baseCalories * grams) / 100,
                          proteins: (baseProteins * grams) / 100,
                          carbs: (baseCarbs * grams) / 100,
                          fats: (baseFats * grams) / 100
                        });
                      } else {
                        updateItem(item.id, { grams });
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Kcal</label>
                  <div className="px-3 py-2 bg-sage-100 border border-sage-200 rounded-lg text-sm text-sage-700">
                    {Math.round(item.calories || 0)}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Proteine (g)</label>
                  <div className="px-3 py-2 bg-sage-100 border border-sage-200 rounded-lg text-sm text-sage-700">
                    {(item.proteins || 0).toFixed(1)}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full p-4 border-2 border-dashed border-sage-300 rounded-lg text-sage-600 hover:text-sage-900 hover:border-sage-400 hover:bg-sage-50/50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Aggiungi alimento</span>
            </button>
          </div>

          {/* Meal Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex space-x-6">
                <div>
                  <p className="text-xs text-sage-600">Totale Calorie</p>
                  <p className="text-lg font-bold text-sage-900">{Math.round(totals.calories)}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-600">Totale Proteine</p>
                  <p className="text-lg font-bold text-sage-900">{totals.proteins.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Macro Tab */}
          {totals.calories > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-sage-200 shadow-sm">
              <div className="flex">
                {/* Carboidrati - Area Gialla */}
                <div className="flex-1 bg-yellow-100/70 p-3 rounded-l-lg">
                  <p className="text-xs font-medium text-sage-600">Carboidrati</p>
                  <p className="text-lg font-bold text-sage-900">
                    {((totals.carbs * 4) / (totals.calories || 1) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-sage-900">{totals.carbs.toFixed(1)}g</p>
                </div>
                
                {/* Proteine - Area Rossa */}
                <div className="flex-1 bg-red-100/70 p-3">
                  <p className="text-xs font-medium text-sage-600">Proteine</p>
                  <p className="text-lg font-bold text-sage-900">
                    {((totals.proteins * 4) / (totals.calories || 1) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-sage-900">{totals.proteins.toFixed(1)}g</p>
                </div>
                
                {/* Lipidi - Area Verde */}
                <div className="flex-1 bg-green-100/70 p-3 rounded-r-lg">
                  <p className="text-xs font-medium text-sage-600">Lipidi</p>
                  <p className="text-lg font-bold text-sage-900">
                    {((totals.fats * 9) / (totals.calories || 1) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-sage-900">{totals.fats.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};