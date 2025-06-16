import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Target } from 'lucide-react';

interface CalculationData {
  age: number;
  height: number;
  weight: number;
  gender: 'female' | 'male';
  laf: number;
  y: number;
  dailyDeficit: number;
}

interface Results {
  bmi: number;
  idealWeight: number;
  basalMetabolism: number;
  dailyMetabolism: number;
  weeklyMetabolism: number;
  dailyDeficit: number;
  weeklyDeficit: number;
  weeklyCalories: number;
  dailyProteinRda: number;
  weeklyProteinRda: number;
}

interface DailyCalorieLimit {
  [day: string]: number;
}

const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const Calculations: React.FC = () => {
  console.log('Calculations.tsx: component rendered');
  const [data, setData] = useState<CalculationData>({
    age: 0,
    height: 0,
    weight: 0,
    gender: 'female',
    laf: 1.4,
    y: 0.8,
    dailyDeficit: 275
  });

  const [results, setResults] = useState<Results | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const [dailyCalorieLimits, setDailyCalorieLimits] = useState<DailyCalorieLimit>({});

  useEffect(() => {
    console.log('Calculations.tsx: useEffect - loading data from localStorage');
    const saved = localStorage.getItem('bilanciamo_calculations');
    if (saved) {
      console.log('Calculations.tsx: useEffect - found saved calculations', saved);
      const savedData = JSON.parse(saved);
      setData(savedData.data);
      setResults(savedData.results);
      console.log('Calculations.tsx: useEffect - setData and setResults called with', savedData.data, savedData.results);
      setIsCalculated(true);
    }
    
    // Carica i limiti di calorie giornalieri
    const savedLimits = localStorage.getItem('bilanciamo_daily_limits');
    if (savedLimits) {
      console.log('Calculations.tsx: useEffect - found saved daily limits', savedLimits);
      try {
        const parsedLimits = JSON.parse(savedLimits);
        setDailyCalorieLimits(parsedLimits);
        console.log('Calculations.tsx: useEffect - setDailyCalorieLimits called with', parsedLimits);
      } catch (error) {
        console.error('Errore nel caricamento dei limiti giornalieri:', error);
        setDailyCalorieLimits({});
      }
    }
  }, []);

  const calculateResults = (): Results => {
    const heightM = data.height / 100;
    const bmi = data.weight / (heightM * heightM);
    const idealWeight = 21.5 * (heightM * heightM);
    
    const basalMetabolism = data.gender === 'female'
      ? 655 + (9.5 * idealWeight) + (1.8 * data.height) - (4.6 * data.age)
      : 66.5 + (13.75 * idealWeight) + (5 * data.height) - (6.75 * data.age);
    
    const dailyMetabolism = basalMetabolism * data.laf;
    const weeklyMetabolism = dailyMetabolism * 7;
    
    // Usa il valore del deficit giornaliero dal state invece di un valore fisso
    const dailyDeficit = data.dailyDeficit || 0;
    const weeklyDeficit = dailyDeficit * 7;
    const weeklyCalories = weeklyMetabolism - weeklyDeficit;
    
    const dailyProteinRda = idealWeight * data.y;
    const weeklyProteinRda = dailyProteinRda * 7;

    return {
      bmi,
      idealWeight,
      basalMetabolism,
      dailyMetabolism,
      weeklyMetabolism,
      dailyDeficit,
      weeklyDeficit,
      weeklyCalories,
      dailyProteinRda,
      weeklyProteinRda
    };
  };

  const handleCalculate = () => {
    console.log('Calculations.tsx: handleCalculate called');
    const newResults = calculateResults();
    setResults(newResults);
    setIsCalculated(true);
    
    localStorage.setItem('bilanciamo_calculations', JSON.stringify({
      data,
      results: newResults
    }));
  };

  const handleReset = () => {
    console.log('Calculations.tsx: handleReset called');
    setData({
      age: 0,
      height: 0,
      weight: 0,
      gender: 'female',
      laf: 1.4,
      y: 0.8,
      dailyDeficit: 275
    });
    setResults(null);
    setIsCalculated(false);
    localStorage.removeItem('bilanciamo_calculations');
  };

  const handleDailyLimitChange = (day: string, value: string) => {
    const newLimits = { ...dailyCalorieLimits };
    newLimits[day] = parseInt(value) || 0;
    setDailyCalorieLimits(newLimits);
    
    localStorage.setItem('bilanciamo_daily_limits', JSON.stringify(newLimits));
  };

  const getTotalWeeklyLimit = (): number => {
    return Object.values(dailyCalorieLimits).reduce((sum, val) => sum + (val || 0), 0);
  };



  const isFormValid = data.age > 0 && data.height > 0 && data.weight > 0;

  const getBmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return "Sottopeso";
    if (bmi < 25) return "Normopeso";
    if (bmi < 30) return "Sovrappeso";
    if (bmi < 35) return "Obesità di classe I";
    if (bmi < 40) return "Obesità di classe II";
    return "Obesità di classe III";
  };

  console.log('Calculations.tsx: rendering, data:', data, 'results:', results, 'isCalculated:', isCalculated);
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Input Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-lg">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-sage-900">Dati Personali</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-sage-700 mb-2">Età</label>
            <input
              type="number"
              id="age"
              value={data.age || ''}
              onChange={(e) => setData({...data, age: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="Anni"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-sage-700 mb-2">Altezza</label>
            <input
              type="number"
              id="height"
              value={data.height || ''}
              onChange={(e) => setData({...data, height: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="cm"
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-sage-700 mb-2">Peso</label>
            <input
              type="number"
              id="weight"
              value={data.weight || ''}
              onChange={(e) => setData({...data, weight: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="kg"
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-sage-700 mb-2">Genere</label>
            <select
              id="gender"
              value={data.gender}
              onChange={(e) => setData({...data, gender: e.target.value as 'female' | 'male'})}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
            >
              <option value="female">Donna</option>
              <option value="male">Uomo</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="laf" className="block text-sm font-medium text-sage-700 mb-2">LAF</label>
            <input
              type="number"
              id="laf"
              value={data.laf || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                // Limita il valore tra 1.45 e 2.1
                const validValue = Math.min(Math.max(value, 1.45), 2.1);
                // Arrotonda a incrementi di 0.05
                const roundedValue = Math.round(validValue * 20) / 20;
                setData({...data, laf: roundedValue});
              }}
              step="0.05"
              min="1.45"
              max="2.1"
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="LAF"
            />
          </div>
          
          <div>
            <label htmlFor="y" className="block text-sm font-medium text-sage-700 mb-2">Grammi proteici per kg</label>
            <input
              type="number"
              id="y"
              value={data.y || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                // Limita il valore tra 0.8 e 3
                const validValue = Math.min(Math.max(value, 0.8), 3);
                setData({...data, y: validValue});
              }}
              step="0.1"
              min="0.8"
              max="3"
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="Grammi proteici per kg"
            />
          </div>
          
          <div>
            <label htmlFor="dailyDeficit" className="block text-sm font-medium text-sage-700 mb-2">Deficit Giornaliero</label>
            <input
              type="number"
              id="dailyDeficit"
              value={data.dailyDeficit || ''}
              onChange={(e) => setData({...data, dailyDeficit: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/60 shadow-sm focus:shadow-md text-sm sm:text-base"
              placeholder="kcal"
            />
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleCalculate}
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base ${
              isFormValid 
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Calcola</span>
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white text-sage-700 rounded-xl border border-sage-200 hover:bg-sage-50 hover:shadow-md flex items-center justify-center space-x-2 font-medium transition-all duration-200 text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      {isCalculated && results && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-sage-900">Risultati</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-100">
              <p className="text-sm text-sage-600 mb-1">BMI (Indice di Massa Corporea)</p>
              <p className="text-xl sm:text-2xl font-bold text-sage-900">{results.bmi.toFixed(1)}</p>
              <p className="text-xs text-sage-500 mt-1">{getBmiCategory(results.bmi)}</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 p-4 rounded-xl border border-accent-100">
              <p className="text-sm text-sage-600 mb-1">Peso Ideale</p>
              <p className="text-xl sm:text-2xl font-bold text-sage-900">{results.idealWeight.toFixed(1)} kg</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-100">
              <p className="text-sm text-sage-600 mb-1">Metabolismo Basale</p>
              <p className="text-xl sm:text-2xl font-bold text-sage-900">{Math.round(results.basalMetabolism)} kcal</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 p-4 rounded-xl border border-accent-100">
              <p className="text-sm text-sage-600 mb-1">Metabolismo Giornaliero</p>
              <p className="text-xl sm:text-2xl font-bold text-sage-900">{Math.round(results.dailyMetabolism)} kcal</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-100">
              <p className="text-sm text-sage-600 mb-1">Deficit Giornaliero</p>
              <p className="text-xl sm:text-2xl font-bold text-sage-900">{Math.round(results.dailyDeficit)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-sage-600">Deficit Settimanale</p>
              <p className="text-lg font-bold text-sage-900">{Math.round(results.weeklyDeficit)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-sage-600">Calorie Settimanali</p>
              <p className="text-lg font-bold text-sage-900">{Math.round(results.weeklyCalories)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-sage-600">RDA Proteine Giornaliero</p>
              <p className="text-lg font-bold text-sage-900">{results.dailyProteinRda.toFixed(1)} g</p>
            </div>
            <div>
              <p className="text-sm text-sage-600">RDA Proteine Settimanale</p>
              <p className="text-lg font-bold text-sage-900">{results.weeklyProteinRda.toFixed(1)} g</p>
            </div>
          </div>
          
          {/* Tabella limiti calorie giornalieri */}
          <div className="mt-6 bg-white/90 rounded-xl p-6 border border-sage-200 shadow-sm">
            <h3 className="text-lg font-semibold text-sage-800 mb-4 flex items-center">
              <Target className="w-5 h-5 text-primary-600 mr-2" />
              Limiti Calorie Giornalieri
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-100 to-accent-100">
                    <th className="px-4 py-3 text-left text-sage-700 font-semibold">Giorno</th>
                    <th className="px-4 py-3 text-left text-sage-700 font-semibold">Kcal Limite</th>
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, index) => (
                    <tr key={day} className={`hover:bg-sage-50 ${index % 2 === 0 ? 'bg-white' : 'bg-sage-50/50'}`}>
                      <td className="px-4 py-3 border-t border-sage-200">{day}</td>
                      <td className="px-4 py-3 border-t border-sage-200">
                        <input
                          type="number"
                          value={dailyCalorieLimits[day] || ''}
                          onChange={(e) => handleDailyLimitChange(day, e.target.value)}
                          className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="Kcal"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary-100 font-medium">
                    <td className="px-4 py-3 border-t border-sage-200">Totale Settimanale</td>
                    <td className="px-4 py-3 border-t border-sage-200 font-bold">{getTotalWeeklyLimit()} kcal</td>
                  </tr>
                  <tr className="bg-accent-100">
                    <td className="px-4 py-3 border-t border-sage-200">Calorie Settimanali Calcolate</td>
                    <td className="px-4 py-3 border-t border-sage-200 font-bold">{Math.round(results.weeklyCalories)} kcal</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-primary-50 to-accent-50 font-medium">
                    <td className="px-4 py-3 border-t border-sage-200">Differenza</td>
                    <td className="px-4 py-3 border-t border-sage-200 font-bold">
                      {getTotalWeeklyLimit() - Math.round(results.weeklyCalories)} kcal
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};