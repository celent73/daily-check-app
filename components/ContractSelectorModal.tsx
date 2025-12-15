
import React from 'react';
import { CommissionStatus, ContractType } from '../types';

interface ContractSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContract: (type: ContractType) => void;
  userStatus: CommissionStatus;
}

const RATES = {
    [CommissionStatus.PRIVILEGIATO]: {
        [ContractType.GREEN]: 25,
        [ContractType.LIGHT]: 12.50
    },
    [CommissionStatus.FAMILY_UTILITY]: {
        [ContractType.GREEN]: 50,
        [ContractType.LIGHT]: 25
    }
};

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ContractSelectorModal: React.FC<ContractSelectorModalProps> = ({ isOpen, onClose, onSelectContract, userStatus }) => {
  if (!isOpen) return null;

  const rates = RATES[userStatus];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-slate-700 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="text-center mb-8 mt-2">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Nuovo Contratto! 🚀</h2>
                <p className="text-slate-500 dark:text-slate-400">Che tipo di contratto hai chiuso?</p>
                <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                    Status: {userStatus === CommissionStatus.FAMILY_UTILITY ? 'Family Utility' : 'Cliente Privilegiato'}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Green Card */}
                <button 
                    onClick={() => onSelectContract(ContractType.GREEN)}
                    className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-100 dark:border-emerald-800 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.98]"
                >
                    <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <LeafIcon />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Azzeriamola Green</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Luce & Gas 100% Green</p>
                    
                    <div className="bg-emerald-500 text-white font-black text-xl py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                        + €{rates[ContractType.GREEN].toFixed(2)}
                    </div>
                </button>

                {/* Light Card */}
                <button 
                    onClick={() => onSelectContract(ContractType.LIGHT)}
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.98]"
                >
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <BoltIcon />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Union Light</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Solo Luce Convenienza</p>
                    
                    <div className="bg-blue-600 text-white font-black text-xl py-2 px-4 rounded-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                        + €{rates[ContractType.LIGHT].toFixed(2)}
                    </div>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ContractSelectorModal;
