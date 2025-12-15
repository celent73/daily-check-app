
import React from 'react';
import jsPDF from 'jspdf';
import { getTodayDateString } from '../utils/dateUtils';

interface EarningsWidgetProps {
    dailyEarnings: number;
    monthlyEarnings: number;
}

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const EarningsWidget: React.FC<EarningsWidgetProps> = ({ dailyEarnings, monthlyEarnings }) => {

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const today = getTodayDateString();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Riepilogo Guadagni", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Data: ${today}`, 20, 30);

        // Content
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Guadagni Giornalieri:", 20, 50);
        doc.setFont("helvetica", "bold");
        doc.text(`€ ${dailyEarnings.toFixed(2)}`, 160, 50, { align: 'right' });

        doc.setFont("helvetica", "normal");
        doc.text("Guadagni Mensili (Stimati):", 20, 65);
        doc.setFont("helvetica", "bold");
        doc.text(`€ ${monthlyEarnings.toFixed(2)}`, 160, 65, { align: 'right' });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "italic");
        doc.text("Generato da Daily Check App", 20, 280);

        doc.save(`guadagni_${today}.pdf`);
    };

    return (
        <div className="bg-white dark:bg-black rounded-2xl p-5 shadow-lg mb-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden group">

            {/* Shine Effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white dark:to-slate-600 opacity-20 group-hover:animate-shine" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20 text-white animate-pulse-slow">
                            <WalletIcon />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Riepilogo Guadagni</p>
                    </div>

                    <button
                        onClick={handleExportPDF}
                        className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                        title="Esporta PDF"
                    >
                        <DownloadIcon />
                    </button>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-medium text-slate-400 mb-1">OGGI</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">€{dailyEarnings.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400 mb-1">MESE</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">€{monthlyEarnings.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsWidget;
