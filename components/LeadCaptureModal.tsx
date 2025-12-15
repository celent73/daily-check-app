
import React, { useState, useEffect } from 'react';
import { ActivityType } from '../types';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; phone: string; note: string }) => void;
    activityType: ActivityType;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSave, activityType }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setName('');
            setPhone('');
            setNote('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return; // Basic validation
        onSave({ name, phone, note });
    };

    const title = activityType === ActivityType.APPOINTMENTS ? 'Nuovo Appuntamento' : 'Nuovo Contatto';
    const icon = activityType === ActivityType.APPOINTMENTS ? '📅' : '👤';
    const colorClass = activityType === ActivityType.APPOINTMENTS ? 'text-emerald-600' : 'text-blue-600';
    const bgClass = activityType === ActivityType.APPOINTMENTS ? 'bg-emerald-50' : 'bg-blue-50';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">

                {/* Header */}
                <div className={`p-6 ${bgClass} dark:bg-white/5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-4`}>
                    <div className={`h-12 w-12 rounded-2xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-2xl ${colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                            {title}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                            Inserisci i dati
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Nome e Cognome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Mario Rossi"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Telefono</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+39 333 1234567"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Note (Opzionale)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Interessato a..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                        >
                            Salva
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default LeadCaptureModal;
