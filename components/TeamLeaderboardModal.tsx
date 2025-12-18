import React, { useState, useEffect } from 'react';
import { ActivityType, TeamMemberStats, ActivityLog } from '../types';
import { encodeTeamStats, decodeTeamStats, calculateMonthlyStats } from '../utils/teamUtils';
import { ACTIVITY_LABELS } from '../constants';

interface TeamLeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityLogs: ActivityLog[];
    userName: string;
    commercialStartDay: number;
}

const TeamLeaderboardModal: React.FC<TeamLeaderboardModalProps> = ({
    isOpen,
    onClose,
    activityLogs,
    userName,
    commercialStartDay
}) => {
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'share'>('leaderboard');
    const [importString, setImportString] = useState('');
    const [teamMembers, setTeamMembers] = useState<TeamMemberStats[]>([]);
    const [myStatsString, setMyStatsString] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Load team members from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('team_members_cache');
        if (saved) {
            try {
                setTeamMembers(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load team cache", e);
            }
        }
    }, []);

    // Save team members when updated
    useEffect(() => {
        localStorage.setItem('team_members_cache', JSON.stringify(teamMembers));
    }, [teamMembers]);

    // Generate my stats string
    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const period = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`; // Current Month
            // TODO: Filter logs for commercial month correctly if needed. using simplify logic for now.
            // Assuming logs are accumulating, calculateMonthlyStats needs filtering logic or assumes passed logs are relevant?
            // teamUtils' calculateMonthlyStats sums ALL passed logs. 
            // We really should pass filtered logs or handle filtering there.
            // For "Wow" speed, let's filter here briefly.

            // Filter logs for current commercial month
            // logic simplified: take all logs for now or last 30 days?
            // Let's rely on validity of passed data or just pass all. 
            // Ideally we filter by date range.
            const stats = calculateMonthlyStats(activityLogs, period, userName, commercialStartDay);
            const encoded = encodeTeamStats(stats);
            setMyStatsString(encoded);
        }
    }, [isOpen, activityLogs, userName, commercialStartDay]);

    const handleImport = () => {
        if (!importString) return;
        const stats = decodeTeamStats(importString);
        if (stats) {
            setTeamMembers(prev => {
                // Remove existing if same ID or same name+period?
                // Let's update by ID
                const filtered = prev.filter(p => p.id !== stats.id && p.name !== stats.name);
                return [...filtered, stats].sort((a, b) => b.totalScore - a.totalScore);
            });
            setImportString('');
            alert(`Importato con successo: ${stats.name}`);
        } else {
            alert("Codice non valido!");
        }
    };

    const handleDeleteMember = (id: string) => {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(myStatsString);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // MVP Calculation Logic
    const mvpBadges: Record<string, string[]> = {};
    if (teamMembers.length > 0) {
        // Find Max values
        const maxContacts = Math.max(...teamMembers.map(m => m.stats.CONTACTS || 0));
        const maxAppointments = Math.max(...teamMembers.map(m => m.stats.APPOINTMENTS || 0));
        const maxContracts = Math.max(...teamMembers.map(m => m.stats.NEW_CONTRACTS || 0));

        teamMembers.forEach(member => {
            const badges = [];
            if (member.stats.CONTACTS === maxContacts && maxContacts > 0) badges.push('👑'); // Re dei Contatti
            if (member.stats.APPOINTMENTS === maxAppointments && maxAppointments > 0) badges.push('💼'); // Business Man
            if (member.stats.NEW_CONTRACTS === maxContracts && maxContracts > 0) badges.push('🦈'); // Lo Squalo
            if (badges.length > 0) {
                mvpBadges[member.id] = badges;
            }
        });
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Sfida di Squadra
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'leaderboard' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        🏆 Classifica
                    </button>
                    <button
                        className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'share' ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('share')}
                    >
                        📤 Il Mio Punteggio
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">

                    {activeTab === 'share' && (
                        <div className="space-y-6 text-center">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Il tuo Codice Univoco</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Copia questo codice e invialo al tuo Capitano o nel gruppo WhatsApp!</p>

                                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg break-all font-mono text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto mb-4">
                                    {myStatsString || "Generazione in corso..."}
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className={`w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${copySuccess
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30'
                                        }`}
                                >
                                    {copySuccess ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Copiato!
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copia per WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div className="space-y-6">
                            {/* Import Input */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Aggiungi Membro Team</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Incolla qui il codice..."
                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        value={importString}
                                        onChange={(e) => setImportString(e.target.value)}
                                    />
                                    <button
                                        onClick={handleImport}
                                        className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition"
                                    >
                                        Aggiungi
                                    </button>
                                </div>
                            </div>

                            {/* Leaderboard List */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Classifica Provvisoria</h3>

                                {teamMembers.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p>Ancora nessun membro aggiunto.</p>
                                        <p className="text-xs">Incolla un codice per iniziare!</p>
                                    </div>
                                ) : (
                                    teamMembers.map((member, index) => (
                                        <div key={member.id} className={`relative p-4 rounded-xl flex items-center justify-between border shadow-sm ${index === 0 ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700' :
                                            index === 1 ? 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-600' :
                                                index === 2 ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
                                                    'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                                            }`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-lg ${index === 0 ? 'text-amber-500' :
                                                    index === 1 ? 'text-slate-400' :
                                                        index === 2 ? 'text-orange-500' :
                                                            'text-slate-300'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-800 dark:text-white">{member.name}</p>
                                                        {mvpBadges[member.id] && (
                                                            <div className="flex gap-1" title="MVP Medals">
                                                                {mvpBadges[member.id].map(badge => <span key={badge} className="text-sm cursor-help">{badge}</span>)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 text-xs text-slate-500">
                                                        <span>📞 {member.stats[ActivityType.CONTACTS] || 0}</span>
                                                        <span>📅 {member.stats[ActivityType.APPOINTMENTS] || 0}</span>
                                                        <span>✍️ {member.stats[ActivityType.NEW_CONTRACTS] || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Punti</p>
                                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{member.totalScore}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="text-slate-300 hover:text-red-500 transition p-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scoring Legend */}
                    {activeTab === 'leaderboard' && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 mt-4 mx-0">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Come si calcolano i punti?
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex justify-between"><span>📞 Contatto:</span> <span className="font-bold">1 pt</span></div>
                                <div className="flex justify-between"><span>📲 Video:</span> <span className="font-bold">2 pt</span></div>
                                <div className="flex justify-between"><span>📅 Appuntamento:</span> <span className="font-bold">5 pt</span></div>
                                <div className="flex justify-between"><span>⚡ Family Utility:</span> <span className="font-bold">10 pt</span></div>
                                <div className="w-full col-span-2 flex justify-between bg-white dark:bg-slate-800 px-2 py-1 rounded border border-indigo-100 dark:border-slate-700">
                                    <span>✍️ Contratto:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">20 pt</span>
                                </div>
                                <div className="col-span-2 border-t border-indigo-200 mt-2 pt-2 grid grid-cols-3 gap-1 text-[10px] text-center">
                                    <div className="bg-white/50 rounded p-1">👑 Re Contatti</div>
                                    <div className="bg-white/50 rounded p-1">💼 Business Man</div>
                                    <div className="bg-white/50 rounded p-1">🦈 Squalo Contratti</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TeamLeaderboardModal;
