import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

// Definizione dell'interfaccia per i dati nutrizionali
interface NutritionalData {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: string;
}

interface FoodItem {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: string;
}

interface FoodAutocompleteProps {
  value: string;
  onChange: (food: string, nutritionalData: NutritionalData) => void;
  grams: number;
}

// Database alimenti estratto dal file Excel fornito
let foodDatabase: FoodItem[] = [
  // Dati esistenti...
];

// Carica il database da localStorage se disponibile
try {
  const savedDatabase = localStorage.getItem('bilanciamo_food_database');
  if (savedDatabase) {
    const parsedDatabase = JSON.parse(savedDatabase);
    if (Array.isArray(parsedDatabase) && parsedDatabase.length > 0) {
      foodDatabase = parsedDatabase;
    }
  }
} catch (error) {
  console.error('Errore nel caricamento del database alimentare:', error);
}

export const FoodAutocomplete: React.FC<FoodAutocompleteProps> = ({ value, onChange, grams }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Inizializza lo stato selezionato se il valore è già impostato
  useEffect(() => {
    if (value && !selectedFood) {
      const food = foodDatabase.find(item => item.name === value);
      if (food) {
        setSelectedFood(food);
      }
    }
  }, [value, selectedFood]);

  // Gestisce il click fuori dal componente per chiudere i suggerimenti
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtra i suggerimenti in base al termine di ricerca
  const filterSuggestions = (term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 10); // Limita a 10 suggerimenti

    setSuggestions(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSuggestions(true);
    filterSuggestions(term);

    // Se l'input viene cancellato, resetta il cibo selezionato
    if (!term) {
      setSelectedFood(null);
      onChange('', { calories: 0, proteins: 0, carbs: 0, fats: 0, category: '' });
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSearchTerm(food.name);
    setSelectedFood(food);
    setShowSuggestions(false);

    // Calcola i valori nutrizionali in base ai grammi
    const calculatedValues = {
      calories: (food.calories / 100) * (grams || 0),
      proteins: (food.proteins / 100) * (grams || 0),
      carbs: (food.carbs / 100) * (grams || 0),
      fats: (food.fats / 100) * (grams || 0),
      category: food.category
    };

    onChange(food.name, calculatedValues);
  };

  return (
    <div className="relative" ref={autocompleteRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm) {
              setShowSuggestions(true);
              filterSuggestions(searchTerm);
            }
          }}
          className="w-full px-3 py-2 pl-10 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          placeholder="Cerca alimento..."
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sage-400" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-sage-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((food) => (
            <div
              key={food.name}
              className="px-4 py-2 cursor-pointer hover:bg-sage-50 text-sm"
              onClick={() => handleSelectFood(food)}
            >
              <div className="font-medium">{food.name}</div>
              <div className="text-xs text-sage-600">
                {food.calories} kcal | {food.proteins}g proteine | {food.carbs}g carb | {food.fats}g grassi
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};