import React from 'react';
import { ActivityLog, AppSettings, Achievement, AchievementId, UnlockedAchievements, ActivityType } from '../types';
import { getCommercialMonthRange } from './dateUtils';

// --- Icon Components for Achievements ---

const StreakIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.796 12.079a1 1 0 001.649 1.095c.345-.23.614-.558.822-.934l6.796-12.079a1 1 0 00-.2-1.715z" clipRule="evenodd" />
      <path d="M7 12.5a1 1 0 011-1h3.5a1 1 0 010 2H8a1 1 0 01-1-1z" />
    </svg>
);
  
const CenturionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM5 15h10v3H5v-3z" />
    </svg>
);
  
const CloserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 2.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L7 9.414V13a1 1 0 11-2 0V9.414l-.293.293a1 1 0 01-1.414-1.414l2-2z" />
        <path d="M12 10a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1-3a1 1 0 000 2h5a1 1 0 100-2h-5z" />
    </svg>
);
  
const PerfectDayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const MASTER_ACHIEVEMENT_LIST: Achievement[] = [
    {
        id: AchievementId.STACANOVISTA_7_DAYS,
        name: 'Stacanovista',
        description: 'Registra attività per 7 giorni di fila.',
        icon: <StreakIcon />,
    },
    {
        id: AchievementId.CENTURIONE_100_CONTACTS_MONTH,
        name: 'Centurione',
        description: 'Raggiungi 100 contatti in un mese commerciale.',
        icon: <CenturionIcon />,
    },
    {
        id: AchievementId.CLOSER_10_CONTRACTS,
        name: 'Closer',
        description: 'Firma 10 contratti in totale.',
        icon: <CloserIcon />,
    },
    {
        id: AchievementId.PERFETTO_ALL_DAILY_GOALS,
        name: 'Perfetto',
        description: 'Raggiungi tutti i tuoi obiettivi giornalieri in un giorno.',
        icon: <PerfectDayIcon />,
    },
];

const checkStreak = (logs: ActivityLog[], requiredStreak: number): boolean => {
    if (logs.length < requiredStreak) return false;

    const dates = [...new Set(logs.map(log => log.date))].sort();
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);
        const prevDate = new Date(dates[i-1]);
        
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        if (currentStreak >= requiredStreak) {
            return true;
        }
    }
    return false;
};

const checkMonthlyContacts = (logs: ActivityLog[], requiredContacts: number): boolean => {
    const { start, end } = getCommercialMonthRange(new Date());
    const totalContacts = logs
        .filter(log => {
            const logDate = new Date(log.date);
            return logDate >= start && logDate <= end;
        })
        .reduce((sum, log) => sum + (log.counts.CONTACTS || 0), 0);
    
    return totalContacts >= requiredContacts;
};

const checkTotalContracts = (logs: ActivityLog[], requiredContracts: number): boolean => {
    const totalContracts = logs.reduce((sum, log) => sum + (log.counts.NEW_CONTRACTS || 0), 0);
    return totalContracts >= requiredContracts;
};

const checkPerfectDay = (logs: ActivityLog[], settings: AppSettings): boolean => {
    const dailyGoals = settings.goals.daily;
    if (Object.keys(dailyGoals).length === 0) return false;

    return logs.some(log => {
        let allGoalsMet = true;
        for (const activity in dailyGoals) {
            const goal = dailyGoals[activity as ActivityType] || 0;
            const current = log.counts[activity as ActivityType] || 0;
            if (goal > 0 && current < goal) {
                allGoalsMet = false;
                break;
            }
        }
        return allGoalsMet;
    });
};

export const checkAndUnlockAchievements = (
    logs: ActivityLog[],
    settings: AppSettings,
    currentUnlocked: UnlockedAchievements
): { newlyUnlocked: Achievement[], updatedAchievements: UnlockedAchievements } => {

    const newlyUnlocked: Achievement[] = [];
    let updatedAchievements = { ...currentUnlocked };

    const unlock = (id: AchievementId) => {
        if (!updatedAchievements[id]) {
            const achievement = MASTER_ACHIEVEMENT_LIST.find(a => a.id === id);
            if (achievement) {
                newlyUnlocked.push(achievement);
                updatedAchievements[id] = { unlockedAt: new Date().toISOString() };
            }
        }
    };
    
    if (checkStreak(logs, 7)) unlock(AchievementId.STACANOVISTA_7_DAYS);
    if (checkMonthlyContacts(logs, 100)) unlock(AchievementId.CENTURIONE_100_CONTACTS_MONTH);
    if (checkTotalContracts(logs, 10)) unlock(AchievementId.CLOSER_10_CONTRACTS);
    if (checkPerfectDay(logs, settings)) unlock(AchievementId.PERFETTO_ALL_DAILY_GOALS);
    
    return { newlyUnlocked, updatedAchievements };
};
