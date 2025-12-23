import React, { useState, useEffect } from 'react';
import { ActivityType, VisionBoardData, NextAppointment, ActivityLog, ContractType } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { formatItalianDate, getCommercialMonthString, getDaysUntilCommercialMonthEnd, getCommercialMonthProgress } from '../utils/dateUtils';
import PersonalSalesWidget from './PersonalSalesWidget';
import PowerRing from './PowerRing';
import HistoryListModal from './HistoryListModal';

interface ActivityInputProps {
    todayCounts?: { [key in ActivityType]?: number };
    currentLog?: ActivityLog;
    monthTotals?: { [key in ActivityType]?: number };
    onUpdateActivity: (activity: ActivityType, change: number, dateStr: string) => void;
    onOpenPowerMode: () => void;
    onOpenObjectionHandler: () => void;
    onOpenSocialShare: () => void;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    commercialMonthStartDay: number;
    customLabels?: Record<ActivityType, string>;
    dailyEarnings?: number;
    monthlyEarnings?: number;
    onOpenContractModal?: () => void;
    onOpenAppointmentModal?: (step?: 'choice' | 'schedule') => void;
    visionBoardData?: VisionBoardData;
    nextAppointment?: NextAppointment;
    onOpenSettings?: (tab: 'profile' | 'goals' | 'labels') => void;
    onOpenVisionBoardSettings?: () => void;
    onOpenLeadCapture?: (type: ActivityType) => void;
    onOpenCalendar?: () => void;
    onOpenVoiceMode?: () => void;
    onOpenTargetCalculator?: () => void;
}

