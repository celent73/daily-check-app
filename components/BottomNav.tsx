
import React from 'react';

interface BottomNavProps {
    activeTab: 'dashboard' | 'history' | 'goals';
    onTabChange: (tab: 'dashboard' | 'history' | 'goals') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <button
                    onClick={() => onTabChange('dashboard')}
                    className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <span className="text-xs font-bold">Home</span>
                </button>
                <button
                    onClick={() => onTabChange('history')}
                    className={`flex flex-col items-center p-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <span className="text-xs font-bold">Storico</span>
                </button>
                <button
                    onClick={() => onTabChange('goals')}
                    className={`flex flex-col items-center p-2 ${activeTab === 'goals' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <span className="text-xs font-bold">Obiettivi</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;
