import { ActivityType, TeamMemberStats, ActivityLog } from '../types';

export const encodeTeamStats = (stats: TeamMemberStats): string => {
    try {
        const jsonString = JSON.stringify(stats);
        // Simple Base64 encoding to make it "copy-paste friendly" and slightly obscure
        // Unicode handling
        const bytes = new TextEncoder().encode(jsonString);
        const binString = String.fromCodePoint(...bytes);
        return btoa(binString);
    } catch (error) {
        console.error("Error encoding stats:", error);
        return "";
    }
};

export const decodeTeamStats = (encoded: string): TeamMemberStats | null => {
    try {
        const binString = atob(encoded);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        const jsonString = new TextDecoder().decode(bytes);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error decoding stats:", error);
        return null;
    }
};

export const calculateMonthlyStats = (
    logs: ActivityLog[],
    period: string, // YYYY-MM
    userName: string,
    commercialStartDay: number = 16
): TeamMemberStats => {
    // Logic simplified: using calendar month or commercial?
    // User request usually implies "Commercial Month".
    // Assume period is passed correctly or we derive current range.

    // Let's iterate logs and sum up
    const rangeStart = new Date(); // Placeholder logic - usually passed in
    // Ideally we use logic from calculateProgressForActivity but simplified for export.

    // For this generic export, let's just sum ALL logs that fall into the "Current View" logic
    // But wait, the function needs to know WHICH logs to sum.
    // We will assume the caller filters the logs (e.g., passing only current month logs)

    const totals: { [key in ActivityType]?: number } = {};

    logs.forEach(log => {
        Object.entries(log.counts).forEach(([type, count]) => {
            totals[type as ActivityType] = (totals[type as ActivityType] || 0) + count;
        });
    });

    // Simple Score Algorithm (CUSTOMIZABLE)
    // Contacts = 1pt, Appointments = 5pts, Contracts = 20pts
    let score = 0;
    score += (totals[ActivityType.CONTACTS] || 0) * 1;
    score += (totals[ActivityType.VIDEOS_SENT] || 0) * 2;
    score += (totals[ActivityType.APPOINTMENTS] || 0) * 5;
    score += (totals[ActivityType.NEW_CONTRACTS] || 0) * 20;
    score += (totals[ActivityType.NEW_FAMILY_UTILITY] || 0) * 10;

    return {
        id: `${userName}-${Date.now()}`,
        name: userName || "Utente",
        period: period,
        stats: totals,
        totalScore: score,
        generatedAt: new Date().toISOString()
    };
};
