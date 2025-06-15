import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'nutrition' | 'consistency' | 'goals' | 'social';
}

export interface UserStats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  calorieGoalsHit: number;
  proteinGoalsHit: number;
  waterGoalsHit: number;
  exerciseDays: number;
  achievements: Achievement[];
  lastLoginDate: string;
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-login',
    title: 'Primo Accesso',
    description: 'Benvenuto in Diet Bilanciamo!',
    icon: '🎉',
    points: 10,
    unlocked: false,
    category: 'social'
  },
  {
    id: 'first-calculation',
    title: 'Primo Calcolo',
    description: 'Hai completato il tuo primo calcolo nutrizionale',
    icon: '🧮',
    points: 25,
    unlocked: false,
    category: 'nutrition'
  },
  {
    id: 'streak-3',
    title: 'Costanza Iniziale',
    description: 'Registra i tuoi pasti per 3 giorni consecutivi',
    icon: '🔥',
    points: 50,
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'streak-7',
    title: 'Una Settimana',
    description: 'Registra i tuoi pasti per 7 giorni consecutivi',
    icon: '⭐',
    points: 100,
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'streak-30',
    title: 'Un Mese Perfetto',
    description: 'Registra i tuoi pasti per 30 giorni consecutivi',
    icon: '🏆',
    points: 500,
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'calorie-goal-10',
    title: 'Obiettivo Calorico',
    description: 'Raggiungi il tuo obiettivo calorico per 10 giorni',
    icon: '🎯',
    points: 150,
    unlocked: false,
    category: 'goals'
  },
  {
    id: 'protein-master',
    title: 'Maestro delle Proteine',
    description: 'Raggiungi il tuo obiettivo proteico per 15 giorni',
    icon: '💪',
    points: 200,
    unlocked: false,
    category: 'goals'
  },
  {
    id: 'water-warrior',
    title: 'Guerriero dell\'Idratazione',
    description: 'Bevi abbastanza acqua per 20 giorni',
    icon: '💧',
    points: 175,
    unlocked: false,
    category: 'goals'
  },
  {
    id: 'food-explorer',
    title: 'Esploratore del Cibo',
    description: 'Aggiungi 50 alimenti diversi al database',
    icon: '🍎',
    points: 300,
    unlocked: false,
    category: 'nutrition'
  },
  {
    id: 'level-5',
    title: 'Livello 5',
    description: 'Raggiungi il livello 5',
    icon: '🌟',
    points: 0,
    unlocked: false,
    category: 'social'
  }
];

const defaultStats: UserStats = {
  totalPoints: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysLogged: 0,
  calorieGoalsHit: 0,
  proteinGoalsHit: 0,
  waterGoalsHit: 0,
  exerciseDays: 0,
  achievements: defaultAchievements,
  lastLoginDate: ''
};

