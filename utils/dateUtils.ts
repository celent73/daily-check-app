
import { ActivityLog, ActivityType } from '../types';

// A simple date-fns-like getWeek function
const getWeek = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}


export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getWeekIdentifier = (date: Date): string => {
  const year = date.getFullYear();
  const weekNumber = getWeek(date);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

export const getMonthIdentifier = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-M${month.toString().padStart(2, '0')}`;
};

export const getCommercialMonthIdentifier = (date: Date = new Date(), startDay: number = 16): string => {
  const day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  if (day < startDay) {
    // This period belongs to the previous month's start date
    month -= 1;
    if (month < 0) {
      month = 11; // December
      year -= 1;
    }
  }

  // Identifier is based on the starting month of the period
  return `${year}-${String(month + 1).padStart(2, '0')}`;
};

export const formatItalianDate = (date: Date): string => {
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export const getCommercialMonthString = (date: Date = new Date(), startDay: number = 16): string => {
  const dayOfMonth = date.getDate();
  let startDate: Date;
  let endDate: Date;

  if (dayOfMonth < startDay) {
    // Commercial month starts in previous month
    startDate = new Date(date.getFullYear(), date.getMonth() - 1, startDay);
    endDate = new Date(date.getFullYear(), date.getMonth(), startDay - 1);
  } else {
    // Commercial month starts in current month
    startDate = new Date(date.getFullYear(), date.getMonth(), startDay);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, startDay - 1);
  }

  const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  
  // Add year if the years are different or crossing year boundary
  if (startDate.getFullYear() !== endDate.getFullYear()) {
      const startFormatted = startDate.toLocaleDateString('it-IT', { ...formatOptions, year: 'numeric' });
      const endFormatted = endDate.toLocaleDateString('it-IT', { ...formatOptions, year: 'numeric' });
      return `Mese Commerciale: ${startFormatted} - ${endFormatted}`;
  }

  const formattedStartDate = startDate.toLocaleDateString('it-IT', formatOptions);
  const formattedEndDate = endDate.toLocaleDateString('it-IT', formatOptions);

  return `Mese Commerciale: ${formattedStartDate} - ${formattedEndDate}`;
};

export const getDaysUntilCommercialMonthEnd = (date: Date = new Date(), startDay: number = 16): number => {
  const dayOfMonth = date.getDate();
  let endDate: Date;

  if (dayOfMonth < startDay) {
    endDate = new Date(date.getFullYear(), date.getMonth(), startDay - 1);
  } else {
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, startDay - 1);
  }

  const today = new Date(date);
  // Normalize dates to midnight to compare full days
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const timeDiff = endDate.getTime() - today.getTime();
  const daysRemaining = Math.round(timeDiff / (1000 * 60 * 60 * 24));

  // If calculating for "today", and end date is tomorrow, diff is 1 day. 
  // If end date is today, diff is 0. 
  // Usually we want inclusive remaining days or just countdown. 
  // Let's say if today is 15th and end is 15th, remaining is 0 (last day).
  return Math.max(0, daysRemaining);
};

export const getWeekProgress = (date: Date = new Date()): number => {
    // Monday is 1, Sunday is 7
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); 
    return (dayOfWeek / 7) * 100;
};

export const getMonthProgress = (date: Date = new Date()): number => {
    const dayOfMonth = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return (dayOfMonth / daysInMonth) * 100;
};

export const getCommercialMonthRange = (date: Date = new Date(), startDay: number = 16): { start: Date, end: Date } => {
  const dayOfMonth = date.getDate();
  let startDate: Date;
  let endDate: Date;

  if (dayOfMonth < startDay) {
    startDate = new Date(date.getFullYear(), date.getMonth() - 1, startDay);
    endDate = new Date(date.getFullYear(), date.getMonth(), startDay - 1);
  } else {
    startDate = new Date(date.getFullYear(), date.getMonth(), startDay);
    endDate = new Date(date.getFullYear(), date.getMonth() + 1, startDay - 1);
  }
  
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { start: startDate, end: endDate };
};

export const getCommercialMonthProgress = (date: Date = new Date(), startDay: number = 16): number => {
    const { start, end } = getCommercialMonthRange(date, startDay);
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    const totalDuration = end.getTime() - start.getTime() + oneDay;
    if (totalDuration <= 0) return 100;
    
    const elapsedDuration = today.getTime() - start.getTime() + oneDay;
    if (elapsedDuration < 0) return 0;

    const progress = (elapsedDuration / totalDuration) * 100;
    
    return Math.min(progress, 100);
};

export const getYearProgress = (date: Date = new Date()): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear(), 11, 31);
    
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor((date.getTime() - start.getTime()) / oneDay) + 1;
    const daysInYear = Math.floor((end.getTime() - start.getTime()) / oneDay) + 1;

    return (dayOfYear / daysInYear) * 100;
};


export const calculateProgressForActivity = (
  logs: ActivityLog[],
  activity: ActivityType,
  startDay: number = 16
) => {
  const now = new Date();
  const todayStr = getTodayDateString();
  const weekId = getWeekIdentifier(now);
  const monthId = getMonthIdentifier(now);
  const commercialRange = getCommercialMonthRange(now, startDay);

  const daily = logs
    .filter(log => log.date === todayStr)
    .reduce((sum, log) => sum + (log.counts[activity] || 0), 0);
  
  const weekly = logs
    .filter(log => getWeekIdentifier(new Date(log.date)) === weekId)
    .reduce((sum, log) => sum + (log.counts[activity] || 0), 0);

  const monthly = logs
    .filter(log => getMonthIdentifier(new Date(log.date)) === monthId)
    .reduce((sum, log) => sum + (log.counts[activity] || 0), 0);
    
  const commercialMonthly = logs
    .filter(log => {
        const d = new Date(log.date);
        return d.getTime() >= commercialRange.start.getTime() && d.getTime() <= commercialRange.end.getTime();
    })
    .reduce((sum, log) => sum + (log.counts[activity] || 0), 0);
  
  return { daily, weekly, monthly, commercialMonthly };
};
