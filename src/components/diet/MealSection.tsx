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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50/80 transition-colors duration-150"
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
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {mealData.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 bg-white/60 rounded-lg border border-gray-100/50 hover:bg-white/80 transition-colors duration-150">
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
                      updateItem(item.id, { grams });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-150"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Kcal</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                    {Math.round(item.calories || 0)}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Proteine (g)</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                    {(item.proteins || 0).toFixed(1)}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-150 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50/80 transition-all duration-150 flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Aggiungi alimento</span>
            </button>
          </div>

          {/* Meal Summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex space-x-6">
                <div>
                  <p className="text-xs text-gray-600">Totale Calorie</p>
                  <p className="text-lg font-bold text-gray-800">{Math.round(totals.calories)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Totale Proteine</p>
                  <p className="text-lg font-bold text-gray-800">{totals.proteins.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Macro Tab */}
          {totals.calories > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex rounded-md overflow-hidden">
                {/* Carboidrati - Area Gialla */}
                <div className="flex-1 bg-yellow-100/80 p-3">
                  <p className="text-xs font-medium text-gray-600">Carboidrati</p>
                  <p className="text-sm font-bold text-gray-800">
                    {((totals.carbs * 4) / (totals.calories || 1) * 100).toFixed(1)}% (45-60%)
                  </p>
                  <p className="text-xs text-gray-800">{totals.carbs.toFixed(1)}g</p>
                </div>
                
                {/* Proteine - Area Rossa */}
                <div className="flex-1 bg-red-100/80 p-3">
                  <p className="text-xs font-medium text-gray-600">Proteine</p>
                  <p className="text-sm font-bold text-gray-800">
                    {((totals.proteins * 4) / (totals.calories || 1) * 100).toFixed(1)}% (10-20%)
                  </p>
                  <p className="text-xs text-gray-800">{totals.proteins.toFixed(1)}g</p>
                </div>
                
                {/* Lipidi - Area Verde */}
                <div className="flex-1 bg-green-100/80 p-3">
                  <p className="text-xs font-medium text-gray-600">Lipidi</p>
                  <p className="text-sm font-bold text-gray-800">
                    {((totals.fats * 9) / (totals.calories || 1) * 100).toFixed(1)}% (20-35%)
                  </p>
                  <p className="text-xs text-gray-800">{totals.fats.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};