import { ActivityLog } from '../types';

export const calculateCurrentStreak = (logs: ActivityLog[]): number => {
    if (!logs || logs.length === 0) return 0;

    // Sort logs by date descending (newest first)
    // Ensure we filter out logs with NO activity just in case
    const sortedLogs = [...logs]
        .filter(log => Object.values(log.counts).some(c => c > 0))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedLogs.length === 0) return 0;

    let streak = 0;

    // Use UTC date handling to align with App's storage (toISOString)
    const getUTCDate = (dateStr: string) => {
        const d = new Date(dateStr);
        // Normalize to midnight UTC to ensure diffDays works on whole days
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    };

    const todayDate = new Date();
    const todayUTC = Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());

    // Check first log
    const lastLogDate = getUTCDate(sortedLogs[0].date);
    const diffFromToday = Math.round((todayUTC - lastLogDate) / (1000 * 60 * 60 * 24));

    // The most recent log MUST be either Today (0 days ago) or Yesterday (1 day ago) to keep the streak alive
    if (diffFromToday > 1) {
        return 0; // Streak broken
    }

    streak = 1;

    // Iterate through the rest
    for (let i = 0; i < sortedLogs.length - 1; i++) {
        const current = getUTCDate(sortedLogs[i].date);
        const next = getUTCDate(sortedLogs[i + 1].date);

        const diffDesc = Math.round((current - next) / (1000 * 60 * 60 * 24));

        if (diffDesc === 1) {
            streak++;
        } else {
            break; // Gap found, streak ends
        }
    }

    return streak;
};
