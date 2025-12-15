
import React from 'react';
import { ActivityLog } from '../types';
import { calculateCareerStatus } from '../utils/careerUtils';

interface CareerStatusProps {
  activityLogs: ActivityLog[];
}

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 3a1 1 0 10-2 0v1.586l-1.293-1.293a1 1 0 00-1.414 1.414L7.586 6H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1.586l1.293-1.293a1 1 0 00-1.414-1.414L11 4.586V3zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
  </svg>
);


const CareerStatus: React.FC<CareerStatusProps> = ({ activityLogs }) => {
  const status = calculateCareerStatus(activityLogs);

  const progressBarClass = status.specialStatus === 'family_pro'
    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
    : 'bg-gradient-to-r from-amber-400 to-amber-600';

  return (
    <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-lg transition-colors duration-300 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center mb-4">
        <TrophyIcon />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Status Carriera</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Livello Attuale</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${status.specialStatus === 'family_pro'
              ? 'from-pink-600 to-rose-800 dark:from-pink-400 dark:to-rose-600'
              : 'from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400'
            } text-transparent bg-clip-text`}>{status.currentLevel.name}</p>
          {status.currentLevel.name === 'Family Utility' && status.totalContracts < 10 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Mancano {10 - status.totalContracts} contratti per Family Pro
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {status.isMaxLevel ? 'Hai raggiunto il livello massimo!' : 'Progresso al prossimo livello'}
            </span>
            {!status.isMaxLevel && status.nextLevel && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {status.totalClients} / {status.clientsForNextLevel} acquisizioni
              </span>
            )}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className={`${progressBarClass} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${status.progressPercentage}%` }}
            ></div>
          </div>
          {!status.isMaxLevel && status.nextLevel && (
            <p className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1">
              Prossimo livello: {
                status.currentLevel.name === 'Family Pro'
                  ? 'Family 3S'
                  : (status.nextLevel.name === 'Consulente Junior' ? 'Family Pro' : status.nextLevel.name)
              }
            </p>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
          <p className="text-center text-slate-700 dark:text-slate-300">
            Hai registrato un totale di <strong className="text-slate-900 dark:text-white">{status.totalClients}</strong> acquisizioni.
            {status.isMaxLevel ? ' Ottimo lavoro!' : ' Continua così!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerStatus;
