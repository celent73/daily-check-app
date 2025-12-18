import React, { useRef, useState } from 'react';
import { ActivityType, UserProfile } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import html2canvas from 'html2canvas';

interface SocialShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    todayCounts: { [key in ActivityType]?: number };
    userProfile: UserProfile;
    customLabels?: Record<ActivityType, string>;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({ isOpen, onClose, todayCounts, userProfile, customLabels }) => {
    const storyRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<'cyber' | 'sunset' | 'nature' | 'noir'>('cyber');

    // Calculate total actions for the headline
    const totalActions = Object.values(todayCounts || {}).reduce((a: number, b: number | undefined) => a + (b || 0), 0);

    // Get date string
    const dateStr = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!isOpen) return null;

    const THEMES = {
        cyber: {
            bg: 'from-blue-900 via-slate-900 to-black',
            accent: 'from-blue-400 to-cyan-300',
            glow: 'bg-blue-500/20',
            text: 'text-blue-500'
        },
        sunset: {
            bg: 'from-orange-900 via-rose-900 to-black',
            accent: 'from-orange-400 to-yellow-300',
            glow: 'bg-orange-500/20',
            text: 'text-orange-500'
        },
        nature: {
            bg: 'from-emerald-900 via-teal-900 to-black',
            accent: 'from-emerald-400 to-green-300',
            glow: 'bg-emerald-500/20',
            text: 'text-emerald-500'
        },
        noir: {
            bg: 'from-gray-900 via-zinc-900 to-black',
            accent: 'from-white to-slate-400',
            glow: 'bg-white/10',
            text: 'text-white'
        }
    };

    const activeTheme = THEMES[selectedTheme];

    const handleDownload = async () => {
        if (!storyRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(storyRef.current, {
                scale: 3, // Ultra High resolution
                useCORS: true,
                backgroundColor: null,
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `daily-check-${selectedTheme}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (error) {
            console.error("Error generating story:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-black">
                    <h3 className="font-bold text-slate-700 dark:text-white">Anteprima Storia</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview Area - Designed to look like a phone screen */}
                {/* Ref attached here for capture */}
                <div ref={storyRef} className="relative bg-black aspect-[9/16] p-6 flex flex-col justify-between overflow-hidden group cursor-default select-none">
                    {/* Dynamic Background */}
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.bg} opacity-100 transition-colors duration-500`}></div>
                    <div className={`absolute top-0 right-0 w-80 h-80 ${activeTheme.glow} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500`}></div>
                    <div className={`absolute bottom-0 left-0 w-80 h-80 ${activeTheme.glow} rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 transition-colors duration-500`}></div>

                    {/* Particles/Stars (Static CSS) */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>

                    {/* Content */}
                    <div className="relative z-10 text-white h-full flex flex-col">
                        {/* Top Brand */}
                        <div className="flex items-center justify-between mb-8 opacity-90">
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 pr-3 rounded-full backdrop-blur-md border border-white/10">
                                <div className={`bg-gradient-to-br ${activeTheme.accent} p-1.5 rounded-full`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-bold tracking-wide text-xs uppercase">Daily Chek</span>
                            </div>
                            <span className="text-xs font-mono opacity-70">{dateStr}</span>
                        </div>

                        {/* Headline */}
                        <div className="mb-8">
                            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter drop-shadow-2xl mb-2">
                                BEAST<br />
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeTheme.accent}`}>MODE</span><br />
                                ACTIVATED
                            </h2>
                            <div className="h-1.5 w-20 bg-blue-500 rounded-full mt-4"></div>
                        </div>

                        {/* Grid of Results */}
                        <div className="grid grid-cols-2 gap-3 mb-auto">
                            {Object.values(ActivityType).map((activity) => {
                                const count = todayCounts?.[activity] || 0;
                                const label = customLabels?.[activity] || ACTIVITY_LABELS[activity];
                                const color = ACTIVITY_COLORS[activity];

                                if (count === 0) return null;

                                return (
                                    <div key={activity} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5 flex flex-col items-start justify-between min-h-[100px] relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 scale-150 text-white">
                                            {activityIcons[activity]}
                                        </div>
                                        <div className="relative z-10 p-2 rounded-xl bg-gradient-to-br from-white/20 to-transparent mb-2">
                                            {activityIcons[activity]}
                                        </div>
                                        <div className="relative z-10">
                                            <span className="text-3xl font-black block leading-none">{count}</span>
                                            <span className="text-[10px] font-bold uppercase opacity-70 tracking-wider truncate w-full block">{label}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Footer / Quote */}
                        <div className="mt-8 text-center relative z-10">
                            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] rounded-full">
                                <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-2.5">
                                    <p className="text-sm font-bold text-white bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                        {userProfile.firstName ? `${userProfile.firstName} sta spaccando! 🔥` : 'Produttività al 100% 🚀'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-slate-800 text-center space-y-3">

                    {/* Theme Selectors */}
                    <div className="flex justify-center gap-3 mb-2">
                        {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(theme => (
                            <button
                                key={theme}
                                onClick={() => setSelectedTheme(theme)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedTheme === theme ? 'border-blue-500 scale-125' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'}`}
                                style={{
                                    background: theme === 'cyber' ? '#3b82f6' :
                                        theme === 'sunset' ? '#f97316' :
                                            theme === 'nature' ? '#10b981' : '#333'
                                }}
                                aria-label={`Select ${theme} theme`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        {isGenerating ? (
                            <>Generazione in corso...</>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Scarica Storia
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialShareModal;
