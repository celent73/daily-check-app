import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, ActivityType, NotificationVariant, CommissionStatus, Goals, Qualification } from '../types';
import { ACTIVITY_LABELS, SETTINGS_ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { getBackupData, restoreBackupData } from '../services/storageService';
import GoalsShareModal from './GoalsShareModal';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSettings: (settings: AppSettings) => void;
    currentSettings: AppSettings;
    addNotification: (message: string, type: NotificationVariant) => void;
    onDataRestore?: () => void;
    initialTab?: 'profile' | 'goals' | 'labels' | 'notifications';
}

type GoalView = 'daily' | 'weekly' | 'monthly';
type TabView = 'profile' | 'goals' | 'labels' | 'notifications';

// --- Icons ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM5 15h10v3H5v-3z" />
    </svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
    </svg>
);
const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);
const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const ToggleSwitch: React.FC<{
    label: string;
    description?: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{label}</h4>
            {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm`}
            />
        </button>
    </div>
);

// Fallback for empty goals to prevent crash
const DEFAULT_GOALS_STRUCTURE: Goals = {
    daily: {},
    weekly: {},
    monthly: {}
};

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose, onSaveSettings, currentSettings, addNotification, onDataRestore, initialTab
}) => {
    const [settings, setSettings] = useState<AppSettings>(currentSettings);
    const [activeGoalTab, setActiveGoalTab] = useState<GoalView>('monthly');
    const [activeMainTab, setActiveMainTab] = useState<TabView>('profile');
    const [isGoalsShareModalOpen, setIsGoalsShareModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Merge defensively to ensure goals and customLabels exist
        setSettings(prev => ({
            ...prev,
            ...currentSettings,
            goals: { ...DEFAULT_GOALS_STRUCTURE, ...(currentSettings.goals || {}) },
            customLabels: { ...ACTIVITY_LABELS, ...(currentSettings.customLabels || {}) }
        }));
    }, [currentSettings, isOpen]);

    useEffect(() => {
        if (isOpen && initialTab && ['profile', 'goals', 'labels', 'notifications'].includes(initialTab)) {
            setActiveMainTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, [name]: value } }));
    };

    const handleStatusChange = (status: CommissionStatus) => {
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, commissionStatus: status } }));
    }

    const handleNotificationChange = (key: 'goalReached' | 'milestones', value: boolean) => {
        setSettings(prev => ({ ...prev, notificationSettings: { ...prev.notificationSettings, [key]: value } }));
    };

    const handleTargetQualificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, targetQualification: e.target.value as Qualification } }));
    };

    const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        if (val < 1) val = 1;
        if (val > 28) val = 28;
        setSettings(prev => ({ ...prev, commercialMonthStartDay: val }));
    };

    const handleLabelChange = (activity: ActivityType, newValue: string) => {
        setSettings(prev => ({
            ...prev,
            customLabels: { ...prev.customLabels, [activity]: newValue }
        }));
    };

    const handleEnableGoalsChange = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, enableGoals: enabled }));
    }

    const handleEnableLabelsChange = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, enableCustomLabels: enabled }));
    }

    const handleGoalChange = (period: GoalView, activity: ActivityType, value: string) => {
        const numValue = parseInt(value, 10);
        const cleanValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;

        setSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            // Defensive check
            if (!newSettings.goals) newSettings.goals = DEFAULT_GOALS_STRUCTURE;
            if (!newSettings.goals[period]) newSettings.goals[period] = {};

            newSettings.goals[period][activity] = cleanValue;

            if (period === 'daily') {
                if (activity === ActivityType.CONTACTS || activity === ActivityType.VIDEOS_SENT || activity === ActivityType.APPOINTMENTS) {
                    const calculatedWeekly = cleanValue * 6;
                    if (!newSettings.goals.weekly) newSettings.goals.weekly = {};
                    newSettings.goals.weekly[activity] = calculatedWeekly;
                }
            }

            const weeklyVal = newSettings.goals.weekly?.[activity] || 0;
            const calculatedMonthly = Math.round(weeklyVal * 4.5);
            if (!newSettings.goals.monthly) newSettings.goals.monthly = {};
            newSettings.goals.monthly[activity] = calculatedMonthly;

            return newSettings;
        });
    };

    const handleGoalButtonClick = (period: GoalView, activity: ActivityType, change: number) => {
        const currentValue = settings.goals?.[period]?.[activity] || 0;
        const newValue = Math.max(0, currentValue + change);
        handleGoalChange(period, activity, newValue.toString());
    };

    const handleSave = () => {
        onSaveSettings(settings);
        onClose();
        addNotification('Impostazioni salvate con successo!', 'success');
    };

    const handleDownloadBackup = () => {
        const data = getBackupData(null);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-check-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addNotification('Backup scaricato correttamente!', 'success');
    };

    const handleRestoreClick = () => { fileInputRef.current?.click(); };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);
                restoreBackupData(null, data);
                addNotification('Dati ripristinati con successo!', 'success');
                if (onDataRestore) onDataRestore();
                onClose();
            } catch (error) {
                console.error("Error restoring backup:", error);
                addNotification('Errore nel ripristino del file.', 'info');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col border border-white/20 dark:border-slate-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Impostazioni</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs - Fixed */}
                <div className="flex border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <button onClick={() => setActiveMainTab('profile')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'profile' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Profilo</button>
                    <button onClick={() => setActiveMainTab('goals')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'goals' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Obiettivi</button>
                    <button onClick={() => setActiveMainTab('labels')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'labels' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Etichette</button>
                    <button onClick={() => setActiveMainTab('notifications')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeMainTab === 'notifications' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Notifiche</button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-800/50">

                    {/* PROFILE TAB */}
                    {activeMainTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><span className="text-blue-500"><UserIcon /></span> Anagrafica</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                                        <input type="text" name="firstName" className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" value={settings.userProfile.firstName} onChange={handleProfileChange} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Cognome</label>
                                        <input type="text" name="lastName" className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" value={settings.userProfile.lastName} onChange={handleProfileChange} />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-600 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Giorno Inizio Mese Commerciale</p>
                                        <p className="text-xs text-slate-500">Es: Il 16 del mese</p>
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        max="28"
                                        value={settings.commercialMonthStartDay || 16}
                                        onChange={handleStartDayChange}
                                        className="w-20 h-12 text-center font-black text-xl bg-white text-slate-900 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><span className="text-emerald-500"><CashIcon /></span> Status Provvigionale</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => handleStatusChange(CommissionStatus.PRIVILEGIATO)} className={`p-3 rounded-xl border-2 text-left ${settings.userProfile.commissionStatus === CommissionStatus.PRIVILEGIATO ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}>
                                        <div className="font-bold text-slate-800 dark:text-white">Cliente Privilegiato</div>
                                        <div className="text-xs text-slate-500">Guadagni base</div>
                                    </button>
                                    <button onClick={() => handleStatusChange(CommissionStatus.FAMILY_UTILITY)} className={`p-3 rounded-xl border-2 text-left ${settings.userProfile.commissionStatus === CommissionStatus.FAMILY_UTILITY ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}>
                                        <div className="font-bold text-slate-800 dark:text-white">Family Utility</div>
                                        <div className="text-xs text-slate-500">Guadagni doppi</div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><span className="text-cyan-500"><CloudIcon /></span> Backup Dati</h3>
                                <div className="flex gap-3">
                                    <button onClick={handleDownloadBackup} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">Scarica Backup</button>
                                    <button onClick={handleRestoreClick} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">Ripristina</button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GOALS TAB */}
                    {activeMainTab === 'goals' && (
                        <div className="space-y-6">
                            <ToggleSwitch
                                label="Abilita Obiettivi"
                                description="Se disabilitato, i contatori degli obiettivi non verranno mostrati."
                                enabled={settings.enableGoals ?? true}
                                onChange={handleEnableGoalsChange}
                            />

                            <div className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                    <span className="text-yellow-500">🏆</span> Target Qualifica
                                </h4>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                    value={settings.userProfile.targetQualification || ''}
                                    onChange={handleTargetQualificationChange}
                                >
                                    <option value="">Seleziona Target...</option>
                                    {Object.values(Qualification).map(q => (
                                        <option key={q} value={q}>{q}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`space-y-6 transition-all duration-300 ${!(settings.enableGoals ?? true) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <div className="flex justify-center bg-white dark:bg-slate-700/50 p-1 rounded-xl shadow-sm">
                                    {['daily', 'weekly', 'monthly'].map((view) => (
                                        <button key={view} onClick={() => setActiveGoalTab(view as GoalView)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeGoalTab === view ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}>
                                            {view === 'daily' ? 'Giornalieri' : view === 'weekly' ? 'Settimanali' : 'Mensili'}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsGoalsShareModalOpen(true)}
                                    className="w-full py-3 font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Condividi Obiettivi WOW
                                </button>

                                <div className="space-y-3">
                                    {Object.values(ActivityType).map((activity) => {
                                        const val = settings.goals?.[activeGoalTab]?.[activity] || 0;
                                        // Uses specific labels for Goals tab: "Target ..."
                                        const label = SETTINGS_ACTIVITY_LABELS[activity];
                                        const color = ACTIVITY_COLORS[activity];

                                        return (
                                            <div key={activity} className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                                                        {activityIcons[activity]}
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-700 dark:text-white">{label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleGoalButtonClick(activeGoalTab, activity, -1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-500 hover:bg-slate-200"><MinusIcon /></button>
                                                    <input
                                                        type="number"
                                                        className="w-16 text-center font-bold bg-transparent dark:text-white outline-none border-b border-transparent focus:border-blue-500"
                                                        value={val}
                                                        onChange={(e) => handleGoalChange(activeGoalTab, activity, e.target.value)}
                                                    />
                                                    <button onClick={() => handleGoalButtonClick(activeGoalTab, activity, 1)} className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 hover:bg-blue-200"><PlusIcon /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LABELS TAB */}
                    {activeMainTab === 'labels' && (
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Abilita Etichette Personalizzate"
                                description="Se disabilitato, verranno usati i nomi standard delle attività."
                                enabled={settings.enableCustomLabels ?? true}
                                onChange={handleEnableLabelsChange}
                            />

                            <div className={`space-y-4 transition-all duration-300 ${!(settings.enableCustomLabels ?? true) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200 mb-4 flex items-start gap-2">
                                    <TagIcon />
                                    <p>Rinomina le attività in base al tuo metodo di lavoro.</p>
                                </div>

                                {Object.values(ActivityType).map((activity) => {
                                    const label = settings.customLabels?.[activity] || ACTIVITY_LABELS[activity];
                                    const color = ACTIVITY_COLORS[activity];
                                    const isLocked = activity === ActivityType.NEW_CONTRACTS;

                                    return (
                                        <div key={activity} className={`bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 flex items-center gap-4 ${isLocked ? 'opacity-75' : ''}`}>
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: color }}>
                                                {activityIcons[activity]}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">{ACTIVITY_LABELS[activity]} (Originale)</p>
                                                <input
                                                    type="text"
                                                    className="w-full font-bold bg-transparent border-b border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none pb-1 dark:text-white"
                                                    value={label}
                                                    onChange={(e) => !isLocked && handleLabelChange(activity, e.target.value)}
                                                    disabled={isLocked}
                                                />
                                                {isLocked && <p className="text-[10px] text-amber-500 mt-1">Non modificabile per calcoli sistema</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeMainTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="text-amber-500"><BellIcon /></span> Preferenze Notifiche
                                </h3>
                                <div className="space-y-2">
                                    <ToggleSwitch
                                        label="Raggiungimento Obiettivo"
                                        description="Ricevi una notifica quando completi un obiettivo (100%)"
                                        enabled={settings.notificationSettings.goalReached}
                                        onChange={(val) => handleNotificationChange('goalReached', val)}
                                    />
                                    <ToggleSwitch
                                        label="Progressi (Milestones)"
                                        description="Ricevi incoraggiamenti quando sei a metà strada o quasi alla fine"
                                        enabled={settings.notificationSettings.milestones}
                                        onChange={(val) => handleNotificationChange('milestones', val)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer - Fixed */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">Annulla</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">Salva</button>
                </div>
            </div>
            <GoalsShareModal
                isOpen={isGoalsShareModalOpen}
                onClose={() => setIsGoalsShareModalOpen(false)}
                goals={settings.goals?.[activeGoalTab] || {}}
                period={activeGoalTab}
                userProfile={settings.userProfile}
                customLabels={settings.customLabels}
            />
        </div >
    );
};

export default SettingsModal;
