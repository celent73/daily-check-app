
import React, { useState } from 'react';

// NOTE: This component is largely deprecated as Google Sign-In has been removed.
// Kept as a placeholder to prevent import errors in case it's referenced elsewhere.

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

interface StepProps {
    num: number;
    title: string;
    children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ num, title, children }) => (
    <div className="flex items-start space-x-4 p-5">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-xl shadow-md">{num}</div>
        <div className="flex-grow pt-1">
            <h2 className="font-bold text-lg text-slate-800">{title}</h2>
            <div className="text-sm text-slate-600 space-y-3 mt-2">{children}</div>
        </div>
    </div>
);


const GoogleConfigHelper: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex items-center justify-center p-4 font-sans animate-fade-in" onClick={onClose}>
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
                <h1 className="text-2xl font-bold text-slate-800">Google Access Disabled</h1>
                <p className="text-slate-600 mt-4">
                    La funzionalità di accesso con Google è stata disabilitata in questa versione.
                </p>
                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    Chiudi
                </button>
            </div>
        </div>
    );
};

export default GoogleConfigHelper;
