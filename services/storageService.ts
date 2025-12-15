// ============================================================================
// FILE: services/storageService.ts (Sostituisci tutto con questo)
// ============================================================================

import { ActivityLog, AppSettings, UnlockedAchievements } from '../types';
import { db } from './firebase';
import {
  collection, doc, setDoc, getDoc, getDocs, deleteDoc
} from "firebase/firestore";

const ACTIVITY_COLLECTION = "activityLogs";
const SETTINGS_COLLECTION = "settings";
const ACHIEVEMENTS_COLLECTION = "unlockedAchievements";

// ---------------------------------------------------------------------------
// GESTIONE LOG ATTIVITÀ
// ---------------------------------------------------------------------------

export const loadLogs = async (userId: string | null): Promise<ActivityLog[]> => {
  if (!userId) {
    // Gestione LocalStorage (per utente anonimo o fallback)
    const localData = localStorage.getItem('daily-check-app-logs');
    return localData ? JSON.parse(localData) : [];
  }

  const ref = collection(db, `${ACTIVITY_COLLECTION}/${userId}/logs`);
  const snapshot = await getDocs(ref);
  const logs: ActivityLog[] = [];
  snapshot.forEach(doc => logs.push(doc.data() as ActivityLog));
  return logs;
};

export const saveLogs = async (userId: string | null, logs: ActivityLog[]) => {
  if (!userId) {
    // Gestione LocalStorage
    localStorage.setItem('daily-check-app-logs', JSON.stringify(logs));
    return;
  }
  
  const ref = collection(db, `${ACTIVITY_COLLECTION}/${userId}/logs`);
  for (const log of logs) {
    const docRef = doc(ref, log.id); // Assumendo che ogni log abbia un ID univoco
    await setDoc(docRef, log);
  }
};

export const clearLogs = async (userId: string | null) => {
  if (!userId) {
    // Gestione LocalStorage
    localStorage.removeItem('daily-check-app-logs');
    return;
  }
  
  const ref = collection(db, `${ACTIVITY_COLLECTION}/${userId}/logs`);
  const snapshot = await getDocs(ref);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
};

// ---------------------------------------------------------------------------
// GESTIONE IMPOSTAZIONI
// ---------------------------------------------------------------------------

export const loadSettings = async (userId: string | null): Promise<AppSettings | null> => {
  if (!userId) {
    // Gestione LocalStorage
    const localData = localStorage.getItem('daily-check-app-settings');
    return localData ? JSON.parse(localData) : null;
  }
  
  const ref = doc(db, SETTINGS_COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as AppSettings;
};

export const saveSettings = async (userId: string | null, settings: AppSettings) => {
  if (!userId) {
    // Gestione LocalStorage
    localStorage.setItem('daily-check-app-settings', JSON.stringify(settings));
    return;
  }
  
  const ref = doc(db, SETTINGS_COLLECTION, userId);
  await setDoc(ref, settings);
};

// ---------------------------------------------------------------------------
// GESTIONE OBIETTIVI (ACHIEVEMENTS)
// ---------------------------------------------------------------------------

export const loadUnlockedAchievements = async (userId: string | null): Promise<UnlockedAchievements> => {
  if (!userId) {
    // Gestione LocalStorage
    const localData = localStorage.getItem('daily-check-app-achievements');
    return localData ? JSON.parse(localData) : {};
  }
  
  const ref = doc(db, ACHIEVEMENTS_COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  return snap.data() as UnlockedAchievements;
};

export const saveUnlockedAchievements = async (userId: string | null, achievements: UnlockedAchievements) => {
  if (!userId) {
    // Gestione LocalStorage
    localStorage.setItem('daily-check-app-achievements', JSON.stringify(achievements));
    return;
  }
  
  const ref = doc(db, ACHIEVEMENTS_COLLECTION, userId);
  await setDoc(ref, achievements);
};

// ---------------------------------------------------------------------------
// BACKUP & RESTORE (Risolve gli errori getBackupData/restoreBackupData)
// ---------------------------------------------------------------------------

export const getBackupData = async (userId: string | null) => {
  if (!userId) return null; // Non permettiamo backup anonimi in questo contesto
  
  try {
    const logs = await loadLogs(userId);
    const settings = await loadSettings(userId);
    const unlockedAchievements = await loadUnlockedAchievements(userId);

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
  if (!userId || !data) return;

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