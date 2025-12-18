
// FIX: Import React to resolve the 'React' namespace error for React.ReactNode.
import React from 'react';

export enum ActivityType {
  CONTACTS = 'CONTACTS',
  VIDEOS_SENT = 'VIDEOS_SENT',
  APPOINTMENTS = 'APPOINTMENTS',
  NEW_CONTRACTS = 'NEW_CONTRACTS',
  NEW_FAMILY_UTILITY = 'NEW_FAMILY_UTILITY',
}

export enum CommissionStatus {
  PRIVILEGIATO = 'PRIVILEGIATO',
  FAMILY_UTILITY = 'FAMILY_UTILITY'
}

export enum Qualification {
  FAMILY_PRO = 'Family Pro',
  FAMILY_3S = 'Family 3S',
  FAMILY_5S = 'Family 5S',
  PRO_MANAGER = 'Pro Manager',
  REGIONAL_MANAGER = 'Regional Manager',
  NATIONAL_MANAGER = 'National Manager',
  DIRECTOR = 'Director',
  DIRECTOR_PRO = 'Director Pro',
  AMBASSADOR = 'Ambassador',
  PRESIDENT = 'President'
}

export enum ContractType {
  GREEN = 'GREEN', // Azzeriamola Green
  LIGHT = 'LIGHT'  // Union Light
}

export interface ContractDetails {
  [ContractType.GREEN]?: number;
  [ContractType.LIGHT]?: number;
}

export interface ActivityLog {
  date: string;
  counts: {
    [key in ActivityType]?: number;
  };
  contractDetails?: ContractDetails; // Breakdown specific for contracts
  leads?: Lead[]; // List of leads captured on this day
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  note?: string;
  type: ActivityType; // CONTACTS or APPOINTMENTS usually
  date: string;
  status: 'pending' | 'won' | 'lost';
}

export type GoalPeriod = {
  [key in ActivityType]?: number;
};

export interface Goals {
  daily: GoalPeriod;
  weekly: GoalPeriod;
  monthly: GoalPeriod;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  commissionStatus?: CommissionStatus;
  currentQualification?: Qualification | null;
  targetQualification?: Qualification | null;
}

export interface VisionBoardData {
  enabled: boolean;
  title: string;
  targetAmount: number;
  imageData: string | null; // Base64 string
}

export interface NextAppointment {
  title: string;
  date: string; // ISO string representing date and time
}

export interface NotificationSettings {
  goalReached: boolean;
  milestones: boolean;
}

export type Theme = 'light' | 'dark';

export interface AppSettings {
  userProfile: UserProfile;
  goals: Goals;
  notificationSettings: NotificationSettings;
  theme?: Theme;
  commercialMonthStartDay?: number; // Default 16
  isDriveSyncEnabled?: boolean;
  customLabels?: Record<ActivityType, string>;
  visionBoard?: VisionBoardData;
  nextAppointment?: NextAppointment; // New field for smart planning
  enableGoals?: boolean;
  enableCustomLabels?: boolean;
}

export type NotificationVariant = 'success' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationVariant;
}

export interface AppointmentDetails {
  title: string;
  startTime: string;
  endTime: string;
}

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture: string;
}

export interface DriveCredentials {
  apiKey: string;
  clientId: string;
}

export type SyncState = 'IDLE' | 'SYNCING' | 'LOADING' | 'SUCCESS' | 'ERROR';

// Achievements System
export enum AchievementId {
  STACANOVISTA_7_DAYS = 'STACANOVISTA_7_DAYS',
  CENTURIONE_100_CONTACTS_MONTH = 'CENTURIONE_100_CONTACTS_MONTH',
  CLOSER_10_CONTRACTS = 'CLOSER_10_CONTRACTS',
  PERFETTO_ALL_DAILY_GOALS = 'PERFETTO_ALL_DAILY_GOALS',
}

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export type UnlockedAchievements = {
  [key in AchievementId]?: { unlockedAt: string };
};

export interface TeamMemberStats {
  id: string; // generated ID to avoid duplicates
  name: string;
  stats: {
    [key in ActivityType]?: number;
  };
  totalScore: number; // For sorting
  period: string; // YYYY-MM
  generatedAt: string;
}

