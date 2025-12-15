
import React, { useMemo, useState } from 'react';
import { ActivityLog, ActivityType, UserProfile } from '../types';
import { getCommercialMonthRange, getCommercialMonthString } from '../utils/dateUtils';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';

// Declare globals loaded via script tags
declare const window: any;

interface MonthlyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityLogs: ActivityLog[];
    commercialMonthStartDay: number;
    userProfile: UserProfile;
    customLabels?: Record<ActivityType, string>;
}

const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
    isOpen, onClose, activityLogs, commercialMonthStartDay, userProfile, customLabels
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const reportData = useMemo(() => {
        const range = getCommercialMonthRange(new Date(), commercialMonthStartDay);
        const filteredLogs = activityLogs.filter(log => {
            const d = new Date(log.date);
            return d.getTime() >= range.start.getTime() && d.getTime() <= range.end.getTime();
        });

        const totals = Object.values(ActivityType).reduce((acc, type) => {
            acc[type] = filteredLogs.reduce((sum, log) => sum + (log.counts[type] || 0), 0);
            return acc;
        }, {} as Record<ActivityType, number>);

        // Conversion Rates
        const contacts = totals[ActivityType.CONTACTS] || 0;
        const appointments = totals[ActivityType.APPOINTMENTS] || 0;
        const contracts = totals[ActivityType.NEW_CONTRACTS] || 0;

        const conversion1 = contacts > 0 ? (appointments / contacts) * 100 : 0;
        const conversion2 = appointments > 0 ? (contracts / appointments) * 100 : 0;
        const conversionTotal = contacts > 0 ? (contracts / contacts) * 100 : 0;

        return { totals, filteredLogs, conversion1, conversion2, conversionTotal, range };
    }, [activityLogs, commercialMonthStartDay]);

    const commercialMonthStr = getCommercialMonthString(new Date(), commercialMonthStartDay);
    const generationDate = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

    const handleExportPDF = async () => {
        setIsExporting(true);

        // Piccola pausa per permettere a React di aggiornare la UI
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const element = document.getElementById('report-content');
            if (!element) {
                throw new Error("Elemento del report non trovato.");
            }

            // 1. Verifica Librerie
            if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
                throw new Error("Librerie PDF non caricate. Ricarica la pagina e riprova.");
            }

            // 2. Determina il costruttore jsPDF corretto
            // jspdf.umd.min.js solitamente espone window.jspdf.jsPDF
            let jsPDFConstructor = window.jspdf.jsPDF;
            if (!jsPDFConstructor && window.jspdf) {
                // A volte è direttamente l'oggetto se la build è diversa
                jsPDFConstructor = window.jspdf;
            }
            if (!jsPDFConstructor && window.jsPDF) {
                // Fallback per vecchie versioni
                jsPDFConstructor = window.jsPDF;
            }

            if (!jsPDFConstructor) {
                throw new Error("Impossibile inizializzare jsPDF.");
            }

            // 3. Genera Canvas
            const canvas = await window.html2canvas(element, {
                scale: 1.5, // Riduco leggermente la scala per evitare crash su mobile/tablet
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.9); // Uso JPEG leggermente compresso per file più leggeri
            const pdf = new jsPDFConstructor('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Report_${userProfile.firstName || 'User'}_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (error) {
            console.error("Errore export PDF:", error);
            alert("Errore PDF: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[70] flex items-center justify-center p-0 sm:p-8 overflow-y-auto">
            <div className="w-full max-w-4xl flex flex-col h-full sm:h-auto sm:max-h-full bg-slate-900 sm:bg-transparent">

                {/* Toolbar - Sticky on mobile */}
                <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur sm:bg-transparent px-4 py-3 sm:px-0 sm:py-0 border-b border-slate-800 sm:border-none flex justify-between items-center mb-0 sm:mb-4 text-white shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">📄</span>
                        <span className="hidden sm:inline">Anteprima Report</span>
                        <span className="sm:hidden">Report</span>
                    </h2>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={onClose}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs sm:text-sm font-medium"
                        >
                            Chiudi
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isExporting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span className="hidden sm:inline">Generazione...</span>
                                    <span className="sm:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span className="hidden sm:inline">Scarica PDF</span>
                                    <span className="sm:hidden">PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Report Paper Container */}
                <div className="flex-1 sm:flex-none sm:bg-slate-800 sm:rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="overflow-auto h-full sm:max-h-[80vh] p-4 sm:p-8 bg-slate-50 flex justify-center sm:block">

                        {/* Actual Printable Content - Min Width to preserve A4 layout on mobile scroll */}
                        <div id="report-content" className="bg-white w-[210mm] min-w-[210mm] min-h-[297mm] p-10 shadow-sm text-slate-800 relative mx-auto">

                            {/* Header */}
                            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-1">REPORT ATTIVITÀ</h1>
                                    <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                                        {commercialMonthStr}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-slate-700">{userProfile.firstName} {userProfile.lastName}</h3>
                                    <p className="text-sm text-slate-500">Generato il: {generationDate}</p>
                                    <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                        DAILY CHECK APP
                                    </div>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-6 mb-10">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">{customLabels?.[ActivityType.CONTACTS] || ACTIVITY_LABELS[ActivityType.CONTACTS]}</p>
                                    <p className="text-4xl font-black text-slate-900">{reportData.totals[ActivityType.CONTACTS]}</p>
                                </div>
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1">{customLabels?.[ActivityType.APPOINTMENTS] || ACTIVITY_LABELS[ActivityType.APPOINTMENTS]}</p>
                                    <p className="text-4xl font-black text-slate-900">{reportData.totals[ActivityType.APPOINTMENTS]}</p>
                                </div>
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                    <p className="text-xs font-bold text-orange-600 uppercase mb-1">{customLabels?.[ActivityType.NEW_CONTRACTS] || ACTIVITY_LABELS[ActivityType.NEW_CONTRACTS]}</p>
                                    <p className="text-4xl font-black text-slate-900">{reportData.totals[ActivityType.NEW_CONTRACTS]}</p>
                                </div>
                            </div>

                            {/* Funnel Visual */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-slate-800 pl-3">Analisi Conversione</h3>
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-600">Contatti ({reportData.totals[ActivityType.CONTACTS]})</span>
                                        <span className="text-sm font-bold text-slate-600">100%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-4 rounded-full mb-6">
                                        <div className="bg-blue-500 h-4 rounded-full w-full"></div>
                                    </div>

                                    <div className="flex items-center justify-between mb-2 px-4">
                                        <span className="text-sm font-bold text-slate-600">Appuntamenti ({reportData.totals[ActivityType.APPOINTMENTS]})</span>
                                        <span className="text-sm font-bold text-blue-600">{reportData.conversion1.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-4 rounded-full mb-6 mx-4" style={{ width: 'calc(100% - 2rem)' }}>
                                        <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${reportData.conversion1}%` }}></div>
                                    </div>

                                    <div className="flex items-center justify-between mb-2 px-8">
                                        <span className="text-sm font-bold text-slate-600">Contratti ({reportData.totals[ActivityType.NEW_CONTRACTS]})</span>
                                        <span className="text-sm font-bold text-emerald-600">{reportData.conversion2.toFixed(1)}% <span className="text-xs text-slate-400 font-normal">(da appuntamento)</span></span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-4 rounded-full mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                                        <div className="bg-orange-500 h-4 rounded-full" style={{ width: `${reportData.conversionTotal}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Stats Grid */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-slate-800 pl-3">Dettaglio Attività</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.values(ActivityType).map(type => (
                                        <div key={type} className="flex items-center justify-between p-3 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="text-slate-400 scale-75" style={{ color: ACTIVITY_COLORS[type] }}>
                                                    {activityIcons[type]}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">
                                                    {customLabels?.[type] || ACTIVITY_LABELS[type]}
                                                </span>
                                            </div>
                                            <span className="font-bold text-slate-900 text-lg">{reportData.totals[type]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Logs Table (Last 10 entries or summary) */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-slate-800 pl-3">Registro Giornaliero (Top Performance)</h3>
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-600">
                                            <th className="p-3 rounded-l-lg">Data</th>
                                            <th className="p-3">Contatti</th>
                                            <th className="p-3">Appuntamenti</th>
                                            <th className="p-3 rounded-r-lg">Contratti</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.filteredLogs
                                            .sort((a, b) => (b.counts[ActivityType.NEW_CONTRACTS] || 0) - (a.counts[ActivityType.NEW_CONTRACTS] || 0)) // Sort by best contract days
                                            .slice(0, 8) // Take top 8
                                            .map((log, idx) => (
                                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                                                    <td className="p-3 font-medium text-slate-800">
                                                        {new Date(log.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                                                    </td>
                                                    <td className="p-3 text-slate-900 font-bold">{log.counts[ActivityType.CONTACTS] || 0}</td>
                                                    <td className="p-3 text-slate-900 font-bold">{log.counts[ActivityType.APPOINTMENTS] || 0}</td>
                                                    <td className="p-3 font-bold text-orange-600">{log.counts[ActivityType.NEW_CONTRACTS] || 0}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <p className="text-xs text-center text-slate-400 mt-4 italic">
                                    * Vengono mostrate le giornate con le performance migliori del periodo.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="absolute bottom-10 left-10 right-10 border-t border-slate-200 pt-4 flex justify-between items-center">
                                <div className="text-xs text-slate-400">
                                    Generato con Daily Check App
                                </div>
                                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                    BE UNSTOPPABLE
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReportModal;
