import React, { useState, useEffect } from 'react';
import { CookingPot, Download, Plus, Trash2 } from 'lucide-react';
import { FoodAutocomplete } from './diet/FoodAutocomplete';
import * as XLSX from 'xlsx';

interface RecipeItem {
  id: string;
  food: string;
  grams: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category?: string;
}

interface Recipe {
  name: string;
  ingredients: RecipeItem[];
  totalGrams: number;
  totalCalories: number;
  totalProteins: number;
  caloriesPer100g: number;
  proteinsPer100g: number;
}

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({});
  const [currentRecipe, setCurrentRecipe] = useState<string>('Nuova Ricetta');
  const [ingredients, setIngredients] = useState<RecipeItem[]>([]);
  
  // Carica le ricette salvate dal localStorage
  useEffect(() => {
    try {
      const savedRecipes = localStorage.getItem('bilanciamo_recipes');
      if (savedRecipes) {
        const parsedRecipes = JSON.parse(savedRecipes);
        setRecipes(parsedRecipes);
        
        // Se ci sono ricette salvate, imposta la prima come ricetta corrente
        const recipeNames = Object.keys(parsedRecipes);
        if (recipeNames.length > 0) {
          setCurrentRecipe(recipeNames[0]);
          setIngredients(parsedRecipes[recipeNames[0]].ingredients);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento delle ricette:', error);
    }
  }, []);
  
  // Salva le ricette nel localStorage quando cambiano
  useEffect(() => {
    if (Object.keys(recipes).length > 0) {
      localStorage.setItem('bilanciamo_recipes', JSON.stringify(recipes));
    }
  }, [recipes]);
  
  const addIngredient = () => {
    const newItem: RecipeItem = {
      id: Date.now().toString(),
      food: '',
      grams: 0,
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      category: ''
    };
    setIngredients([...ingredients, newItem]);
  };

  const updateIngredient = (id: string, updates: Partial<RecipeItem>) => {
    const updatedIngredients = ingredients.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setIngredients(updatedIngredients);
    saveCurrentRecipe(updatedIngredients);
  };

  const removeIngredient = (id: string) => {
    const updatedIngredients = ingredients.filter(item => item.id !== id);
    setIngredients(updatedIngredients);
    saveCurrentRecipe(updatedIngredients);
  };
  
  const calculateTotals = (ingredientsList: RecipeItem[]) => {
    const totals = ingredientsList.reduce((acc, item) => ({
      grams: acc.grams + (item.grams || 0),
      calories: acc.calories + (item.calories || 0),
      proteins: acc.proteins + (item.proteins || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fats: acc.fats + (item.fats || 0)
    }), { grams: 0, calories: 0, proteins: 0, carbs: 0, fats: 0 });
    
    // Calcola valori per 100g
    const caloriesPer100g = totals.grams > 0 ? (totals.calories / totals.grams) * 100 : 0;
    const proteinsPer100g = totals.grams > 0 ? (totals.proteins / totals.grams) * 100 : 0;
    
    return {
      ...totals,
      caloriesPer100g,
      proteinsPer100g
    };
  };
  
  const saveCurrentRecipe = (ingredientsList: RecipeItem[] = ingredients) => {
    if (currentRecipe.trim() === '') return;
    
    const totals = calculateTotals(ingredientsList);
    
    const updatedRecipe: Recipe = {
      name: currentRecipe,
      ingredients: ingredientsList,
      totalGrams: totals.grams,
      totalCalories: totals.calories,
      totalProteins: totals.proteins,
      caloriesPer100g: totals.caloriesPer100g,
      proteinsPer100g: totals.proteinsPer100g
    };
    
    setRecipes(prev => ({
      ...prev,
      [currentRecipe]: updatedRecipe
    }));
  };
  
  const createNewRecipe = () => {
    setCurrentRecipe('Nuova Ricetta');
    setIngredients([]);
  };
  
  const loadRecipe = (recipeName: string) => {
    if (recipes[recipeName]) {
      setCurrentRecipe(recipeName);
      setIngredients(recipes[recipeName].ingredients);
    }
  };
  
  const exportToExcel = () => {
    if (!currentRecipe || !recipes[currentRecipe]) return;
    
    const recipe = recipes[currentRecipe];
    
    // Prepara i dati per l'export
    const ingredientsData = recipe.ingredients.map(item => ({
      'Alimento': item.food,
      'Grammi': item.grams,
      'Calorie': Math.round(item.calories),
      'Proteine (g)': item.proteins.toFixed(1),
      'Carboidrati (g)': item.carbs.toFixed(1),
      'Grassi (g)': item.fats.toFixed(1)
    }));
    
    // Aggiungi una riga vuota e poi i totali
    ingredientsData.push({
      'Alimento': '',
      'Grammi': '',
      'Calorie': '',
      'Proteine (g)': '',
      'Carboidrati (g)': '',
      'Grassi (g)': ''
    });
    
    ingredientsData.push({
      'Alimento': 'TOTALI',
      'Grammi': recipe.totalGrams,
      'Calorie': Math.round(recipe.totalCalories),
      'Proteine (g)': recipe.totalProteins.toFixed(1),
      'Carboidrati (g)': '',
      'Grassi (g)': ''
    });
    
    ingredientsData.push({
      'Alimento': 'PER 100g',
      'Grammi': 100,
      'Calorie': Math.round(recipe.caloriesPer100g),
      'Proteine (g)': recipe.proteinsPer100g.toFixed(1),
      'Carboidrati (g)': '',
      'Grassi (g)': ''
    });
    
    // Crea il workbook e il worksheet
    const ws = XLSX.utils.json_to_sheet(ingredientsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ricetta');
    
    // Genera il file Excel e lo scarica
    XLSX.writeFile(wb, `${currentRecipe.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`);
  };
  
  const totals = calculateTotals(ingredients);
  
  return (
    <div className="space-y-8">
      {/* Recipe Editor */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CookingPot className="w-5 h-5 text-primary-600" />
              <input
                type="text"
                value={currentRecipe}
                onChange={(e) => {
                  setCurrentRecipe(e.target.value);
                  saveCurrentRecipe();
                }}
                className="text-lg font-semibold text-sage-900 bg-transparent border-b border-sage-300 focus:outline-none focus:border-primary-500 px-2 py-1 w-full max-w-md"
                placeholder="Nome Ricetta"
              />
            </div>
            
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors flex items-center space-x-2"
              disabled={ingredients.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Esporta Excel</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={createNewRecipe}
              className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Nuova</span>
            </button>
            
            {Object.keys(recipes).map(recipeName => (
              <button
                key={recipeName}
                onClick={() => loadRecipe(recipeName)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${currentRecipe === recipeName ? 'bg-accent-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}
              >
                {recipeName}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {ingredients.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-sage-50/50 rounded-lg">
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-sage-700 mb-1">Alimento</label>
                  <FoodAutocomplete
                    value={item.food}
                    onChange={(food, nutritionalData) => {
                      updateIngredient(item.id, {
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
                        
                        updateIngredient(item.id, {
                          grams,
                          calories: (baseCalories * grams) / 100,
                          proteins: (baseProteins * grams) / 100,
                          carbs: (baseCarbs * grams) / 100,
                          fats: (baseFats * grams) / 100
                        });
                      } else {
                        updateIngredient(item.id, { grams });
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
                    onClick={() => removeIngredient(item.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addIngredient}
              className="w-full p-4 border-2 border-dashed border-sage-300 rounded-lg text-sage-600 hover:text-sage-900 hover:border-sage-400 hover:bg-sage-50/50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Aggiungi ingrediente</span>
            </button>
          </div>
          
          {/* Recipe Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
            <h3 className="text-lg font-semibold text-sage-900 mb-4">Riepilogo Ricetta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-sage-600">Peso Totale</p>
                <p className="text-xl font-bold text-sage-900">{Math.round(totals.grams)} g</p>
              </div>
              
              <div>
                <p className="text-sm text-sage-600">Calorie Totali</p>
                <p className="text-xl font-bold text-sage-900">{Math.round(totals.calories)} kcal</p>
              </div>
              
              <div>
                <p className="text-sm text-sage-600">Proteine Totali</p>
                <p className="text-xl font-bold text-sage-900">{totals.proteins.toFixed(1)} g</p>
              </div>
              
              <div className="md:col-span-2 lg:col-span-1">
                <p className="text-sm text-sage-600 font-medium">Per 100g di ricetta:</p>
                <p className="text-lg font-bold text-primary-900">{Math.round(totals.caloriesPer100g)} kcal</p>
                <p className="text-lg font-bold text-accent-900">{totals.proteinsPer100g.toFixed(1)} g proteine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};