
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ActivityType } from "../types";
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from "../constants";

interface ActivityBarChartProps {
  data: any[];
  customLabels?: Record<ActivityType, string>;
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ data, customLabels }) => {

  if (!data || data.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p>Nessun dato da visualizzare. Inizia a registrare le tue attività!</p>
        </div>
    )
  }

  const getLabel = (type: ActivityType) => {
      return customLabels?.[type] || ACTIVITY_LABELS[type];
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} strokeOpacity={0.5} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} strokeOpacity={0.5} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.9))',
            borderColor: 'var(--tooltip-border, #e2e8f0)',
            borderRadius: '0.5rem',
            color: 'var(--tooltip-text, #1e293b)'
          }}
          itemStyle={{
             color: 'inherit'
          }}
        />
        <Legend formatter={(value) => <span className="text-slate-600 dark:text-slate-300">{getLabel(value as ActivityType)}</span>} iconSize={10} />
        {/* FIX: Explicitly type `activity` as `ActivityType` to fix indexing errors. */}
        {Object.values(ActivityType).map((activity: ActivityType) => (
            <Bar 
                key={activity} 
                dataKey={activity} 
                stackId="a" 
                fill={ACTIVITY_COLORS[activity]} 
                name={getLabel(activity)}
            />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityBarChart;
