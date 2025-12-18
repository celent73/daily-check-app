import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLog, ActivityType, AppSettings, Notification, NotificationVariant, UnlockedAchievements, Achievement, Theme, CommissionStatus, ContractType, VisionBoardData, NextAppointment, Qualification } from './types';
import { loadLogs, saveLogs, loadSettings, saveSettings, loadUnlockedAchievements, saveUnlockedAchievements, clearLogs } from './services/storageService';
import { getTodayDateString, calculateProgressForActivity, getCommercialMonthRange } from './utils/dateUtils';
import Header from './components/Header';
import ActivityInput from './components/ActivityInput';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import DeleteDataModal from './components/ConfirmationModal';
import CareerStatus from './components/CareerStatus';
import { ACTIVITY_LABELS } from './constants';
import { calculateCareerStatus } from './utils/careerUtils';
import { checkAndUnlockAchievements } from './utils/achievements';
import ResetGoalsModal from './components/ResetGoalsModal';
import PaywallModal from './components/PaywallModal';
import AchievementsModal from './components/AchievementsModal';
import PowerMode from './components/PowerMode';
import ObjectionHandler from './components/ObjectionHandler';
import SocialShareModal from './components/SocialShareModal';
import MonthlyReportModal from './components/MonthlyReportModal';
import ContractSelectorModal from './components/ContractSelectorModal';
import VisionBoardModal from './components/VisionBoardModal';
import AddAppointmentModal from './components/AddAppointmentModal';
import DetailedGuideModal from './components/DetailedGuideModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import CalendarModal from './components/CalendarModal';

import VoiceSpeedMode from './components/VoiceSpeedMode';
import TeamLeaderboardModal from './components/TeamLeaderboardModal';

