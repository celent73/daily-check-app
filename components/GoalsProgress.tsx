
import React from 'react';
import { ActivityLog, Goals } from '../types';

interface GoalsProgressProps {
    logs: ActivityLog[];
    goals: Goals;
    customLabels: Record<string, string>;
    commercialMonthStartDay: number;
}

const GoalsProgress: React.FC<GoalsProgressProps> = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold dark:text-white mb-4">Progressi Obiettivi</h2>
            <p className="text-gray-500 dark:text-gray-400 italic">Visualizzazione obiettivi in arrivo...</p>
        </div>
    );
};

export default GoalsProgress;
