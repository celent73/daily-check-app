import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
// Nota i due punti ../.. perché siamo dentro la cartella 'charts'
import { ActivityType } from '../../types';
import { ACTIVITY_LABELS } from '../../constants';

interface ActivityBarChartProps {
  data: any[];
  customLabels?: Record<ActivityType, string>;
}

// Colori corrispondenti alla Dashboard per coerenza
const CHART_COLORS: Record<ActivityType, string> = {
  [ActivityType.CONTACTS]: '#3b82f6',       // Blue-500
  [ActivityType.VIDEOS_SENT]: '#8b5cf6',    // Violet-500
  [ActivityType.APPOINTMENTS]: '#10b981',   // Emerald-500
  [ActivityType.NEW_CONTRACTS]: '#f97316',  // Orange-500
  [ActivityType.NEW_FAMILY_UTILITY]: '#06b6d4', // Cyan-500
};

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ data, customLabels }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Nessun dato disponibile per il grafico
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />

        {/* Genera le barre dinamicamente per ogni tipo di attività */}
        {Object.values(ActivityType).map((activity) => (
          <Bar
            key={activity}
            dataKey={activity}
            name={customLabels?.[activity] || ACTIVITY_LABELS[activity]}
            fill={CHART_COLORS[activity]}
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityBarChart;