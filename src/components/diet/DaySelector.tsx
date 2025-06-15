import React from 'react';

interface DaySelectorProps {
  days: string[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDay, onDaySelect }) => {
  return (
    <div className="grid grid-cols-7 gap-2 sm:flex sm:flex-wrap">
      {days.map((day, index) => (
        <button
          key={index}
          onClick={() => onDaySelect(index)}
          className={`px-3 py-3 sm:px-4 sm:py-2 rounded-xl font-medium transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[40px] flex items-center justify-center text-sm sm:text-base ${
            selectedDay === index
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg transform scale-105'
              : 'bg-sage-100 dark:bg-gray-700 text-sage-700 dark:text-gray-300 hover:bg-sage-200 dark:hover:bg-gray-600 hover:shadow-md'
          }`}
        >
          <span className="sm:hidden">{day.substring(0, 3)}</span>
          <span className="hidden sm:inline">{day.substring(0, 3)}</span>
        </button>
      ))}
    </div>
  );
};