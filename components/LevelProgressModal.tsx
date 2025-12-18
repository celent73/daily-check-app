
import React from 'react';
import { ActivityLog, UnlockedAchievements } from '../types';

interface LevelProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: ActivityLog[];
    unlockedAchievements: UnlockedAchievements;
}

const LevelProgressModal: React.FC<LevelProgressModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl text-center">
                <h2 className="text-lg font-bold dark:text-white">Livello e Trofei</h2>
                <p className="dark:text-gray-300">Statistiche in arrivo...</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Chiudi</button>
            </div>
        </div>
    );
};

export default LevelProgressModal;
