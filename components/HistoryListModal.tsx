import React from 'react';
import { ActivityLog, ActivityType, Lead, ContractType } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface HistoryListModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityType: ActivityType | null;
    activityLog?: ActivityLog;
    customLabel: string;
}

const HistoryListModal: React.FC<HistoryListModalProps> = ({
    isOpen,
    onClose,
    activityType,
    activityLog,
    customLabel
}) => {
    if (!isOpen || !activityType) return null;

    // Filter leads for this activity type
    const details = activityLog?.leads?.filter(l => l.type === activityType) || [];

    // Also check for Contract Details breakdown if applicable
    const isContract = activityType === ActivityType.NEW_CONTRACTS;
    const contractBreakdown = activityLog?.contractDetails || {};

    const totalCount = activityLog?.counts[activityType] || 0;
    const detailedCount = details.length;

    // If we have counts but no details (anonymous entries), we calculate the difference
    const anonymousCount = Math.max(0, totalCount - detailedCount);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-3xl">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                            Storico: {customLabel}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {activityLog ? format(new Date(activityLog.date), 'dd MMMM yyyy', { locale: it }) : 'Nessuna data'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 space-y-3">

                    {/* Contracts Breakdown Badge */}
                    {isContract && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
                            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase mb-2">Riepilogo Contratti</h4>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{contractBreakdown.GREEN || 0}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Green</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-amber-500 dark:text-amber-400">{contractBreakdown.LIGHT || 0}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Light</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {details.length === 0 && anonymousCount === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <span className="block text-4xl mb-2">📭</span>
                            <p>Nessuna attività registrata.</p>
                        </div>
                    ) : (
                        <>
                            {/* Detailed Entries */}
                            {details.map((item, idx) => (
                                <div key={item.id || idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-xl shadow-sm flex items-start gap-3">
                                    <div className="mt-1 min-w-[32px] h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-slate-800 dark:text-slate-100">{item.name || 'Senza Nome'}</span>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                {item.date ? format(new Date(item.date), 'HH:mm') : ''}
                                            </span>
                                        </div>
                                        {item.phone && (
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <span>📞</span> {item.phone}
                                            </div>
                                        )}
                                        {item.note && (
                                            <div className="text-xs text-slate-500 italic mt-1 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                "{item.note}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Anonymous Entries */}
                            {anonymousCount > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-3 rounded-xl shadow-sm flex items-center gap-3 opacity-70">
                                    <div className="min-w-[32px] h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold text-xs">
                                        +
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-bold text-slate-600 dark:text-slate-400">
                                            {anonymousCount} {anonymousCount === 1 ? 'Attività' : 'Attività'} senza dettagli
                                        </span>
                                        <p className="text-[10px] text-slate-400">
                                            Registrate tramite contatore rapido
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-3xl">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-500">Totale Giornaliero</span>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                            {totalCount}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HistoryListModal;
