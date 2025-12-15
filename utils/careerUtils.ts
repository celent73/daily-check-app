import { ActivityLog, ActivityType } from '../types';

export interface CareerLevel {
  name: string;
  minClients: number;
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
}

const CAREER_LEVELS: CareerLevel[] = [
  { name: 'Family Utility', minClients: 0 },
  { name: 'Consulente Junior', minClients: 11 },
  { name: 'Consulente Senior', minClients: 31 },
  { name: 'Team Leader', minClients: 61 },
  { name: 'Manager', minClients: 101 },
  { name: 'Top Manager', minClients: 201 },
];

export const calculateCareerStatus = (logs: ActivityLog[]): CareerStatusInfo => {
  const totalContracts = logs.reduce((sum, log) => {
    return sum + (log.counts[ActivityType.NEW_CONTRACTS] || 0);
  }, 0);

  const totalClients = logs.reduce((sum, log) => {
    const contracts = log.counts[ActivityType.NEW_CONTRACTS] || 0;
    // Family Utility excluded from career progress calculation
    return sum + contracts;
  }, 0);

  let currentLevel: CareerLevel = CAREER_LEVELS[0];
  let nextLevel: CareerLevel | null = null;
  let specialStatus: 'family_pro' | undefined = undefined;

  for (let i = CAREER_LEVELS.length - 1; i >= 0; i--) {
    if (totalClients >= CAREER_LEVELS[i].minClients) {
      currentLevel = CAREER_LEVELS[i];
      if (i < CAREER_LEVELS.length - 1) {
        nextLevel = CAREER_LEVELS[i + 1];
      }
      break;
    }
  }

  const baseLevelName = currentLevel.name;

  // Special condition for "Family Pro"
  // If contracts are 10 or more, the title becomes "Family Pro"
  // replacing "Family Utility" and "Consulente Junior".
  if ((baseLevelName === 'Family Utility' || baseLevelName === 'Consulente Junior') && totalContracts >= 10) {
    currentLevel = { ...currentLevel, name: 'Family Pro' };
    specialStatus = 'family_pro';
  }


  const isMaxLevel = !nextLevel;
  let progressPercentage = 100;
  let clientsForNextLevel = 0;

  if (nextLevel) {
    const clientsInCurrentLevel = totalClients - currentLevel.minClients;
    const clientsNeededForNextLevel = nextLevel.minClients - currentLevel.minClients;
    progressPercentage = (clientsInCurrentLevel / clientsNeededForNextLevel) * 100;
    clientsForNextLevel = nextLevel.minClients;
  }

  return {
    currentLevel,
    nextLevel,
    totalClients,
    totalContracts,
    progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
    clientsForNextLevel,
    isMaxLevel,
    specialStatus,
  };
};