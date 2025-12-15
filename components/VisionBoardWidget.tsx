
import React from 'react';

interface VisionBoardWidgetProps {
  currentEarnings: number;
  targetAmount: number;
  imageData: string | null;
  title: string;
  enabled: boolean;
  onOpenSettings?: () => void;
}

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const VisionBoardWidget: React.FC<VisionBoardWidgetProps> = ({ 
    currentEarnings, 
    targetAmount, 
    imageData, 
    title,
    enabled,
    onOpenSettings
}) => {
  if (!enabled) return null;

  // Calculate percentage, capped at 100
  const percentage = targetAmount > 0 ? Math.min(100, Math.max(0, (currentEarnings / targetAmount) * 100)) : 0;
  
  // Calculate filters
  // Grayscale: 100% at 0 progress, 0% at 100 progress
  const grayscaleVal = 100 - percentage;
  // Blur: 10px at 0 progress, 0px at 100 progress
  const blurVal = 8 * ((100 - percentage) / 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-lg border border-slate-100 dark:border-slate-700 mb-6 relative overflow-hidden group">
        
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                <span>🎯</span> {title || "Il Mio Obiettivo"}
            </h3>
        </div>

        {/* Progress Badge */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
             <span className="text-xs font-bold text-slate-800 dark:text-white">
                {percentage.toFixed(1)}%
             </span>
        </div>
        
        {/* Edit Button - Visible on Hover */}
        {onOpenSettings && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={(e) => { e.stopPropagation(); onOpenSettings(); }}
                    className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                    <PencilIcon /> Modifica
                </button>
            </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer" onClick={onOpenSettings}>
            {imageData ? (
                <>
                    <img 
                        src={imageData} 
                        alt={title}
                        className="w-full h-full object-cover transition-all duration-1000 ease-out will-change-[filter]"
                        style={{ 
                            filter: `grayscale(${grayscaleVal}%) blur(${blurVal}px)`,
                            transform: percentage >= 100 ? 'scale(1.05)' : 'scale(1)'
                        }}
                    />
                    {/* Shiny overlay when completed */}
                    {percentage >= 100 && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-transparent animate-pulse pointer-events-none mix-blend-overlay"></div>
                    )}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-center font-medium">Clicca per impostare la tua Vision Board</p>
                </div>
            )}
            
            {/* Progress Bar Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 backdrop-blur-sm">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>

        {/* Footer Info */}
        <div className="px-3 py-2 flex justify-between items-center text-xs">
             <span className="text-slate-500 dark:text-slate-400 font-medium">
                Accumulato: <span className="text-slate-800 dark:text-white font-bold">€{currentEarnings.toFixed(0)}</span>
             </span>
             <span className="text-slate-500 dark:text-slate-400 font-medium">
                Obiettivo: <span className="text-slate-800 dark:text-white font-bold">€{targetAmount.toLocaleString()}</span>
             </span>
        </div>
    </div>
  );
};

export default VisionBoardWidget;
