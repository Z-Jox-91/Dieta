import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  Chart,
  TooltipItem
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';

// Registra i componenti Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface ChartContainerProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg
        border border-gray-200 dark:border-gray-700
        p-6 ${className}
      `}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <div className="text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="h-80">
        {children}
      </div>
    </motion.div>
  );
};

// Grafico andamento peso
interface WeightProgressProps {
  data: { date: string; weight: number }[];
}

export const WeightProgressChart: React.FC<WeightProgressProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('it-IT', { 
      month: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Peso (kg)',
        data: data.map(d => d.weight),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <ChartContainer title="Andamento Peso" icon={<TrendingUp className="w-5 h-5" />}>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

// Grafico calorie giornaliere
interface CaloriesChartProps {
  data: { date: string; consumed: number; target: number }[];
}

export const CaloriesChart: React.FC<CaloriesChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('it-IT', { 
      weekday: 'short',
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Calorie Consumate',
        data: data.map(d => d.consumed),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      },
      {
        label: 'Obiettivo',
        data: data.map(d => d.target),
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: 'rgb(107, 114, 128)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <ChartContainer title="Calorie Giornaliere" icon={<Calendar className="w-5 h-5" />}>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

// Grafico distribuzione macronutrienti
interface MacronutrientsProps {
  carbs: number;
  proteins: number;
  fats: number;
}

export const MacronutrientsChart: React.FC<MacronutrientsProps> = ({ 
  carbs, 
  proteins, 
  fats 
}) => {
  const total = carbs + proteins + fats;
  
  const chartData = {
    labels: ['Carboidrati', 'Proteine', 'Grassi'],
    datasets: [
      {
        data: [carbs, proteins, fats],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: 'rgb(107, 114, 128)',
          generateLabels: (chart: Chart) => {
            const data = chart.data;
            return data.labels.map((label: string, i: number) => {
              const value = data.datasets[0].data[i];
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}: ${value}g (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                pointStyle: 'circle'
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value}g (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <ChartContainer title="Distribuzione Macronutrienti" icon={<Target className="w-5 h-5" />}>
      <div className="relative">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {total}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Totale
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

// Grafico radar per obiettivi nutrizionali
interface NutritionRadarProps {
  data: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    water: number;
  };
  targets: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    water: number;
  };
}

export const NutritionRadarChart: React.FC<NutritionRadarProps> = ({ 
  data, 
  targets 
}) => {
  const chartData = {
    labels: ['Calorie', 'Proteine', 'Carboidrati', 'Grassi', 'Fibre', 'Acqua'],
    datasets: [
      {
        label: 'Attuale',
        data: [
          (data.calories / targets.calories) * 100,
          (data.proteins / targets.proteins) * 100,
          (data.carbs / targets.carbs) * 100,
          (data.fats / targets.fats) * 100,
          (data.fiber / targets.fiber) * 100,
          (data.water / targets.water) * 100
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'white',
        pointBorderWidth: 2
      },
      {
        label: 'Obiettivo',
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: 'rgb(107, 114, 128)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<'radar'>) => {
            const percentage = context.parsed.r.toFixed(1);
            return `${context.dataset.label}: ${percentage}%`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 120,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        angleLines: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        pointLabels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12
          }
        },
        ticks: {
          display: false
        }
      }
    }
  };

  return (
    <ChartContainer title="Obiettivi Nutrizionali" icon={<Activity className="w-5 h-5" />}>
      <Radar data={chartData} options={options} />
    </ChartContainer>
  );
};