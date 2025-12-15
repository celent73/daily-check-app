
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
}

const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        <path d="M9 11a1 1 0 100-2 1 1 0 000 2zM9 14a1 1 0 100-2 1 1 0 000 2zM9 17a1 1 0 100-2 1 1 0 000 2zM12 17a1 1 0 100-2 1 1 0 000 2zM12 14a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({
    userProfile, onOpenSettings, onOpenDeleteDataModal, careerStatus, isPremium, remainingTrialDays, onOpenPaywall, isAnonymous, toggleTheme, currentTheme, onOpenMonthlyReport, onOpenGuide
}) => {

    return (
        // MODIFICATO: Gradiente molto più marcato (from-blue-800) e vibrante
        <header className="bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-400 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 shadow-xl shadow-blue-900/20 sticky top-0 z-50 transition-all duration-500 border-b border-blue-500/30">
            <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-[1px]"></div> {/* Overlay for texture/depth */}

            <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center relative z-10">
                <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 tracking-tight text-white drop-shadow-md cursor-default">
                    <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-sm border border-white/30 shadow-inner">
                        <img src="/app-logo.png" className="h-7 w-7 drop-shadow-sm object-contain" alt="Daily Check Logo" />
                    </div>
                    <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Daily Check
                    </span>
                </h1>

                <div className="flex items-center gap-2 sm:gap-4">
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
