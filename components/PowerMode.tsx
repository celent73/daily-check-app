
import React, { useState, useEffect } from 'react';
import { ActivityType } from '../types';

interface PowerModeProps {
  isOpen: boolean;
  onClose: () => void;
  onLogContact: () => void;
}

const PowerMode: React.FC<PowerModeProps> = ({ isOpen, onClose, onLogContact }) => {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // Default placeholder
  const [selectedMinutes, setSelectedMinutes] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [sessionContacts, setSessionContacts] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOpen && isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Optional: Play alarm sound here
    }
    return () => clearInterval(interval);
  }, [isOpen, isActive, timeLeft]);

  // Reset logic on open
  useEffect(() => {
    if (isOpen) {
        setIsActive(false); // Start in setup mode
        setSessionContacts(0);
        setSessionAttempts(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
      setTimeLeft(selectedMinutes * 60);
      setIsActive(true);
  };

  const handleReset = () => {
      setIsActive(false);
      setSessionContacts(0);
      setSessionAttempts(0);
  };

  const handleContact = () => {
    setSessionContacts(prev => prev + 1);
    onLogContact(); // Log to main app
  };

  const handleAttempt = () => {
    setSessionAttempts(prev => prev + 1);
  };

  const PRESETS = [15, 30, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden font-sans">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center h-full justify-center">
            
            {/* Header */}
            <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="animate-pulse text-yellow-400 text-2xl">⚡</span>
                    <h2 className="text-xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 hidden sm:block">
                        Power Mode
                    </h2>
                </div>
                
                <div className="flex items-center gap-3">
                    {isActive && (
                        <button 
                            onClick={handleReset}
                            className="px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-yellow-400 hover:text-yellow-300 transition-all text-xs font-bold tracking-wide uppercase flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden sm:inline">Riavvia</span>
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs font-bold tracking-wide uppercase"
                    >
                        Esci
                    </button>
                </div>
            </div>

            {!isActive ? (
                // SETUP SCREEN
                <div className="animate-fade-in text-center w-full max-w-lg">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em] mb-8">Configurazione Sessione</h3>
                    
                    <div className="mb-10 relative group">
                         <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-opacity"></div>
                         <div className="relative flex items-center justify-center gap-6">
                            <button 
                                onClick={() => setSelectedMinutes(prev => Math.max(5, prev - 5))}
                                className="h-12 w-12 rounded-full border border-slate-600 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-2xl pb-1"
                            >
                                -
                            </button>
                            <span className="text-8xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                                {selectedMinutes}
                                <span className="text-2xl text-slate-500 ml-2 font-normal">min</span>
                            </span>
                            <button 
                                onClick={() => setSelectedMinutes(prev => Math.min(180, prev + 5))}
                                className="h-12 w-12 rounded-full border border-slate-600 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-2xl pb-1"
                            >
                                +
                            </button>
                         </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-12">
                        {PRESETS.map(min => (
                            <button
                                key={min}
                                onClick={() => setSelectedMinutes(min)}
                                className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                                    selectedMinutes === min 
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                                }`}
                            >
                                {min}m
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleStartSession}
                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 font-black text-xl uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        AVVIA SESSIONE
                    </button>
                </div>
            ) : (
                // RUNNING SCREEN
                <div className="animate-scale-up text-center w-full">
                    <div className="mb-8 md:mb-12 relative">
                        {/* Timer Ring Effect (Simple CSS) */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="text-[100px] md:text-[140px] leading-none font-black font-mono tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-slate-500 uppercase tracking-[0.2em] text-sm font-bold mt-4 animate-pulse">Focus Attivo</p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-8 md:gap-16 mb-12">
                        <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 min-w-[120px]">
                            <span className="block text-4xl md:text-5xl font-bold text-cyan-400 mb-1">{sessionContacts}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Contatti OK</span>
                        </div>
                        <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 min-w-[120px]">
                            <span className="block text-4xl md:text-5xl font-bold text-purple-400 mb-1">{sessionAttempts}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tentativi</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-3xl mx-auto">
                        <button
                            onClick={handleAttempt}
                            className="flex-1 py-6 md:py-8 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 transition-all group relative overflow-hidden active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                            <span className="relative z-10 text-xl md:text-2xl font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">
                                Non Risposto
                            </span>
                        </button>

                        <button
                            onClick={handleContact}
                            className="flex-1 py-6 md:py-8 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all group relative overflow-hidden transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 text-2xl md:text-3xl font-black text-white uppercase tracking-widest flex items-center justify-center gap-3">
                                <span>📞</span> Risposto
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {!isActive && (
                <p className="absolute bottom-8 text-slate-700 text-xs uppercase tracking-widest">
                    Modalità Alta Performance
                </p>
            )}

        </div>
    </div>
  );
};

export default PowerMode;
