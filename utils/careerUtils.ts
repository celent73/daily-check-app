import { ActivityLog, ActivityType, Qualification } from '../types';

export interface CareerLevel {
  name: string;
  minClients: number;
  qualificationValue?: Qualification; // Link to the enum
}

export interface CareerStatusInfo {
  currentLevel: CareerLevel;
  nextLevel: CareerLevel | null;
  totalClients: number;
  totalContracts: number;
  progressPercentage: number;
  clientsForNextLevel: number;
  isMaxLevel: boolean;
  specialStatus?: 'family_pro';
  isManualOverride?: boolean; // New flag
}

// Extended to include all Qualification levels
// Note: High-tier levels have high placeholders for minClients as the logic is currently client-based only.
const CAREER_LEVELS: CareerLevel[] = [
  { name: 'Family Utility', minClients: 0 },
  { name: 'Consulente Junior', minClients: 11 },
  { name: 'Consulente Senior', minClients: 31 },
  { name: 'Team Leader', minClients: 61 },
  { name: 'Manager', minClients: 101 },
  { name: 'Top Manager', minClients: 201 },
  { name: Qualification.FAMILY_PRO, minClients: 9991, qualificationValue: Qualification.FAMILY_PRO },
  { name: Qualification.FAMILY_3S, minClients: 9992, qualificationValue: Qualification.FAMILY_3S },
  { name: Qualification.FAMILY_5S, minClients: 9993, qualificationValue: Qualification.FAMILY_5S },
  { name: Qualification.PRO_MANAGER, minClients: 9994, qualificationValue: Qualification.PRO_MANAGER },
  { name: Qualification.REGIONAL_MANAGER, minClients: 9995, qualificationValue: Qualification.REGIONAL_MANAGER },
  { name: Qualification.NATIONAL_MANAGER, minClients: 9996, qualificationValue: Qualification.NATIONAL_MANAGER },
  { name: Qualification.DIRECTOR, minClients: 9997, qualificationValue: Qualification.DIRECTOR },
  { name: Qualification.DIRECTOR_PRO, minClients: 9998, qualificationValue: Qualification.DIRECTOR_PRO },
  { name: Qualification.AMBASSADOR, minClients: 9999, qualificationValue: Qualification.AMBASSADOR },
  { name: Qualification.PRESIDENT, minClients: 10000, qualificationValue: Qualification.PRESIDENT },
];

export const calculateCareerStatus = (logs: ActivityLog[], overrideQualification?: Qualification | null): CareerStatusInfo => {
  const totalContracts = logs.reduce((sum, log) => {
    return sum + (log.counts[ActivityType.NEW_CONTRACTS] || 0);
  }, 0);

  const totalClients = logs.reduce((sum, log) => {
    const contracts = log.counts[ActivityType.NEW_CONTRACTS] || 0;
    // Family Utility excluded from career progress calculation in old logic, but kept here for client count consistency
    return sum + contracts;
  }, 0);

  let currentLevel: CareerLevel = CAREER_LEVELS[0];
  let nextLevel: CareerLevel | null = null;
  let specialStatus: 'family_pro' | undefined = undefined;
  let isManualOverride = false;

  // 1. Determine Level based on Metrics (Standard Logic)
  // We only iterate effectively through the "metric-based" levels (up to Top Manager)
  // because the higher ones have artificial high minClients.
  for (let i = 0; i < CAREER_LEVELS.length; i++) {
    // Only auto-assign up to Top Manager (index 5) based on clients, preserving old logic
    if (i > 5) break;

    if (totalClients >= CAREER_LEVELS[i].minClients) {
      currentLevel = CAREER_LEVELS[i];
      if (i < 5) { // Next level logic only valid within this range for now
        nextLevel = CAREER_LEVELS[i + 1];
      } else {
        nextLevel = null; // Top Manager implies no next "metric-based" level defined yet
      }
    }
  }

  // 2. Special "Family Pro" Logic (Legacy/Specific rule)
  const baseLevelName = currentLevel.name;
  if ((baseLevelName === 'Family Utility' || baseLevelName === 'Consulente Junior') && totalContracts >= 10) {
    // This is essentially "Family Pro" but we map it to the enum if possible
    const familyProLevel = CAREER_LEVELS.find(l => l.qualificationValue === Qualification.FAMILY_PRO);
    if (familyProLevel) {
      currentLevel = familyProLevel;
    } else {
      currentLevel = { ...currentLevel, name: 'Family Pro' };
    }
    specialStatus = 'family_pro';
  }

  // 3. Manual Override Logic
  if (overrideQualification) {
    const forcedLevel = CAREER_LEVELS.find(l => l.name === overrideQualification || l.qualificationValue === overrideQualification);
    if (forcedLevel) {
      currentLevel = forcedLevel;
      isManualOverride = true;
      // If manually set, calculating "next level" is ambiguous without defined rules.
      // We'll try to find the next level in the array, but if it has crazy high requirements, we might want to hide the progress bar.
      const currentIndex = CAREER_LEVELS.indexOf(forcedLevel);
      if (currentIndex !== -1 && currentIndex < CAREER_LEVELS.length - 1) {
        nextLevel = CAREER_LEVELS[currentIndex + 1];
      } else {
        nextLevel = null;
      }
      specialStatus = undefined; // Reset special status if manually overridden
    }
  }

  const isMaxLevel = !nextLevel;
  let progressPercentage = 100;
  let clientsForNextLevel = 0;

  if (nextLevel && !isManualOverride) {
    const clientsInCurrentLevel = totalClients - currentLevel.minClients;
    const clientsNeededForNextLevel = nextLevel.minClients - currentLevel.minClients;
    progressPercentage = (clientsInCurrentLevel / clientsNeededForNextLevel) * 100;
    clientsForNextLevel = nextLevel.minClients;
  } else if (isManualOverride && nextLevel) {
    // If manual, we don't really know the progress because the minClients might be artificial.
    // We can show 0% or 100% or hidden. Let's default to hidden/max level behavior in UI if the gap is huge.
    if (nextLevel.minClients > 9000) {
      // It's one of our placeholder levels
      progressPercentage = 100; // Show full bar or handle in UI
      // actually, maybe better to treating it as 'Max Level' visually if we don't have the data?
    }
  }

  return {
    currentLevel,
    nextLevel,
    totalClients,
    totalContracts,
    progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
    clientsForNextLevel,
    isMaxLevel: isMaxLevel || (isManualOverride && (!nextLevel || nextLevel.minClients > 9000)), // Treat artificial levels as max for now
    specialStatus,
    isManualOverride
  };
};