export const useGamification = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('gamification-stats');
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  });

  useEffect(() => {
    localStorage.setItem('gamification-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    // Controlla il login giornaliero
    checkDailyLogin();
  }, []);

  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = stats.lastLoginDate;

    if (lastLogin !== today) {
      // Primo accesso di oggi
      updateStats({ lastLoginDate: today });
      
      // Controlla se è il primo accesso in assoluto
      if (!lastLogin) {
        unlockAchievement('first-login');
      }

      // Aggiorna streak
      updateStreak(lastLogin);
    }
  };

  const updateStreak = (lastLogin: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLogin === yesterday.toDateString()) {
      // Continua lo streak
      const newStreak = stats.currentStreak + 1;
      updateStats({
        currentStreak: newStreak,
        longestStreak: Math.max(stats.longestStreak, newStreak)
      });
      
      // Controlla achievement streak
      checkStreakAchievements(newStreak);
    } else if (lastLogin !== today.toDateString()) {
      // Streak interrotto
      updateStats({ currentStreak: 1 });
    }
  };

  const checkStreakAchievements = (streak: number) => {
    if (streak === 3) unlockAchievement('streak-3');
    if (streak === 7) unlockAchievement('streak-7');
    if (streak === 30) unlockAchievement('streak-30');
  };

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...updates };
      
      // Calcola il nuovo livello
      const newLevel = calculateLevel(newStats.totalPoints);
      if (newLevel > prev.level) {
        newStats.level = newLevel;
        toast.success(`🎉 Livello ${newLevel} raggiunto!`);
        
        if (newLevel === 5) {
          unlockAchievement('level-5');
        }
      }
      
      return newStats;
    });
  };

  const calculateLevel = (points: number): number => {
    // Formula: livello = floor(sqrt(points / 100)) + 1
    return Math.floor(Math.sqrt(points / 100)) + 1;
  };

  const getPointsForNextLevel = (): number => {
    const nextLevel = stats.level + 1;
    const pointsNeeded = Math.pow(nextLevel - 1, 2) * 100;
    return pointsNeeded - stats.totalPoints;
  };

  const addPoints = (points: number, reason: string) => {
    updateStats({ totalPoints: stats.totalPoints + points });
    toast.success(`+${points} punti: ${reason}`);
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = stats.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    const updatedAchievements = stats.achievements.map(a => 
      a.id === achievementId 
        ? { ...a, unlocked: true, unlockedAt: new Date() }
        : a
    );

    updateStats({
      achievements: updatedAchievements,
      totalPoints: stats.totalPoints + achievement.points
    });

    toast.success(
      `🏆 Achievement sbloccato: ${achievement.title}!`,
      { duration: 4000 }
    );
  };

  const logMeal = () => {
    addPoints(5, 'Pasto registrato');
    updateStats({ totalDaysLogged: stats.totalDaysLogged + 1 });
  };

  const completeCalculation = () => {
    addPoints(10, 'Calcolo completato');
    
    // Primo calcolo
    if (stats.achievements.find(a => a.id === 'first-calculation' && !a.unlocked)) {
      unlockAchievement('first-calculation');
    }
  };

  const hitCalorieGoal = () => {
    addPoints(15, 'Obiettivo calorico raggiunto');
    const newCount = stats.calorieGoalsHit + 1;
    updateStats({ calorieGoalsHit: newCount });
    
    if (newCount === 10) {
      unlockAchievement('calorie-goal-10');
    }
  };

  const hitProteinGoal = () => {
    addPoints(20, 'Obiettivo proteico raggiunto');
    const newCount = stats.proteinGoalsHit + 1;
    updateStats({ proteinGoalsHit: newCount });
    
    if (newCount === 15) {
      unlockAchievement('protein-master');
    }
  };

  const hitWaterGoal = () => {
    addPoints(10, 'Obiettivo idratazione raggiunto');
    const newCount = stats.waterGoalsHit + 1;
    updateStats({ waterGoalsHit: newCount });
    
    if (newCount === 20) {
      unlockAchievement('water-warrior');
    }
  };

  const addFood = () => {
    addPoints(3, 'Nuovo alimento aggiunto');
    
    // Conta gli alimenti aggiunti (approssimativo)
    const foodsAdded = Math.floor(stats.totalPoints / 3);
    if (foodsAdded >= 50) {
      unlockAchievement('food-explorer');
    }
  };

  const getUnlockedAchievements = () => {
    return stats.achievements.filter(a => a.unlocked);
  };

  const getLockedAchievements = () => {
    return stats.achievements.filter(a => !a.unlocked);
  };

  const resetStats = () => {
    setStats(defaultStats);
    toast.success('Statistiche resettate');
  };

  return {
    stats,
    addPoints,
    unlockAchievement,
    logMeal,
    completeCalculation,
    hitCalorieGoal,
    hitProteinGoal,
    hitWaterGoal,
    addFood,
    getUnlockedAchievements,
    getLockedAchievements,
    getPointsForNextLevel,
    resetStats,
    checkDailyLogin
  };
};