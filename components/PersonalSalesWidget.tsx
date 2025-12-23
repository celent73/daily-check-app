import React from 'react';
import { VisionBoardData } from '../types';

interface PersonalSalesWidgetProps {
    dailyEarnings: number;
    monthlyEarnings: number;
    visionBoardData?: VisionBoardData;
    onOpenSettings?: () => void;
}

const PersonalSalesWidget: React.FC<PersonalSalesWidgetProps> = ({
    dailyEarnings,
    monthlyEarnings,
    visionBoardData,
    onOpenSettings
}) => {
    // Determine progress if vision board is active
    const target = visionBoardData?.enabled ? visionBoardData.targetAmount : 0;
    const progress = target > 0 ? Math.min(100, (monthlyEarnings / target) * 100) : 0;
    const remaining = Math.max(0, target - monthlyEarnings);

    // Default image if not provided
    const bgImage = visionBoardData?.imageData || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000';

    return (
        <div className="relative overflow-hidden rounded-3xl mb-6 shadow-xl group border-2 border-white/20 dark:border-slate-700">
            {/* Background Image / Gradient */}
            {visionBoardData?.enabled && visionBoardData.imageData ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${visionBoardData.imageData})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 group-hover:scale-110 transition-transform duration-700" />
            )}

            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500"></div>

            <div className="relative p-6 text-white z-10">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">
                            GUADAGNI DA VENDITE PERSONALI
                        </h3>
                        {visionBoardData?.enabled && (
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-200 transition-colors" onClick={onOpenSettings}>
                                <span className="text-xs font-bold text-white/90 truncate max-w-[200px]">
                                    {visionBoardData.title || "Il mio obiettivo"}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-blue-200 uppercase">Oggi</span>
                            <span className="text-lg font-black tracking-tight leading-none text-emerald-300">
                                +€{dailyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Earnings & Progress */}
                <div className="flex items-end justify-between mt-2">
                    <div>
                        <p className="text-[10px] text-blue-100 font-medium mb-0.5">Totale Mese</p>
                        <div className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-md">
                            €{monthlyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Circular Progress or Simple Bar if Target Set */}
                    {visionBoardData?.enabled && target > 0 && (
                        <div className="text-right">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-white/80">
                                    {progress.toFixed(0)}%
                                </span>
                                <span className="text-[10px] text-blue-200">
                                    Mancano €{remaining.toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar Line */}
                {visionBoardData?.enabled && target > 0 && (
                    <div className="w-full bg-black/30 h-2 rounded-full mt-5 overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                        </div>
                    </div>
                )}

                {(!visionBoardData?.enabled) && (
                    <button
                        onClick={onOpenSettings}
                        className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-all"
                    >
                        Imposta Obiettivo 🎯
                    </button>
                )}

            </div>
        </div>
    );
};

export default PersonalSalesWidget;
