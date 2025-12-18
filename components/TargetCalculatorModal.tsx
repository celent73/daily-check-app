import React, { useState, useEffect } from 'react';
import { CommissionStatus, ContractType } from '../types';

interface TargetCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEarnings: number;
    commercialMonthStartDay: number;
    userStatus: CommissionStatus;
}

const TargetCalculatorModal: React.FC<TargetCalculatorModalProps> = ({
    isOpen,
    onClose,
    currentEarnings,
    commercialMonthStartDay,
    userStatus
}) => {
    const [targetIncome, setTargetIncome] = useState<number>(1500);
    const [manualDays, setManualDays] = useState<number | ''>('');
    const [useManualDays, setUseManualDays] = useState(false);

    // Constants (could be moved to shared file)
    const RATES = {
        [CommissionStatus.PRIVILEGIATO]: { [ContractType.GREEN]: 25, [ContractType.LIGHT]: 12.5 },
        [CommissionStatus.FAMILY_UTILITY]: { [ContractType.GREEN]: 50, [ContractType.LIGHT]: 25 }
    };

    const CONVERSION = {
        CONTACT_TO_APPT: 0.15, // 15%
        APPT_TO_CONTRACT: 0.30, // 30%
    };

    // Calculate remaining days
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth(); // 0-11

            // Determine end of commercial month
            // If today is >= startDay, end is next month startDay - 1
            // If today < startDay, end is this month startDay - 1
            let endDate = new Date();

            if (today.getDate() >= commercialMonthStartDay) {
                // End is next month
                endDate = new Date(currentYear, currentMonth + 1, commercialMonthStartDay - 1);
            } else {
                // End is this month
                endDate = new Date(currentYear, currentMonth, commercialMonthStartDay - 1);
            }

            const diffTime = Math.abs(endDate.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setRemainingDays(diffDays > 0 ? diffDays : 1); // Minimum 1 day
        }
    }, [isOpen, commercialMonthStartDay]);

    if (!isOpen) return null;

    const daysCalc = useManualDays && manualDays ? Number(manualDays) : remainingDays;
    const incomeGap = Math.max(0, targetIncome - currentEarnings);

    // Average earnings per contract (assuming 50/50 mix for simplicity)
    const rates = RATES[userStatus] || RATES[CommissionStatus.PRIVILEGIATO];
    const avgContractValue = (rates[ContractType.GREEN] + rates[ContractType.LIGHT]) / 2;

    const contractsNeededTotal = incomeGap / avgContractValue;
    const dailyContracts = contractsNeededTotal / (daysCalc || 1);

    const dailyAppts = dailyContracts / CONVERSION.APPT_TO_CONTRACT;
    const dailyContacts = dailyAppts / CONVERSION.CONTACT_TO_APPT;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white pb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-1">Target Calculator</h2>
                            <p className="text-indigo-100 text-sm font-medium">Reverse engineer your success 🚀</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 -mt-6 bg-white dark:bg-slate-900 rounded-t-3xl relative z-20">

                    {/* Input Section */}
                    <div className="space-y-6 pt-2">
                        <div>
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                                Obiettivo Mensile (€)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="100"
                                    value={targetIncome}
                                    onChange={(e) => setTargetIncome(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl font-bold font-mono min-w-[80px] text-center">
                                    {targetIncome}€
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200">Giorni Rimanenti</h4>
                                <p className="text-xs text-slate-500">Fine Mese: {commercialMonthStartDay - 1}° giorno</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {useManualDays ? (
                                    <input
                                        type="number"
                                        value={manualDays}
                                        onChange={(e) => setManualDays(Number(e.target.value))}
                                        className="w-16 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-center font-bold"
                                        placeholder="#"
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-slate-800 dark:text-white">{remainingDays}</span>
                                )}
                                <button
                                    onClick={() => setUseManualDays(!useManualDays)}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold underline"
                                >
                                    {useManualDays ? 'Auto' : 'Edit'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="my-8 border-t border-slate-100 dark:border-slate-800"></div>

                    {/* Results Section */}
                    <div className="space-y-3">
                        <h3 className="text-center font-black text-slate-800 dark:text-white text-lg mb-4">
                            Per raggiungere {targetIncome}€ devi fare OGNI GIORNO:
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Contacts Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex flex-col items-center text-center">
                                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                                    {Math.ceil(dailyContacts)}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800/60 dark:text-blue-200/60">
                                    Contatti
                                </span>
                            </div>

                            {/* Appts Card */}
                            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-2xl border border-violet-100 dark:border-violet-800/50 flex flex-col items-center text-center scale-105 shadow-xl shadow-violet-500/10 z-10">
                                <span className="text-4xl font-black text-violet-600 dark:text-violet-400 mb-1">
                                    {Math.ceil(dailyAppts)}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800/60 dark:text-violet-200/60">
                                    Appuntamenti
                                </span>
                            </div>

                            {/* Contracts Card */}
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/50 flex flex-col items-center text-center">
                                <span className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-1">
                                    {Math.ceil(dailyContracts * 10) / 10}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800/60 dark:text-orange-200/60">
                                    Contratti
                                </span>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6 italic">
                            *Calcolato su una media di {avgContractValue}€ a contratto e tassi di conversione standard.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TargetCalculatorModal;
