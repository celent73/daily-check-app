
import React from 'react';
import { ActivityType } from './types';

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.CONTACTS]: 'Contatti effettuati',
  [ActivityType.VIDEOS_SENT]: 'Video 1 inviati',
  [ActivityType.APPOINTMENTS]: 'Appuntamenti effettuati',
  [ActivityType.NEW_CONTRACTS]: 'Nuovi contratti effettuati',
  [ActivityType.NEW_FAMILY_UTILITY]: 'Nuovi Family utility',
};

export const SETTINGS_ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.CONTACTS]: 'Target Contatti',
  [ActivityType.VIDEOS_SENT]: 'Target Video 1',
  [ActivityType.APPOINTMENTS]: 'Target Appuntamenti',
  [ActivityType.NEW_CONTRACTS]: 'Target Contratti',
  [ActivityType.NEW_FAMILY_UTILITY]: 'Target Family Utility',
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  [ActivityType.CONTACTS]: '#3b82f6', // blue-500
  [ActivityType.VIDEOS_SENT]: '#8b5cf6', // violet-500
  [ActivityType.APPOINTMENTS]: '#10b981', // emerald-500
  [ActivityType.NEW_CONTRACTS]: '#f97316', // orange-500
  [ActivityType.NEW_FAMILY_UTILITY]: '#14b8a6', // teal-500
};

export const ACTIVITY_BG_COLORS: Record<ActivityType, string> = {
    [ActivityType.CONTACTS]: 'bg-blue-50',
    [ActivityType.VIDEOS_SENT]: 'bg-violet-50',
    [ActivityType.APPOINTMENTS]: 'bg-emerald-50',
    [ActivityType.NEW_CONTRACTS]: 'bg-orange-50',
    [ActivityType.NEW_FAMILY_UTILITY]: 'bg-teal-50',
};
  
export const ACTIVITY_TEXT_COLORS: Record<ActivityType, string> = {
      [ActivityType.CONTACTS]: 'text-blue-600',
      [ActivityType.VIDEOS_SENT]: 'text-violet-600',
      [ActivityType.APPOINTMENTS]: 'text-emerald-600',
      [ActivityType.NEW_CONTRACTS]: 'text-orange-600',
      [ActivityType.NEW_FAMILY_UTILITY]: 'text-teal-600',
};

// FIX: Replaced JSX with React.createElement to be valid in a .ts file.
// The TypeScript compiler cannot parse JSX syntax in .ts files, which caused numerous errors.
export const activityIcons: Record<ActivityType, React.ReactNode> = {
    [ActivityType.CONTACTS]: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" })),
    [ActivityType.VIDEOS_SENT]: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
    [ActivityType.APPOINTMENTS]: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })),
    [ActivityType.NEW_CONTRACTS]: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })),
    [ActivityType.NEW_FAMILY_UTILITY]: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" })),
};
