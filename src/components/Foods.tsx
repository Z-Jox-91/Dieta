import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit3, Save, X, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FoodItem {
  id: string;
  name: string;
  category: 'CRB' | 'PRT' | 'LPD';
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

interface NewFoodForm {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export const Foods: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<NewFoodForm>({
    name: '',
    calories: 0,
    carbs: 0,
    proteins: 0,
    fats: 0
  });
  const [editFood, setEditFood] = useState<NewFoodForm>({
    name: '',
    calories: 0,
    carbs: 0,
    proteins: 0,
    fats: 0
  });
  const [isExcelLoaded, setIsExcelLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'CRB' | 'PRT' | 'LPD'>('all');

  // Carica i dati dal localStorage all'avvio
  useEffect(() => {
    const savedFoods = localStorage.getItem('bilanciamo_food_database');
    if (savedFoods) {
      try {
        const parsedFoods = JSON.parse(savedFoods);
        if (Array.isArray(parsedFoods)) {
          // Converti il formato esistente se necessario
          const convertedFoods = parsedFoods.map((food: any, index: number) => ({
            id: food.id || `food_${index}`,
            name: food.name || '',
            category: food.category || calculateCategory(food.carbs || 0, food.proteins || 0, food.fats || 0),
            calories: food.calories || 0,
            carbs: food.carbs || 0,
            proteins: food.proteins || 0,
            fats: food.fats || 0
          }));
          setFoods(convertedFoods);
          setIsExcelLoaded(true);
        }
      } catch (error) {
        console.error('Errore nel caricamento del database alimentare:', error);
      }
    }
  }, []);

  // Salva i dati nel localStorage ogni volta che cambiano
  useEffect(() => {
    if (foods.length > 0) {
      localStorage.setItem('bilanciamo_food_database', JSON.stringify(foods));
    }
  }, [foods]);

  // Calcola automaticamente la categoria basata sui macronutrienti
  const calculateCategory = (carbs: number, proteins: number, fats: number): 'CRB' | 'PRT' | 'LPD' => {
    const carbCalories = carbs * 4;
    const proteinCalories = proteins * 4;
    const fatCalories = fats * 9;

    if (carbCalories >= proteinCalories && carbCalories >= fatCalories) {
      return 'CRB';
    } else if (proteinCalories >= fatCalories) {
      return 'PRT';
    } else {
      return 'LPD';
    }
  };

  // Gestisce il caricamento del file Excel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedFoods: FoodItem[] = jsonData.map((row: any, index: number) => {
        const carbs = parseFloat(row.carbs || row.carboidrati || 0);
        const proteins = parseFloat(row.proteins || row.proteine || 0);
        const fats = parseFloat(row.fats || row.lipidi || 0);
        
        return {
          id: `excel_${index}_${Date.now()}`,
          name: row.name || row.nome || '',
          category: row.category || calculateCategory(carbs, proteins, fats),
          calories: parseFloat(row.calories || row.energia || 0),
          carbs,
          proteins,
          fats
        };
      });

      setFoods(processedFoods);
      setIsExcelLoaded(true);
      alert(`Database alimentare caricato con successo! ${processedFoods.length} alimenti importati.`);
    } catch (error) {
      console.error('Errore durante l\'elaborazione del file Excel:', error);
      alert('Errore durante l\'elaborazione del file Excel. Verifica il formato del file.');
    }

    // Reset input file
    e.target.value = '';
  };

  // Aggiunge un nuovo alimento
  const handleAddFood = () => {
    if (!newFood.name.trim()) {
      alert('Il nome dell\'alimento è obbligatorio');
      return;
    }

    const category = calculateCategory(newFood.carbs, newFood.proteins, newFood.fats);
    const foodToAdd: FoodItem = {
      id: `new_${Date.now()}`,
      name: newFood.name.trim(),
      category,
      calories: newFood.calories,
      carbs: newFood.carbs,
      proteins: newFood.proteins,
      fats: newFood.fats
    };

    setFoods(prev => [...prev, foodToAdd]);
    setNewFood({ name: '', calories: 0, carbs: 0, proteins: 0, fats: 0 });
    setIsAddingNew(false);
  };

  // Elimina un alimento
  const handleDeleteFood = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo alimento?')) {
      setFoods(prev => prev.filter(food => food.id !== id));
    }
  };

  // Inizia la modifica di un alimento
  const startEditing = (food: FoodItem) => {
    setEditingId(food.id);
    setEditFood({
      name: food.name,
      calories: food.calories,
      carbs: food.carbs,
      proteins: food.proteins,
      fats: food.fats
    });
  };

  // Salva le modifiche
  const saveEdit = () => {
    if (!editFood.name.trim()) {
      alert('Il nome dell\'alimento è obbligatorio');
      return;
    }

    const category = calculateCategory(editFood.carbs, editFood.proteins, editFood.fats);
    setFoods(prev => prev.map(food => 
      food.id === editingId 
        ? {
            ...food,
            name: editFood.name.trim(),
            category,
            calories: editFood.calories,
            carbs: editFood.carbs,
            proteins: editFood.proteins,
            fats: editFood.fats
          }
        : food
    ));
    setEditingId(null);
  };

  // Annulla la modifica
  const cancelEdit = () => {
    setEditingId(null);
    setEditFood({ name: '', calories: 0, carbs: 0, proteins: 0, fats: 0 });
  };

  // Filtra gli alimenti
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || food.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'CRB': return 'Carboidrato';
      case 'PRT': return 'Proteina';
      case 'LPD': return 'Lipidi';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CRB': return 'bg-blue-100 text-blue-800';
      case 'PRT': return 'bg-green-100 text-green-800';
      case 'LPD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h1 className="text-2xl font-bold text-sage-900 mb-4">Database Alimenti</h1>
        <p className="text-sage-600">Gestisci il tuo database personalizzato di alimenti con le relative proprietà nutrizionali.</p>
      </div>

      {/* Caricamento Excel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-sage-900">Importa da Excel</h2>
        </div>
        
        <p className="text-sage-700 mb-4">Carica un file Excel con il tuo database di alimenti.</p>
        <p className="text-sm text-sage-600 mb-4">Il file deve contenere le colonne: name/nome, calories/energia, carbs/carboidrati, proteins/proteine, fats/lipidi.</p>
        
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-sage-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
          />
        </div>
        
        {isExcelLoaded && (
          <div className="mt-3 text-sm text-green-600 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Database caricato con successo! ({foods.length} alimenti)</span>
          </div>
        )}
      </div>

      {/* Filtri e ricerca */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cerca alimenti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tutte le categorie</option>
              <option value="CRB">Carboidrati</option>
              <option value="PRT">Proteine</option>
              <option value="LPD">Lipidi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista alimenti */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-sage-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-sage-900">Alimenti ({filteredFoods.length})</h2>
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Alimento</span>
            </button>
          </div>
        </div>

        {/* Form per nuovo alimento */}
        {isAddingNew && (
          <div className="p-6 border-b border-sage-200 bg-sage-50">
            <h3 className="text-lg font-semibold text-sage-900 mb-4">Nuovo Alimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-sage-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nome alimento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Energia (kcal/100g)</label>
                <input
                  type="number"
                  value={newFood.calories}
                  onChange={(e) => setNewFood(prev => ({ ...prev, calories: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Carboidrati (g/100g)</label>
                <input
                  type="number"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Proteine (g/100g)</label>
                <input
                  type="number"
                  value={newFood.proteins}
                  onChange={(e) => setNewFood(prev => ({ ...prev, proteins: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">Lipidi (g/100g)</label>
                <input
                  type="number"
                  value={newFood.fats}
                  onChange={(e) => setNewFood(prev => ({ ...prev, fats: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddFood}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salva</span>
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewFood({ name: '', calories: 0, carbs: 0, proteins: 0, fats: 0 });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Annulla</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabella alimenti */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sage-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Energia (kcal/100g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Carboidrati (g/100g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Proteine (g/100g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Lipidi (g/100g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sage-200">
              {filteredFoods.map((food) => (
                <tr key={food.id} className="hover:bg-sage-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === food.id ? (
                      <input
                        type="text"
                        value={editFood.name}
                        onChange={(e) => setEditFood(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-2 py-1 border border-sage-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-sm font-medium text-sage-900">{food.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(food.category)}`}>
                      {getCategoryLabel(food.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-900">
                    {editingId === food.id ? (
                      <input
                        type="number"
                        value={editFood.calories}
                        onChange={(e) => setEditFood(prev => ({ ...prev, calories: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-sage-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      food.calories.toFixed(1)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-900">
                    {editingId === food.id ? (
                      <input
                        type="number"
                        value={editFood.carbs}
                        onChange={(e) => setEditFood(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-sage-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      food.carbs.toFixed(1)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-900">
                    {editingId === food.id ? (
                      <input
                        type="number"
                        value={editFood.proteins}
                        onChange={(e) => setEditFood(prev => ({ ...prev, proteins: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-sage-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      food.proteins.toFixed(1)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-900">
                    {editingId === food.id ? (
                      <input
                        type="number"
                        value={editFood.fats}
                        onChange={(e) => setEditFood(prev => ({ ...prev, fats: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-sage-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      food.fats.toFixed(1)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === food.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(food)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFoods.length === 0 && (
            <div className="text-center py-8 text-sage-500">
              {foods.length === 0 ? 'Nessun alimento presente. Carica un file Excel o aggiungi manualmente.' : 'Nessun alimento trovato con i filtri selezionati.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};