
import React, { useState } from 'react';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    if (!isOpen) return null;

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday, etc.
        let day = new Date(year, month, 1).getDay();
        // Adjust for Monday start (Monday=0, Sunday=6)
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const monthName = viewDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onSelectDate(newDate);
        onClose();
    };

    const daysArray = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        daysArray.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    const isSelected = (day: number) => {
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === viewDate.getMonth() &&
            selectedDate.getFullYear() === viewDate.getFullYear();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === viewDate.getMonth() &&
            today.getFullYear() === viewDate.getFullYear();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-scale-up border border-slate-100 dark:border-slate-700">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
                        {monthName}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4 text-center">
                    {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                        <div key={d} className="text-xs font-bold text-slate-400 uppercase">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {daysArray.map((day, idx) => (
                        <div key={idx} className="aspect-square flex items-center justify-center">
                            {day ? (
                                <button
                                    onClick={() => handleDayClick(day)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative ${isSelected(day)
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : 'hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        } ${isToday(day) && !isSelected(day) ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30' : ''}`}
                                >
                                    {day}
                                    {isToday(day) && (
                                        <span className="absolute -bottom-1 w-1 h-1 bg-current rounded-full opacity-50"></span>
                                    )}
                                </button>
                            ) : (
                                <div />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                    <button onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest">
                        Chiudi
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CalendarModal;
