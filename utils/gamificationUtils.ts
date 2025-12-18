import { ActivityLog } from '../types';

export const calculateCurrentStreak = (logs: ActivityLog[]): number => {
    if (!logs || logs.length === 0) return 0;

    // Sort logs by date descending (newest first)
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;

    // Normalize date to YYYY-MM-DD for comparison
    const toDateString = (date: Date) => date.toISOString().split('T')[0];
    const today = toDateString(new Date());
    const yesterday = toDateString(new Date(Date.now() - 86400000));

    // Helper to check if a log has any activity
    const hasActivity = (log: ActivityLog) => {
        return Object.values(log.counts).some(count => count > 0);
    };

    // Find today's log
    const todayLog = sortedLogs.find(log => log.date === today);
    const yesterdayLog = sortedLogs.find(log => log.date === yesterday);

    // If today has activity, start counting from today
    // If today has NO activity, but yesterday did, streak is still alive (start from yesterday)
    // If neither has activity, streak is 0

    let currentDateToCheck: string | null = null;

    if (todayLog && hasActivity(todayLog)) {
        streak = 1;
        currentDateToCheck = yesterday;
    } else if (yesterdayLog && hasActivity(yesterdayLog)) {
        streak = 1;
        currentDateToCheck = toDateString(new Date(Date.now() - 86400000 * 2)); // Check day before yesterday
    } else {
        return 0;
    }

    // Iterate backwards logic
    // We need a map for quick lookup
    const logsMap = new Map<string, ActivityLog>();
    sortedLogs.forEach(log => logsMap.set(log.date, log));

    while (currentDateToCheck) {
        const log = logsMap.get(currentDateToCheck);
        if (log && hasActivity(log)) {
            streak++;
            // Move back one day
            const d = new Date(currentDateToCheck);
            d.setDate(d.getDate() - 1);
            currentDateToCheck = toDateString(d);
        } else {
            break;
        }
    }

    return streak;
};
