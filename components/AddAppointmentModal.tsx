
import React, { useState } from 'react';
import { NextAppointment } from '../types';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCompleted: () => void;
  onScheduleFuture: (appointment: NextAppointment) => void;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onLogCompleted, onScheduleFuture }) => {
  const [step, setStep] = useState<'choice' | 'schedule'>('choice');
  
  // Schedule Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');

  if (!isOpen) return null;

  const handleReset = () => {
      setStep('choice');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00');
      onClose();
  }

  const handleLogCompleted = () => {
      onLogCompleted();
      handleReset();
  };

  const handleAddToCalendar = () => {
      if (!title || !date || !time) return;

      const startDate = new Date(`${date}T${time}`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration default

      const startStr = startDate.toISOString().replace(/-|:|\.\d\d\d/g,"");
      const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g,"");

      // Generate Google Calendar Link
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}`;
      
      // Open Calendar
      window.open(googleUrl, '_blank');

      // Save to App State
      onScheduleFuture({
          title,
          date: startDate.toISOString()
      });

      handleReset();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={handleReset}>
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden animate-scale-up" 
        onClick={e => e.stopPropagation()}
      >
        
        {step === 'choice' && (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Gestione Appuntamento</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Cosa vuoi fare?</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={handleLogCompleted}
                        className="w-full group relative overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 hover:border-emerald-500 rounded-2xl p-4 text-left transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                ✅
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Registra Effettuato</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Aggiungi +1 alle statistiche di oggi</p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => setStep('schedule')}
                        className="w-full group relative overflow-hidden bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 hover:border-blue-500 rounded-2xl p-4 text-left transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                📅
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Pianifica Nuovo</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Salva in agenda e imposta timer</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        )}

        {step === 'schedule' && (
            <div>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-800 dark:text-white">Pianifica Appuntamento</h3>
                    <button onClick={() => setStep('choice')} className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">Indietro</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Titolo</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Es. Zoom con Marco"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Data</label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Ora</label>
                            <input 
                                type="time" 
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                    <button 
                        onClick={handleAddToCalendar}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <span>📆</span> Aggiungi al Calendario
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AddAppointmentModal;
