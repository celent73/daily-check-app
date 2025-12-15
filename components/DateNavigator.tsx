import React, { useRef } from 'react';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onDateChange }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    onDateChange(newDate);
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in dateInputRef.current) {
        (dateInputRef.current as any).showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(new Date(e.target.value));
    }
  };

  const displayDate = currentDate.toLocaleDateString('it-IT', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  const inputDateValue = currentDate.toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 mb-6 shadow-sm flex items-center justify-between max-w-md mx-auto w-full">
        <button onClick={handlePrevDay} className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
          <ChevronLeftIcon />
        </button>

        <div onClick={openDatePicker} className="flex flex-col items-center cursor-pointer group select-none">
          <h3 className="text-md font-bold text-slate-700 dark:text-slate-200 capitalize group-hover:text-blue-600 transition-colors">
            {displayDate}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 group-hover:text-blue-400 transition-colors">
            <CalendarIcon />
            <span>Cambia Data</span>
          </div>
          <input
            ref={dateInputRef}
            type="date"
            value={inputDateValue}
            onChange={handleCalendarChange}
            className="absolute opacity-0 w-0 h-0"
            style={{ pointerEvents: 'none' }}
          />
        </div>

        <button onClick={handleNextDay} className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
          <ChevronRightIcon />
        </button>
    </div>
  );
};

export default DateNavigator;