import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Trophy, Zap, ChevronUp, X, Medal, Crown, Target } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';

interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
    unlocked: boolean;
    unlockedAt?: Date;
    category: 'nutrition' | 'consistency' | 'goals' | 'social';
  };
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  crown: Crown,
  target: Target,
  default: Award
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || iconMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        p-4 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md
        ${achievement.unlocked
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-700/50'
          : 'bg-gray-50/80 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            p-3 rounded-full transition-colors duration-200
            ${achievement.unlocked
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
          `}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{achievement.title}</h3>
            <span
              className={`
                text-xs font-bold px-3 py-1 rounded-full transition-colors duration-200
                ${achievement.unlocked
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
              `}
            >
              +{achievement.points} pts
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {achievement.description}
          </p>
          
          {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progresso</span>
                <span>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full ${achievement.unlocked ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface GamificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ isOpen, onClose }) => {
  const {
    stats,
    getUnlockedAchievements,
    getLockedAchievements,
    getPointsForNextLevel
  } = useGamification();

  const [activeTab, setActiveTab] = useState<'unlocked' | 'locked'>('unlocked');
  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const level = stats.level;
  const pointsForNextLevel = getPointsForNextLevel();
  const progressToNextLevel = Math.min(
    100,
    pointsForNextLevel > 0 ? ((stats.totalPoints % 100) / 100) * 100 : 100
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gamification-title"
            onKeyDown={handleKeyDown}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
              <h2 id="gamification-title" className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                I tuoi Progressi
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Chiudi pannello progressi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Livello {level}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stats.totalPoints} punti totali
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Prossimo livello
                    </span>
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <ChevronUp className="w-4 h-4" />
                      {level + 1}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Livello {level}</span>
                    <span>Livello {level + 1}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${progressToNextLevel}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.currentStreak}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giorni streak</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.totalDaysLogged}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Giorni registrati</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Achievement</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('unlocked')}
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === 'unlocked'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Sbloccati ({unlockedAchievements.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('locked')}
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === 'locked'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Da sbloccare ({lockedAchievements.length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {activeTab === 'unlocked' && unlockedAchievements.length === 0 && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <Trophy className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Nessun achievement sbloccato
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Continua a usare l'app per sbloccare achievement e guadagnare punti!
                    </p>
                  </div>
                )}

                {activeTab === 'unlocked' &&
                  unlockedAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}

                {activeTab === 'locked' &&
                  lockedAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Componente per mostrare il livello e i punti dell'utente
export const UserLevel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { stats } = useGamification();
  const [isOpen, setIsOpen] = useState(false);

  const level = stats.level;

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={openPanel}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gradient-to-r from-amber-50 to-orange-50
          dark:from-amber-900/20 dark:to-orange-900/20
          hover:from-amber-100 hover:to-orange-100
          dark:hover:from-amber-900/30 dark:hover:to-orange-900/30
          border border-amber-200 dark:border-amber-800/50
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Mostra progressi e achievement"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-900/50">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {level}
          </span>
        </div>
        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
          {stats.totalPoints} pts
        </span>
      </motion.button>

      <GamificationPanel isOpen={isOpen} onClose={closePanel} />
    </>
  );
};

// Componente per mostrare un achievement appena sbloccato
export const AchievementUnlocked: React.FC<{
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
  };
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'trophy':
        return <Trophy className="w-8 h-8" />;
      case 'star':
        return <Star className="w-8 h-8" />;
      case 'medal':
        return <Medal className="w-8 h-8" />;
      case 'crown':
        return <Crown className="w-8 h-8" />;
      case 'target':
        return <Target className="w-8 h-8" />;
      default:
        return <Award className="w-8 h-8" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-4 inset-x-0 mx-auto w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-800/50 z-50 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full text-amber-600 dark:text-amber-400">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Achievement Sbloccato!
                </h3>
                <p className="font-medium text-amber-600 dark:text-amber-400">
                  {achievement.title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Chiudi notifica"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {achievement.description}
            </p>
            <div className="mt-2 flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>+{achievement.points} punti</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-transparent"
          onAnimationComplete={onClose}
        />
      </div>
    </motion.div>
  );
};