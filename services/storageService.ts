// ============================================================================
// FILE: services/storageService.ts (Versione Ibrida Cloud/Locale)
// ============================================================================

import { ActivityLog, AppSettings, UnlockedAchievements, UserProfile, CommissionStatus, Qualification } from '../types';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

// Chiavi LocalStorage
const ACTIVITY_KEY = 'daily-check-app-logs';
const SETTINGS_KEY = 'daily-check-app-settings';
const ACHIEVEMENTS_KEY = 'daily-check-app-achievements';

// --- HELPERS ---
const getLocalLogs = (): ActivityLog[] => {
  try {
    const localData = localStorage.getItem(ACTIVITY_KEY);
    return localData ? JSON.parse(localData) : [];
  } catch (e) { console.error("Local Load Error", e); return []; }
};

const getLocalSettings = (): AppSettings | null => {
  try {
    const localData = localStorage.getItem(SETTINGS_KEY);
    return localData ? JSON.parse(localData) : null;
  } catch (e) { console.error("Local Settings Error", e); return null; }
};

const getLocalAchievements = (): UnlockedAchievements => {
  try {
    const localData = localStorage.getItem(ACHIEVEMENTS_KEY);
    return localData ? JSON.parse(localData) : {};
  } catch (e) { return {}; }
};

// ---------------------------------------------------------------------------
// GESTIONE LOG ATTIVITÀ
// ---------------------------------------------------------------------------
export const loadLogs = async (userId: string | null): Promise<ActivityLog[]> => {
  if (userId) {
    // CLOUD MODE
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading logs from Supabase:', error);
      return [];
    }

    // Map snake_case DB columns to camelCase App properties
    const mappedData = data.map((item: any) => ({
      ...item,
      contractDetails: item.contract_details, // Crucial mapping
      leads: item.leads,
      counts: item.counts,
      date: item.date
    }));

    return mappedData as ActivityLog[];
  } else {
    // LOCAL MODE
    return getLocalLogs();
  }
};

export const saveLogs = async (userId: string | null, logs: ActivityLog[]) => {
  if (userId) {
    // CLOUD MODE: We need to upsert.
    // Since `logs` is the full array, we iterate and upsert.
    // Optimization: In a real app we'd only save the changed one, but here we save all for safety or diff.
    // BETTER STRATEGY: The app usually updates one log at a time or adds one.
    // However, this function receives the WHOLE array.
    // To avoid massive writes, we should ideally upsert only the changed ones.
    // For simplicity in this migration, we Upsert the whole batch (careful with rate limits).

    const payload = logs.map(log => ({
      user_id: userId,
      date: log.date,
      counts: log.counts,
      contract_details: log.contractDetails || {},
      leads: log.leads || [],
      updated_at: new Date().toISOString() // Force update
    }));

    const { error } = await supabase
      .from('activity_logs')
      .upsert(payload, { onConflict: 'user_id, date' });

    if (error) console.error('Error saving logs to Supabase:', error);

  } else {
    // LOCAL MODE
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
  }
};

export const clearLogs = async (userId: string | null) => {
  if (userId) {
    // Dangerous in cloud!
    const { error } = await supabase.from('activity_logs').delete().eq('user_id', userId);
    if (error) console.error("Error clearing logs:", error);
  } else {
    localStorage.removeItem(ACTIVITY_KEY);
  }
};

// ---------------------------------------------------------------------------
// GESTIONE IMPOSTAZIONI & PROFILO
// ---------------------------------------------------------------------------

export const loadSettings = async (userId: string | null): Promise<AppSettings | null> => {
  if (userId) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error("Error loading settings:", error);
    }

    if (data) {
      // Reconstruct AppSettings object conforming to interface
      return {
        theme: data.theme as 'light' | 'dark',
        goals: data.goals,
        commercialMonthStartDay: data.commercial_month_start_day,
        customLabels: data.custom_labels,
        notificationSettings: data.notification_settings,
        visionBoard: data.vision_board,
        userProfile: { firstName: '', lastName: '' } // Profile is loaded separately usually, but we need to merge
      };
    }
    return null;
  } else {
    return getLocalSettings();
  }
};

export const loadUserProfile = async (userId: string | null): Promise<UserProfile> => {
  if (userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      return {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        commissionStatus: (data.commission_status as CommissionStatus) || CommissionStatus.PRIVILEGIATO,
        currentQualification: data.current_qualification as Qualification,
        targetQualification: data.target_qualification as Qualification
      };
    }
    return { firstName: 'Utente', lastName: '', commissionStatus: CommissionStatus.PRIVILEGIATO };
  } else {
    // In local mode, profile is part of settings, so we extract it or return default
    const settings = getLocalSettings();
    return settings?.userProfile || { firstName: '', lastName: '', commissionStatus: CommissionStatus.PRIVILEGIATO };
  }
}


