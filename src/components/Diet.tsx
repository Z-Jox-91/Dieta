import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { DaySelector } from './diet/DaySelector';
import { MealSection } from './diet/MealSection';
import { DayStats } from './diet/DayStats';

// Definizione delle interfacce per i dati
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

interface DayMeals {
  breakfast: MealItem[];
  morningSnack: MealItem[];
  lunch: MealItem[];
  afternoonSnack: MealItem[];
  dinner: MealItem[];
}

interface MealsDataStore {
  [key: string]: DayMeals;
}

const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const Diet: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [mealsData, setMealsData] = useState<MealsDataStore>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bilanciamo_meals');
      if (saved) {
        const parsedData = JSON.parse(saved);
        if (parsedData && typeof parsedData === 'object') {
          setMealsData(parsedData);
        } else {
          console.error('Formato dati non valido, inizializzazione con oggetto vuoto');
          setMealsData({});
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      // In caso di errore, inizializza con un oggetto vuoto
      setMealsData({});
    }
  }, []);

  const saveMealsData = (data: MealsDataStore) => {
    try {
      setMealsData(data);
      localStorage.setItem('bilanciamo_meals', JSON.stringify(data));
    } catch (error) {
      console.error('Errore nel salvataggio dei dati:', error);
    }
  };

  const getWeekKey = () => `week_${currentWeek}`;
  const getDayKey = () => `${getWeekKey()}_day_${selectedDay}`;

  const getCurrentDayData = (): DayMeals => {
    try {
      const dayKey = getDayKey();
      const dayData = mealsData[dayKey];
      
      // Se non ci sono dati per il giorno corrente o sono incompleti, crea un oggetto completo
      if (!dayData) {
        return {
          breakfast: [],
          morningSnack: [],
          lunch: [],
          afternoonSnack: [],
          dinner: []
        };
      }
      
      // Assicurati che tutte le proprietà esistano
      return {
        breakfast: Array.isArray(dayData.breakfast) ? dayData.breakfast : [],
        morningSnack: Array.isArray(dayData.morningSnack) ? dayData.morningSnack : [],
        lunch: Array.isArray(dayData.lunch) ? dayData.lunch : [],
        afternoonSnack: Array.isArray(dayData.afternoonSnack) ? dayData.afternoonSnack : [],
        dinner: Array.isArray(dayData.dinner) ? dayData.dinner : []
      };
    } catch (error) {
      console.error('Errore nel recupero dei dati del giorno:', error);
      // In caso di errore, ritorna un oggetto vuoto ma completo
      return {
        breakfast: [],
        morningSnack: [],
        lunch: [],
        afternoonSnack: [],
        dinner: []
      };
    }
  };

  const updateDayData = (newData: DayMeals) => {
    try {
      const updated = {
        ...mealsData,
        [getDayKey()]: newData
      };
      saveMealsData(updated);
    } catch (error) {
      console.error('Errore nell\'aggiornamento dei dati del giorno:', error);
    }
  };

  const getCurrentWeekDate = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
    return weekStart;
  };

  const formatWeekRange = () => {
    const weekStart = getCurrentWeekDate();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
  };

  return (
    <div className="space-y-8">
      {/* Week Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-sage-900">Piano Alimentare</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentWeek(prev => prev - 1)}
              className="p-2 text-sage-600 hover:text-sage-900 hover:bg-sage-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <p className="text-sm font-medium text-sage-900">
                Settimana {currentWeek === 0 ? 'corrente' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
              </p>
              <p className="text-xs text-sage-600">{formatWeekRange()}</p>
            </div>
            
            <button
              onClick={() => setCurrentWeek(prev => prev + 1)}
              className="p-2 text-sage-600 hover:text-sage-900 hover:bg-sage-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <DaySelector
          days={daysOfWeek}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
      </div>

      {/* Day Stats */}
      <DayStats dayData={getCurrentDayData()} selectedDay={selectedDay} />

      {/* Meals */}
      <div className="space-y-6">
        <MealSection
          title="Colazione"
          mealData={getCurrentDayData().breakfast}
          onUpdate={(data) => updateDayData({ ...getCurrentDayData(), breakfast: data })}
        />
        
        <MealSection
          title="Spuntino Mattina"
          mealData={getCurrentDayData().morningSnack}
          onUpdate={(data) => updateDayData({ ...getCurrentDayData(), morningSnack: data })}
        />
        
        <MealSection
          title="Pranzo"
          mealData={getCurrentDayData().lunch}
          onUpdate={(data) => updateDayData({ ...getCurrentDayData(), lunch: data })}
          showChart={true}
        />
        
        <MealSection
          title="Spuntino Pomeriggio"
          mealData={getCurrentDayData().afternoonSnack}
          onUpdate={(data) => updateDayData({ ...getCurrentDayData(), afternoonSnack: data })}
        />
        
        <MealSection
          title="Cena"
          mealData={getCurrentDayData().dinner}
          onUpdate={(data) => updateDayData({ ...getCurrentDayData(), dinner: data })}
          showChart={true}
        />
      </div>
    </div>
  );
};