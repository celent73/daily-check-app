
import React, { useState, useEffect } from 'react';
import { NextAppointment } from '../types';

interface NextAppointmentWidgetProps {
  appointment?: NextAppointment;
  onOpenScheduler?: () => void;
}

const NextAppointmentWidget: React.FC<NextAppointmentWidgetProps> = ({ appointment, onOpenScheduler }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!appointment) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const eventTime = new Date(appointment.date);
      const diff = eventTime.getTime() - now.getTime();

      if (diff <= 0) {
        return "In corso o Passato";
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Set urgent if less than 15 minutes
      setIsUrgent(diff < 15 * 60 * 1000);

      if (days > 0) {
        return `${days}g ${hours}h`;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initial call
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [appointment]);

  if (!appointment) {
      return (
        <button 
            onClick={onOpenScheduler}
            className="w-full mb-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center gap-3 text-slate-400 dark:text-slate-500 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
        >
            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
                Pianifica Prossimo Step
            </span>
        </button>
      );
  }

  return (
    <div className={`mb-4 p-4 rounded-2xl border-2 shadow-lg relative overflow-hidden transition-colors duration-500 ${
        isUrgent 
        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' 
        : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
    }`}>
        {/* Animated background bar */}
        {isUrgent && (
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse"></div>
        )}

        <div className="flex justify-between items-center relative z-10">
            <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                    Prossimo Appuntamento
                </p>
                <h4 className="font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[180px] sm:max-w-xs">
                    {appointment.title}
                </h4>
            </div>
            <div className={`text-right ${isUrgent ? 'animate-pulse' : ''}`}>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Tra
                </p>
                <p className={`text-2xl font-black font-mono tracking-tight ${
                    isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}>
                    {timeLeft}
                </p>
            </div>
        </div>
    </div>
  );
};

export default NextAppointmentWidget;
