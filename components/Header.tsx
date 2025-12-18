
import React from 'react';
import { UserProfile, Theme } from '../types';
import { CareerStatusInfo } from '../utils/careerUtils';

interface HeaderProps {
    userProfile: UserProfile;
    onOpenSettings: () => void;
    onOpenDeleteDataModal: () => void;
    careerStatus: CareerStatusInfo;
    isPremium: boolean;
    remainingTrialDays: number | null;
    onOpenPaywall: () => void;
    isAnonymous: boolean;
    toggleTheme: () => void;
    currentTheme: Theme;
    onOpenMonthlyReport: () => void;
    onOpenGuide: () => void;
    streak: number;
}

const StreakBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
        <div className="flex items-center gap-1 bg-gradient-to-tr from-orange-500 to-red-600 text-white pl-2 pr-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20 border border-orange-400/20 animate-fade-in">
            <span className="text-sm animate-pulse">🔥</span>
            <span>{count} {count === 1 ? 'giiorno' : 'giorni'}</span>
        </div>
    );
};

const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// ... existing constants ...
const Header: React.FC<HeaderProps> = ({
    userProfile, onOpenSettings, onOpenDeleteDataModal, careerStatus, streak, isPremium, remainingTrialDays, onOpenPaywall, isAnonymous, toggleTheme, currentTheme, onOpenMonthlyReport, onOpenGuide, onOpenTeamChallenge
}) => {

    return (
        // MODIFICATO: Gradiente molto più marcato (from-blue-800) e vibrante
        <header className="bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-400 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 shadow-xl shadow-blue-900/20 sticky top-0 z-50 transition-all duration-500 border-b border-blue-500/30">
            <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-[1px]"></div> {/* Overlay for texture/depth */}

            <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 tracking-tight text-white drop-shadow-md cursor-default">
                        <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-sm border border-white/30 shadow-inner">
                            <img src="/app-logo.png" className="h-7 w-7 drop-shadow-sm object-contain" alt="Daily Check Logo" />
                        </div>
                        <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }} className="hidden sm:inline">
                            Daily Check
                        </span>
                    </h1>
                    {/* STREAK BADGE (Mobile optimized: always visible if active) */}
                    <StreakBadge count={streak} />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* INSTALL BUTTON (PWA) */}
                    <InstallButton />

                    {/* Guide Button */}
                    <button
                        onClick={onOpenGuide}
                        className="p-2 rounded-full text-white/90 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                        aria-label="Guida utente"
                    >
                        <QuestionMarkIcon />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-white/90 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                        aria-label={currentTheme === 'light' ? 'Attiva modalità scura' : 'Attiva modalità chiara'}
                    >
                        {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>

                    <button
                        onClick={onOpenMonthlyReport}
                        className="p-2 rounded-full text-white/90 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
                        aria-label="Report Mensile"
                        title="Genera Report Mensile"
                    >
                        <DocumentIcon />
                    </button>

                    <button
                        onClick={onOpenTeamChallenge}
                        className="p-2 rounded-full text-white/90 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
                        aria-label="Sfida Team"
                        title="Classifica Team"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>

                    {userProfile.firstName ? (
                        <span className="text-sm font-bold text-white/95 hidden md:inline tracking-wide drop-shadow-sm">
                            Ciao, {userProfile.firstName}!
                        </span>
                    ) : (
                        <span
                            onClick={onOpenSettings}
                            className="text-white/90 text-sm font-medium hover:text-white cursor-pointer transition-colors hidden md:inline border-b border-white/40 hover:border-white"
                        >
                            Inserisci nome
                        </span>
                    )}

                    <button
                        onClick={onOpenSettings}
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-bold text-blue-700 bg-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                        aria-label="Apri impostazioni"
                    >
                        <SettingsIcon className="h-5 w-5 text-blue-600 animate-spin-slow-on-hover" />
                        <span className="hidden sm:inline">Settings</span>
                    </button>

                    <button
                        onClick={onOpenDeleteDataModal}
                        className="p-2 rounded-full text-white/80 hover:text-rose-100 hover:bg-rose-500/30 transition-all duration-300"
                        aria-label="Cancella dati attività"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