export const saveSettings = async (userId: string | null, settings: AppSettings) => {
  if (userId) {
    // Save Settings
    const { error: settingsError } = await supabase.from('user_settings').upsert({
      user_id: userId,
      theme: settings.theme,
      goals: settings.goals,
      commercial_month_start_day: settings.commercialMonthStartDay,
      custom_labels: settings.customLabels,
      notification_settings: settings.notificationSettings,
      vision_board: settings.visionBoard,
      updated_at: new Date().toISOString()
    });

    if (settingsError) console.error("Error saving settings:", settingsError);

    // Save Profile (User Profile is inside settings in the App state, but separate table in DB)
    // SAFETY CHECK: Only save profile if it has content. Use specific check to avoid overwriting with empty defaults.
    if (settings.userProfile && (settings.userProfile.firstName?.trim() || settings.userProfile.lastName?.trim())) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: settings.userProfile.firstName,
        last_name: settings.userProfile.lastName,
        commission_status: settings.userProfile.commissionStatus,
        current_qualification: settings.userProfile.currentQualification,
        target_qualification: settings.userProfile.targetQualification,
        updated_at: new Date().toISOString()
      });

      if (profileError) console.error("Error saving profile:", profileError);
    }

  } else {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};

// ---------------------------------------------------------------------------
// GESTIONE OBIETTIVI (ACHIEVEMENTS)
// ---------------------------------------------------------------------------

export const loadUnlockedAchievements = async (userId: string | null): Promise<UnlockedAchievements> => {
  if (userId) {
    const { data, error } = await supabase
      .from('achievements')
      .select('unlocked_achievements')
      .eq('user_id', userId)
      .single();

    return data?.unlocked_achievements || {};
  } else {
    const localData = localStorage.getItem(ACHIEVEMENTS_KEY);
    return localData ? JSON.parse(localData) : {};
  }
};

export const saveUnlockedAchievements = async (userId: string | null, achievements: UnlockedAchievements) => {
  if (userId) {
    const { error } = await supabase.from('achievements').upsert({
      user_id: userId,
      unlocked_achievements: achievements,
      updated_at: new Date().toISOString()
    });
    if (error) console.error("Error saving achievements", error);
  } else {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

// ---------------------------------------------------------------------------
// MIGRATION & SYNC (THE MAGIC BUTTON)
// ---------------------------------------------------------------------------

export const syncLocalDataToCloud = async (userId: string) => {
  if (!userId) return;

  console.log("Starting Cloud Sync...");

  const localLogs = getLocalLogs();
  const localSettings = getLocalSettings();
  const localAchievements = getLocalAchievements();

  if (localLogs.length > 0) {
    await saveLogs(userId, localLogs);
  }

  if (localSettings) {
    await saveSettings(userId, localSettings);
    // Also force profile create/update if strictly local existed
    if (localSettings.userProfile) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId, // Upsert needs ID
        first_name: localSettings.userProfile.firstName,
        last_name: localSettings.userProfile.lastName,
        commission_status: localSettings.userProfile.commissionStatus,
        updated_at: new Date().toISOString()
      });
    }
  }

  if (Object.keys(localAchievements).length > 0) {
    await saveUnlockedAchievements(userId, localAchievements);
  }

  console.log("Cloud Sync Completed!");
  // Optional: Clear local storage after sync or keep it as backup?
  // localStorage.clear(); // Safe to keep for now.
  return true;
};

// ---------------------------------------------------------------------------
// BACKUP & RESTORE (Legacy / Export purpose)
// ---------------------------------------------------------------------------

export const getBackupData = async (userId: string | null) => {
  try {
    const logs = await loadLogs(userId);
    const settings = await loadSettings(userId);
    const unlockedAchievements = await loadUnlockedAchievements(userId);
    // If cloud, we need to fetch profile manually and merge into settings for the export format expected
    let fullSettings = settings;
    if (userId && settings) {
      const profile = await loadUserProfile(userId);
      fullSettings = { ...settings, userProfile: profile };
    }


    return {
      activityLogs: logs,
      settings: fullSettings,
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
    if (data.activityLogs && Array.isArray(data.activityLogs)) await saveLogs(userId, data.activityLogs);
    if (data.settings) await saveSettings(userId, data.settings);
    if (data.unlockedAchievements) await saveUnlockedAchievements(userId, data.unlockedAchievements);

    return true;
  } catch (error) {
    console.error("Errore ripristino:", error);
    throw error;
  }
};
