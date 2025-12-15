
import React from 'react';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeleteMonth: () => void;
  onConfirmDeleteAll: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const DeleteDataModal: React.FC<DeleteDataModalProps> = ({ isOpen, onClose, onConfirmDeleteMonth, onConfirmDeleteAll }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-slate-700 animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-rose-500"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="p-8 text-center relative z-10">
            <div className="mx-auto w-20 h-20 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-rose-50 dark:ring-slate-800 animate-pulse-slow">
                <TrashIcon />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                Zona Pericolo
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Stai per eliminare dei dati. Scegli con attenzione, questa azione è <span className="font-bold text-rose-500">irreversibile</span>.
            </p>

            <div className="space-y-4">
                {/* Option 1: Current Month */}
                <button
                    onClick={onConfirmDeleteMonth}
                    className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <CalendarIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                Cancella Mese Corrente
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Mantiene storico passato e profilo.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Option 2: Delete All */}
                <button
                    onClick={onConfirmDeleteAll}
                    className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-rose-50 dark:bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <WarningIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                                Cancella Tutto lo Storico
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Reset completo dell'applicazione.
                            </p>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Annulla Operazione
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDataModal;