const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const LightningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const ActivityInput: React.FC<ActivityInputProps> = ({
    todayCounts,
    currentLog,
    monthTotals,
    onUpdateActivity,
    onOpenPowerMode,
    onOpenObjectionHandler,
    onOpenSocialShare,
    selectedDate,
    onDateChange,
    commercialMonthStartDay,
    customLabels,
    dailyEarnings = 0,
    monthlyEarnings = 0,
    onOpenContractModal,
    onOpenAppointmentModal,
    visionBoardData,
    nextAppointment,
    onOpenSettings,
    onOpenVisionBoardSettings,
    onOpenLeadCapture,
    onOpenCalendar,
    onOpenVoiceMode,
    onOpenTargetCalculator
}) => {

    const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityType | null>(null);

    const selectedDateFormatted = formatItalianDate(selectedDate);
    const commercialMonthStr = getCommercialMonthString(selectedDate, commercialMonthStartDay);
    const daysRemaining = getDaysUntilCommercialMonthEnd(selectedDate, commercialMonthStartDay);
    const monthProgress = getCommercialMonthProgress(selectedDate, commercialMonthStartDay);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    let remainingDaysText = '';
    if (daysRemaining === 0) {
        remainingDaysText = "Ultimo giorno!";
    } else {
        remainingDaysText = `- ${daysRemaining} gg alla fine`;
    }

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        onDateChange(newDate);
    }

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            onDateChange(new Date(e.target.value));
        }
    }

    const handleOpenHistory = (activity: ActivityType) => {
        setSelectedActivityForDetails(activity);
    };

    const handlePlusClick = (e: React.MouseEvent, activity: ActivityType) => {
        e.stopPropagation();
        if (activity === ActivityType.NEW_CONTRACTS && onOpenContractModal) {
            onOpenContractModal();
        } else if (activity === ActivityType.APPOINTMENTS && onOpenAppointmentModal) {
            onOpenAppointmentModal('choice'); // Open in default choice mode
        } else if (activity === ActivityType.CONTACTS && onOpenLeadCapture) {
            onOpenLeadCapture(ActivityType.CONTACTS);
        } else {
            onUpdateActivity(activity, 1, selectedDateStr);
        }
    };

    // Check if selected date is today to style "Today" badge
    const isToday = new Date().toDateString() === selectedDate.toDateString();

    return (
        <div className="bg-white/90 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] dark:shadow-none border-2 border-blue-100 dark:border-slate-800 h-full flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Decorative background blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-100 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none drop-shadow-sm">Registra</h2>
                    </div>
                    <div className="flex gap-2">
                        {!isToday && (
                            <button
                                type="button"
                                onClick={() => onDateChange(new Date())}
                                className="px-3 py-2 bg-blue-100/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border border-blue-200 dark:border-blue-900 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                                title="Torna alla data odierna"
                            >
                                <CalendarIcon />
                                <span className="hidden sm:inline">Oggi</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onOpenSocialShare}
                            className="p-2.5 bg-white dark:bg-black text-slate-500 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border-2 border-slate-100 dark:border-slate-800 hover:border-blue-200"
                            title="Condividi Storia"
                        >
                            <ShareIcon />
                        </button>
                        <button
                            type="button"
                            onClick={onOpenObjectionHandler}
                            className="p-2.5 bg-white dark:bg-black text-slate-500 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all border-2 border-slate-100 dark:border-slate-800 hover:border-blue-200"
                            title="SOS Obiezioni"
                        >
                            <ShieldIcon />
                        </button>
                        <button
                            type="button"
                            onClick={onOpenVoiceMode}
                            className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all animate-pulse-slow border border-rose-400"
                            title="Modalità Vocale"
                        >
                            <MicrophoneIcon />
                        </button>
                        <button
                            type="button"
                            onClick={onOpenPowerMode}
                            className="p-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all animate-pulse-slow border border-orange-300"
                            title="Avvia Power Mode"
                        >
                            <LightningIcon />
                        </button>
                        <button
                            type="button"
                            onClick={onOpenTargetCalculator}
                            className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all animate-pulse-slow border border-indigo-400"
                            title="Calcolatore Smart Target"
                        >
                            <CalculatorIcon />
                        </button>
                    </div>
                </div>

                {/* Date Navigator (Time Machine) */}
                {/* Date Navigator (Time Machine) - WOW STYLE */}
                <div className="flex items-center justify-between bg-white dark:bg-black rounded-2xl p-2 mb-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <button
                        type="button"
                        onClick={() => changeDate(-1)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl transition-all active:scale-95"
                    >
                        <ArrowLeftIcon />
                    </button>

                    <button
                        type="button"
                        onClick={onOpenCalendar}
                        className="flex-1 flex flex-col items-center justify-center relative group cursor-pointer py-1"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-xl md:text-2xl font-black tracking-tight ${isToday ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-slate-700 dark:text-white'}`}>
                                {selectedDateFormatted}
                            </span>
                            {isToday && (
                                <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                                    Oggi
                                </span>
                            )}
                        </div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1 group-hover:text-blue-500 transition-colors">
                            <CalendarIcon />
                            <span>Cambia Data</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => changeDate(1)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl transition-all active:scale-95"
                    >
                        <ArrowRightIcon />
                    </button>
                </div>

                {/* Personal Sales Unified Widget */}
                <PersonalSalesWidget
                    dailyEarnings={dailyEarnings}
                    monthlyEarnings={monthlyEarnings}
                    visionBoardData={visionBoardData}
                    onOpenSettings={onOpenVisionBoardSettings}
                />

                <div className="bg-slate-50/80 dark:bg-black p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-inner">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Mese Commerciale</span>
                        <span className={`text-sm font-bold ${daysRemaining <= 5 ? 'text-rose-500' : 'text-blue-600 dark:text-blue-400'}`}>
                            {remainingDaysText}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${monthProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">{commercialMonthStr.replace('Mese Commerciale: ', '')}</p>
                </div>
            </div>

            <div className="space-y-3 relative z-10 flex-grow overflow-y-auto pr-1 pb-2 scrollbar-hide">
                {Object.values(ActivityType).map((activity) => {
                    const count = todayCounts?.[activity] || 0;
                    const totalMonth = monthTotals?.[activity] || 0;
                    const color = ACTIVITY_COLORS[activity];
                    const label = customLabels?.[activity] || ACTIVITY_LABELS[activity];

                    return (
                        <div
                            key={activity}
                            className="group relative bg-white dark:bg-black rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-slate-100 dark:border-slate-800 hover:border-opacity-100 hover:scale-[1.02]"
                            style={{ borderColor: `${color}30` }}
                        >
                            <div className="flex items-center justify-between">
                                {/* Clickable Left Area to Open History */}
                                <div
                                    className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex-1"
                                    onClick={() => handleOpenHistory(activity)}
                                >
                                    <div className="relative">
                                        <PowerRing
                                            // Let's us count % 10 * 10 to make it fill up every 10?
                                            // Or better: show progress towards a "Daily Micro Goal" of say 5?
                                            // Let's try: (count % 10) * 10. So it fills up every 10.
                                            progress={(count % 10) * 10}
                                            size={56}
                                            strokeWidth={4}
                                            color={color}
                                            icon={
                                                <div
                                                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-sm transform transition-transform group-hover:scale-110 ${activity === ActivityType.VIDEOS_SENT ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                                                        activity === ActivityType.APPOINTMENTS ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                                                            ''
                                                        }`}
                                                    style={{ backgroundColor: (activity !== ActivityType.VIDEOS_SENT && activity !== ActivityType.APPOINTMENTS) ? color : undefined }}
                                                >
                                                    {activityIcons[activity]}
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-tight max-w-[100px] sm:max-w-[140px] truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                                            {label}
                                        </span>
                                        {/* Cumulative Month Badge */}
                                        <span className="inline-flex items-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                            Mese: <span className="ml-1 text-slate-600 dark:text-slate-300">{totalMonth}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-600">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Smart Decrement for Contracts
                                            if (activity === ActivityType.NEW_CONTRACTS && currentLog?.contractDetails) {
                                                const green = currentLog.contractDetails[ContractType.GREEN] || 0;
                                                const light = currentLog.contractDetails[ContractType.LIGHT] || 0;

                                                if (green > 0 && light === 0) {
                                                    onUpdateActivity(activity, -1, selectedDateStr, ContractType.GREEN);
                                                } else if (light > 0 && green === 0) {
                                                    onUpdateActivity(activity, -1, selectedDateStr, ContractType.LIGHT);
                                                } else if (green > 0 && light > 0) {
                                                    // Both exist: ask user implies complexity. 
                                                    // "Simple" strategy: Remove GREEN first (higher value) or last added?
                                                    // Let's assume removing the most valuable one is safer to avoid accidental high earnings?
                                                    // Or just generic decrement? Generic decrement WON'T update earnings.
                                                    // User asked "ability to reset". 
                                                    // Let's remove GREEN by default if present, or maybe show a toast?
                                                    // BEST UX: Just remove one. Which one?
                                                    // Let's default to removing Green. Or we can toggle?
                                                    // Actually, if I remove Green, I should say so.
                                                    if (window.confirm("Quale contratto vuoi rimuovere?\nOK = Green\nAnnulla = Light")) {
                                                        onUpdateActivity(activity, -1, selectedDateStr, ContractType.GREEN);
                                                    } else {
                                                        onUpdateActivity(activity, -1, selectedDateStr, ContractType.LIGHT);
                                                    }
                                                } else {
                                                    // No details recorded but count > 0? (Legacy data)
                                                    onUpdateActivity(activity, -1, selectedDateStr);
                                                }
                                            } else {
                                                // Normal activity or no details
                                                onUpdateActivity(activity, -1, selectedDateStr);
                                            }
                                        }}
                                        disabled={count === 0}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-600 active:scale-95"
                                    >
                                        <MinusIcon />
                                    </button>

                                    {/* Count also opens history */}
                                    <button
                                        type="button"
                                        onClick={() => handleOpenHistory(activity)}
                                        className="w-8 text-center font-black text-lg text-slate-800 dark:text-white hover:text-blue-600 transition-colors"
                                    >
                                        {count}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => handlePlusClick(e, activity)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all ${activity === ActivityType.VIDEOS_SENT ? 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/30' :
                                            activity === ActivityType.APPOINTMENTS ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30' :
                                                ''
                                            }`}
                                        style={{ backgroundColor: (activity !== ActivityType.VIDEOS_SENT && activity !== ActivityType.APPOINTMENTS) ? color : undefined }}
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <HistoryListModal
                isOpen={!!selectedActivityForDetails}
                onClose={() => setSelectedActivityForDetails(null)}
                activityType={selectedActivityForDetails}
                activityLog={currentLog}
                customLabel={selectedActivityForDetails ? (customLabels?.[selectedActivityForDetails] || ACTIVITY_LABELS[selectedActivityForDetails]) : ''}
            />
        </div>
    );
};

export default ActivityInput;
