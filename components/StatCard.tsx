
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, colorClass }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl border border-white/20 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
      <div className={`mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 shadow-inner group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
        {icon}
      </div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{title}</h4>
      <p className="text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">{description}</p>
    </div>
  );
};

export default StatCard;