const DEFAULT_SETTINGS: AppSettings = {
  userProfile: {
    firstName: '',
    lastName: '',
    commissionStatus: CommissionStatus.PRIVILEGIATO
  },
  goals: {
    daily: {},
    weekly: {},
    monthly: {},
  },
  notificationSettings: {
    goalReached: true,
    milestones: true,
  },
  theme: 'light',
  commercialMonthStartDay: 16,
  customLabels: ACTIVITY_LABELS,
  visionBoard: {
    enabled: true,
    title: '',
    targetAmount: 1000,
    imageData: null
  },
  enableGoals: true,
  enableCustomLabels: true
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" /></svg> },
    info: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" /></svg> }
  };
  const styles = typeStyles[notification.type];
  return (
    <div className={`w-full max-w-xs p-3 mb-2 rounded-2xl shadow-xl animate-scale-up backdrop-blur-md border ${styles.bg} ${styles.text}`} role="alert">
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl bg-white/20`}>{styles.icon}</div>
        <div className="text-sm font-bold">{notification.message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-1 -my-1 text-current opacity-70 hover:opacity-100 rounded-lg p-1.5 inline-flex items-center justify-center h-6 w-6" aria-label="Close"><svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg></button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // App Mounted
  }, []);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Modals state
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'goals' | 'labels' | 'notifications'>('profile');
  const [isDeleteDataModalOpen, setDeleteDataModalOpen] = useState(false);
  const [isResetGoalsModalOpen, setResetGoalsModalOpen] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [isMonthlyReportModalOpen, setIsMonthlyReportModalOpen] = useState(false);
  const [isVisionBoardModalOpen, setIsVisionBoardModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // New "WOW" features state
  const [isPowerModeOpen, setIsPowerModeOpen] = useState(false);
  const [isObjectionHandlerOpen, setIsObjectionHandlerOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);
  const [isContractSelectorModalOpen, setIsContractSelectorModalOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<ActivityType>(ActivityType.CONTACTS);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);

  // State for "Time Machine"
  const [selectedInputDate, setSelectedInputDate] = useState<Date>(new Date());

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLocked, setIsLocked] = useState(false); // Always unlocked
  const [remainingTrialDays] = useState<number | null>(null); // No trial needed
  const [isPremium, setIsPremium] = useState(true); // Always Premium
  const isAnonymous = false;

  const [isInitializing, setIsInitializing] = useState(true);

  // Achievements State
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievements>({});

  // Theme Handling
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  // Derive settings respecting the master toggles
  const effectiveCustomLabels = (settings.enableCustomLabels ?? true)
    ? (settings.customLabels || ACTIVITY_LABELS)
    : ACTIVITY_LABELS;

  const effectiveGoals = (settings.enableGoals ?? true)
    ? settings.goals
    : { daily: {}, weekly: {}, monthly: {} };

  const addNotification = useCallback((message: string, type: NotificationVariant) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleOpenSettings = (tab: 'profile' | 'goals' | 'labels' | 'notifications' = 'profile') => {
    setSettingsInitialTab(tab);
    setSettingsModalOpen(true);
  };

  const loadLocalData = useCallback(async () => {
    const [loadedLogs, loadedSettings, loadedAchievements] = await Promise.all([
      loadLogs(null),
      loadSettings(null),
      loadUnlockedAchievements(null),
    ]);
    setActivityLogs(loadedLogs);
    setSettings(loadedSettings ? { ...DEFAULT_SETTINGS, ...loadedSettings } : DEFAULT_SETTINGS);
    setUnlockedAchievements(loadedAchievements);
    setIsInitializing(false);
  }, []);

  // Load local data on init
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  // Persist settings on change
  useEffect(() => {
    if (!isInitializing) {
      saveSettings(null, settings);
    }
  }, [settings, isInitializing]);



  const toggleTheme = () => {
    const newTheme: Theme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings((prev: AppSettings) => ({ ...prev, theme: newTheme }));
  };



  const checkAndNotify = useCallback((
    oldProgress: { daily: number, weekly: number, monthly: number },
    newProgress: { daily: number, weekly: number, monthly: number },
    goals: AppSettings['goals'],
    activity: ActivityType
  ) => {
    if (settings.enableGoals === false) return;
    const activityLabel = effectiveCustomLabels[activity];
    const periodLabels: Record<'daily' | 'weekly' | 'monthly', string> = {
      daily: 'giornaliero',
      weekly: 'settimanale',
      monthly: 'mensile'
    };
    (['daily', 'weekly', 'monthly'] as const).forEach(period => {
      const goal = goals[period]?.[activity];
      if (!goal || goal <= 0) return;
      const oldP = oldProgress[period];
      const newP = newProgress[period];
      if (settings.notificationSettings.goalReached && newP >= goal && oldP < goal) {
        addNotification(`Congratulazioni! Obiettivo ${periodLabels[period]} raggiunto per "${activityLabel}".`, 'success');
      }
      if (settings.notificationSettings.milestones) {
        const eightyPercent = goal * 0.8;
        if (newP >= eightyPercent && oldP < eightyPercent && newP < goal) {
          addNotification(`Sei vicino! Mancano ${goal - newP} per l'obiettivo ${periodLabels[period]} di "${activityLabel}".`, 'info');
        }
        const fiftyPercent = goal * 0.5;
        if (newP >= fiftyPercent && oldP < fiftyPercent && newP < eightyPercent) {
          addNotification(`Metà strada! Sei a buon punto per l'obiettivo ${periodLabels[period]} di "${activityLabel}".`, 'info');
        }
      }
    });
  }, [addNotification, settings.notificationSettings, effectiveCustomLabels, settings.enableGoals]);

  const updateActivityLog = useCallback((activity: ActivityType, change: number, dateStr: string, contractType?: ContractType) => {
    setActivityLogs(prevLogs => {
      const oldProgress = calculateProgressForActivity(prevLogs, activity, settings.commercialMonthStartDay);
      const newLogs = prevLogs.map(log => {
        if (log.date === dateStr) {
          return {
            ...log,
            counts: { ...log.counts },
            contractDetails: log.contractDetails ? { ...log.contractDetails } : undefined,
            leads: log.leads ? [...log.leads] : undefined
          };
        }
        return log;
      });
      let dateLog = newLogs.find(log => log.date === dateStr);
      if (!dateLog) {
        dateLog = { date: dateStr, counts: {} };
        newLogs.push(dateLog);
      }
      const currentCount = dateLog.counts[activity] || 0;
      const newCount = Math.max(0, currentCount + change);
      dateLog.counts[activity] = newCount;

      if (contractType) {
        if (!dateLog.contractDetails) dateLog.contractDetails = {};
        const currentTypeCount = dateLog.contractDetails[contractType] || 0;
        dateLog.contractDetails[contractType] = Math.max(0, currentTypeCount + change);
      }

      const newProgress = calculateProgressForActivity(newLogs, activity, settings.commercialMonthStartDay);
      if (change > 0) {
        checkAndNotify(oldProgress, newProgress, effectiveGoals, activity);
      }
      const { newlyUnlocked, updatedAchievements } = checkAndUnlockAchievements(newLogs, settings, unlockedAchievements);
      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(updatedAchievements);
        newlyUnlocked.forEach((achievement: Achievement) => {
          addNotification(`Traguardo Sbloccato: ${achievement.name}!`, 'success');
        });
      }
      return newLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, [settings, checkAndNotify, unlockedAchievements, addNotification, effectiveGoals]);

  const handleUpdateActivity = (activity: ActivityType, change: number, dateStr: string = getTodayDateString()) => {
    updateActivityLog(activity, change, dateStr);
  };

  const handleContractSelection = (type: ContractType) => {
    const dateStr = selectedInputDate.toISOString().split('T')[0];
    updateActivityLog(ActivityType.NEW_CONTRACTS, 1, dateStr, type);
    setIsContractSelectorModalOpen(false);
    addNotification("Contratto registrato e guadagno calcolato!", "success");
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleSaveVisionBoard = (visionData: VisionBoardData) => {
    setSettings((prev: AppSettings) => ({ ...prev, visionBoard: visionData }));
  };

  const handleAppointmentSchedule = (appointment: NextAppointment) => {
    setSettings((prev: AppSettings) => ({ ...prev, nextAppointment: appointment }));
    addNotification("Appuntamento salvato! Conto alla rovescia avviato.", "success");
  };

  const handleClearAllData = async () => {
    await clearLogs(null);
    setActivityLogs([]);
    setDeleteDataModalOpen(false);
    addNotification('Tutto lo storico delle attività è stato cancellato.', 'success');
  };

  const handleDeleteCurrentMonth = () => {
    const { start, end } = getCommercialMonthRange(new Date(), settings.commercialMonthStartDay);
    const startTime = start.getTime();
    const endTime = end.getTime();
    setActivityLogs(prevLogs => {
      const filteredLogs = prevLogs.filter(log => {
        const logTime = new Date(log.date).getTime();
        return logTime < startTime || logTime > endTime;
      });
      return filteredLogs;
    });
    setDeleteDataModalOpen(false);
    addNotification('Dati del mese commerciale corrente eliminati.', 'success');
  };

  const handleResetGoals = () => {
    setSettings((prev: AppSettings) => ({ ...prev, goals: { daily: {}, weekly: {}, monthly: {} } }));
    setResetGoalsModalOpen(false);
    addNotification('Obiettivi reimpostati per il nuovo mese!', 'success');
  };

  const handleUnlockApp = () => {
    setIsPaywallModalOpen(false);
    addNotification('Il pagamento viene processato... l\'app si sbloccherà automaticamente.', 'info');
  };

  const handleOpenLeadCapture = (type: ActivityType) => {
    setLeadCaptureType(type);
    setIsLeadCaptureModalOpen(true);
  };

  const handleSaveLead = (leadData: { name: string; phone: string; note: string }) => {
    const dateStr = selectedInputDate.toISOString().split('T')[0];
    setActivityLogs(prevLogs => {
      const newLogs = [...prevLogs];
      let dateLog = newLogs.find(log => log.date === dateStr);
      if (!dateLog) {
        dateLog = { date: dateStr, counts: {} };
        newLogs.push(dateLog);
      }
      if (!dateLog.leads) dateLog.leads = [];
      dateLog.leads.push({
        id: Date.now().toString(),
        type: leadCaptureType,
        date: new Date().toISOString(),
        status: 'pending',
        ...leadData
      });
      const currentCount = dateLog.counts[leadCaptureType] || 0;
      dateLog.counts[leadCaptureType] = currentCount + 1;
      return newLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    setIsLeadCaptureModalOpen(false);
    addNotification(`${leadCaptureType === ActivityType.APPOINTMENTS ? 'Appuntamento' : 'Contatto'} salvato con successo!`, 'success');
  };

  const handleUpdateQualification = (newQualification: Qualification) => {
    setSettings(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        currentQualification: newQualification
      }
    }));
    addNotification(`Qualifica aggiornata a: ${newQualification} 🚀`, 'success');
  };

  const COMMISSION_RATES = useMemo(() => {
    return {
      [CommissionStatus.PRIVILEGIATO]: { [ContractType.GREEN]: 25, [ContractType.LIGHT]: 12.5 },
      [CommissionStatus.FAMILY_UTILITY]: { [ContractType.GREEN]: 50, [ContractType.LIGHT]: 25 }
    };
  }, []);

  const { dailyEarnings, monthlyEarnings } = useMemo(() => {
    const selectedDateStr = selectedInputDate.toISOString().split('T')[0];
    const { start, end } = getCommercialMonthRange(selectedInputDate, settings.commercialMonthStartDay);
    const userStatus = settings.userProfile.commissionStatus || CommissionStatus.PRIVILEGIATO;
    const rates = COMMISSION_RATES[userStatus];
    let dailyTotal = 0;
    let monthlyTotal = 0;
    activityLogs.forEach(log => {
      const logDate = new Date(log.date);
      const breakdown = log.contractDetails || {};
      const greenCount = breakdown[ContractType.GREEN] || 0;
      const lightCount = breakdown[ContractType.LIGHT] || 0;
      const logEarnings = (greenCount * rates[ContractType.GREEN]) + (lightCount * rates[ContractType.LIGHT]);
      if (log.date === selectedDateStr) {
        dailyTotal += logEarnings;
      }
      if (logDate.getTime() >= start.getTime() && logDate.getTime() <= end.getTime()) {
        monthlyTotal += logEarnings;
      }
    });
    return { dailyEarnings: dailyTotal, monthlyEarnings: monthlyTotal };
  }, [activityLogs, selectedInputDate, settings.commercialMonthStartDay, settings.userProfile.commissionStatus, COMMISSION_RATES]);

  const selectedDateStr = selectedInputDate.toISOString().split('T')[0];
  const selectedDateLog = activityLogs.find(log => log.date === selectedDateStr);
  const careerStatus = useMemo(() => calculateCareerStatus(activityLogs), [activityLogs]);
  const commercialMonthTotals = useMemo(() => {
    const range = getCommercialMonthRange(selectedInputDate, settings.commercialMonthStartDay);
    const totals: { [key in ActivityType]?: number } = {};
    activityLogs.forEach(log => {
      const d = new Date(log.date);
      if (d.getTime() >= range.start.getTime() && d.getTime() <= range.end.getTime()) {
        Object.keys(log.counts).forEach((key) => {
          const activity = key as ActivityType;
          totals[activity] = (totals[activity] || 0) + (log.counts[activity] || 0);
        });
      }
    });
    return totals;
  }, [activityLogs, selectedInputDate, settings.commercialMonthStartDay]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto">
            <NotificationItem notification={n} onClose={() => removeNotification(n.id)} />
          </div>
        ))}
      </div>
      <div className="min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <Header
          userProfile={settings.userProfile}
          onOpenSettings={() => handleOpenSettings('profile')}
          onOpenDeleteDataModal={() => setDeleteDataModalOpen(true)}
          careerStatus={careerStatus}
          isPremium={isPremium}
          remainingTrialDays={remainingTrialDays}
          onOpenPaywall={() => setIsPaywallModalOpen(true)}
          toggleTheme={toggleTheme}
          currentTheme={settings.theme || 'light'}
          onOpenMonthlyReport={() => setIsMonthlyReportModalOpen(true)}
          onOpenTeamChallenge={() => setIsTeamModalOpen(true)}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ActivityInput
                todayCounts={selectedDateLog?.counts}
                monthTotals={commercialMonthTotals}
                onUpdateActivity={handleUpdateActivity}
                onOpenPowerMode={() => setIsPowerModeOpen(true)}
                onOpenObjectionHandler={() => setIsObjectionHandlerOpen(true)}
                onOpenSocialShare={() => setIsSocialShareModalOpen(true)}
                onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
                selectedDate={selectedInputDate}
                onDateChange={setSelectedInputDate}
                commercialMonthStartDay={settings.commercialMonthStartDay || 16}
                customLabels={effectiveCustomLabels}
                dailyEarnings={dailyEarnings}
                monthlyEarnings={monthlyEarnings}
                onOpenContractModal={() => setIsContractSelectorModalOpen(true)}
                onOpenAppointmentModal={() => setIsAddAppointmentModalOpen(true)}
                visionBoardData={settings.visionBoard}
                nextAppointment={settings.nextAppointment}
                onOpenSettings={handleOpenSettings}
                onOpenVisionBoardSettings={() => setIsVisionBoardModalOpen(true)}
                onOpenLeadCapture={handleOpenLeadCapture}
                onOpenCalendar={() => setIsCalendarModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Dashboard
                activityLogs={activityLogs}
                goals={effectiveGoals}
                userProfile={settings.userProfile}
                onOpenAchievements={() => setAchievementsModalOpen(true)}
                commercialMonthStartDay={settings.commercialMonthStartDay || 16}
                customLabels={effectiveCustomLabels}
                onUpdateQualification={handleUpdateQualification}
              />
              <CareerStatus activityLogs={activityLogs} />
            </div>
          </div>
        </main>

        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onSaveSettings={handleSaveSettings}
          currentSettings={settings}
          addNotification={addNotification}
          onDataRestore={loadLocalData}
          initialTab={settingsInitialTab}
        />
        <VisionBoardModal
          isOpen={isVisionBoardModalOpen}
          onClose={() => setIsVisionBoardModalOpen(false)}
          onSave={handleSaveVisionBoard}
          currentData={settings.visionBoard}
          addNotification={addNotification}
        />
        <AddAppointmentModal
          isOpen={isAddAppointmentModalOpen}
          onClose={() => setIsAddAppointmentModalOpen(false)}
          onLogCompleted={() => {
            setIsAddAppointmentModalOpen(false);
            handleOpenLeadCapture(ActivityType.APPOINTMENTS);
          }}
          onScheduleFuture={handleAppointmentSchedule}
        />
        <LeadCaptureModal
          isOpen={isLeadCaptureModalOpen}
          onClose={() => setIsLeadCaptureModalOpen(false)}
          onSave={handleSaveLead}
          activityType={leadCaptureType}
        />
        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          selectedDate={selectedInputDate}
          onSelectDate={setSelectedInputDate}
        />
        <DeleteDataModal
          isOpen={isDeleteDataModalOpen}
          onClose={() => setDeleteDataModalOpen(false)}
          onConfirmDeleteMonth={handleDeleteCurrentMonth}
          onConfirmDeleteAll={handleClearAllData}
        />
        <ResetGoalsModal
          isOpen={isResetGoalsModalOpen}
          onClose={() => setResetGoalsModalOpen(false)}
          onConfirm={handleResetGoals}
        />
        <PaywallModal
          isOpen={(isLocked && !isAnonymous) || isPaywallModalOpen}
          onUnlock={handleUnlockApp}
          onClose={() => setIsPaywallModalOpen(false)}
          isClosable={!isLocked || isAnonymous}
        />
        <AchievementsModal
          isOpen={isAchievementsModalOpen}
          onClose={() => setAchievementsModalOpen(false)}
          unlockedAchievements={unlockedAchievements}
        />
        <MonthlyReportModal
          isOpen={isMonthlyReportModalOpen}
          onClose={() => setIsMonthlyReportModalOpen(false)}
          activityLogs={activityLogs}
          commercialMonthStartDay={settings.commercialMonthStartDay || 16}
          userProfile={settings.userProfile}
          customLabels={effectiveCustomLabels}
        />
        <ContractSelectorModal
          isOpen={isContractSelectorModalOpen}
          onClose={() => setIsContractSelectorModalOpen(false)}
          onSelectContract={handleContractSelection}
          userStatus={settings.userProfile.commissionStatus || CommissionStatus.PRIVILEGIATO}
        />
        <DetailedGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
        <TeamLeaderboardModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          activityLogs={activityLogs}
          userName={`${settings.userProfile.firstName} ${settings.userProfile.lastName}`.trim()}
          commercialStartDay={settings.commercialMonthStartDay || 16}
        />

        {/* WOW Features */}
        <PowerMode
          isOpen={isPowerModeOpen}
          onClose={() => setIsPowerModeOpen(false)}
          onLogContact={() => handleUpdateActivity(ActivityType.CONTACTS, 1, getTodayDateString())}
        />
        <ObjectionHandler
          isOpen={isObjectionHandlerOpen}
          onClose={() => setIsObjectionHandlerOpen(false)}
        />
        <VoiceSpeedMode
          isOpen={isVoiceModeOpen}
          onClose={() => setIsVoiceModeOpen(false)}
          onUpdateActivity={(activity, count) => handleUpdateActivity(activity, count, selectedInputDate.toISOString().split('T')[0])}
        />
        <SocialShareModal
          isOpen={isSocialShareModalOpen}
          onClose={() => setIsSocialShareModalOpen(false)}
          todayCounts={selectedDateLog?.counts || {}}
          userProfile={settings.userProfile}
          customLabels={effectiveCustomLabels}
        />
      </div>
    </>
  );
};

export default App;