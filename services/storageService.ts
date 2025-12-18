// ============================================================================
// FILE: services/storageService.ts (Versione Locale)
// ============================================================================

import { ActivityLog, AppSettings, UnlockedAchievements } from '../types';

// Chiavi LocalStorage
const ACTIVITY_KEY = 'daily-check-app-logs';
const SETTINGS_KEY = 'daily-check-app-settings';
const ACHIEVEMENTS_KEY = 'daily-check-app-achievements';

// ---------------------------------------------------------------------------
// GESTIONE LOG ATTIVITÀ
// ---------------------------------------------------------------------------

export const loadLogs = async (userId: string | null): Promise<ActivityLog[]> => {
  const localData = localStorage.getItem(ACTIVITY_KEY);
  return localData ? JSON.parse(localData) : [];
};

export const saveLogs = async (userId: string | null, logs: ActivityLog[]) => {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
};

export const clearLogs = async (userId: string | null) => {
  localStorage.removeItem(ACTIVITY_KEY);
};

// ---------------------------------------------------------------------------
// GESTIONE IMPOSTAZIONI
// ---------------------------------------------------------------------------

export const loadSettings = async (userId: string | null): Promise<AppSettings | null> => {
  const localData = localStorage.getItem(SETTINGS_KEY);
  return localData ? JSON.parse(localData) : null;
};

export const saveSettings = async (userId: string | null, settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// ---------------------------------------------------------------------------
// GESTIONE OBIETTIVI (ACHIEVEMENTS)
// ---------------------------------------------------------------------------

export const loadUnlockedAchievements = async (userId: string | null): Promise<UnlockedAchievements> => {
  const localData = localStorage.getItem(ACHIEVEMENTS_KEY);
  return localData ? JSON.parse(localData) : {};
};

export const saveUnlockedAchievements = async (userId: string | null, achievements: UnlockedAchievements) => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

// ---------------------------------------------------------------------------
// BACKUP & RESTORE
// ---------------------------------------------------------------------------

export const getBackupData = async (userId: string | null) => {
  try {
    const logs = await loadLogs(null);
    const settings = await loadSettings(null);
    const unlockedAchievements = await loadUnlockedAchievements(null);

    return {
      activityLogs: logs,
      settings: settings,
      unlockedAchievements: unlockedAchievements,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Errore creazione backup:", error);
    return null;
  }
};

export const restoreBackupData = async (userId: string | null, data: any) => {
  if (!data) return;

  try {
    if (data.activityLogs && Array.isArray(data.activityLogs)) await saveLogs(null, data.activityLogs);
    if (data.settings) await saveSettings(null, data.settings);
    if (data.unlockedAchievements) await saveUnlockedAchievements(null, data.unlockedAchievements);

    return true;
  } catch (error) {
    console.error("Errore ripristino:", error);
    throw error;
  }
};
