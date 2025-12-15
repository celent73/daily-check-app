import React from 'react';
import { UnlockedAchievements, Achievement } from '../types';
import { MASTER_ACHIEVEMENT_LIST } from '../utils/achievements';
import { formatItalianDate } from '../utils/dateUtils';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: UnlockedAchievements;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedAchievements }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span role="img" aria-label="trophy" className="text-2xl">🏆</span>
            Traguardi
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Chiudi">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASTER_ACHIEVEMENT_LIST.map((achievement) => {
              const unlockedData = unlockedAchievements[achievement.id];
              const isUnlocked = !!unlockedData;

              return (
                <div
                  key={achievement.id}
                  className={`p-5 rounded-xl border flex items-center gap-5 transition-all duration-300 ${
                    isUnlocked 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`flex-shrink-0 h-16 w-16 p-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isUnlocked
                    ? 'bg-amber-400 text-white'
                    : 'bg-slate-200 text-slate-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${
                        isUnlocked ? 'text-amber-900' : 'text-slate-700'
                    }`}>
                        {achievement.name}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                        isUnlocked ? 'text-amber-800' : 'text-slate-500'
                    }`}>
                        {achievement.description}
                    </p>
                    {isUnlocked && (
                         <p className="text-xs text-slate-500 mt-1 font-medium">
                            Sbloccato il: {formatItalianDate(new Date(unlockedData.unlockedAt))}
                        </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;