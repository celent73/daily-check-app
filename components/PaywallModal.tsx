import React, { useState } from 'react';
import { getStripeCheckoutUrl } from '../services/stripeService';
// import { auth } from '../services/firebase';

interface PaywallModalProps {
    isOpen: boolean;
    onUnlock: () => void; // Potrebbe non essere più necessario, ma lo teniamo per ora
    onClose: () => void;
    isClosable: boolean;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, isClosable }) => {
    const [loading, setLoading] = useState<null | 'monthly' | 'lifetime'>(null);

    if (!isOpen) return null;

    const handlePayment = (plan: 'monthly' | 'lifetime') => {
        alert("I pagamenti sono disabilitati in questa versione locale.");
    };


    return (
        <div
            className="fixed inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={isClosable ? onClose : undefined}
            role="dialog"
            aria-modal="true"
            aria-labelledby="paywall-title"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center p-8 transform transition-all duration-300 scale-100 animate-fade-in relative" onClick={(e) => e.stopPropagation()}>

                {isClosable && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1"
                        aria-label="Chiudi"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                    <LockIcon />
                </div>
                <h2 id="paywall-title" className="text-2xl font-bold text-slate-800 mb-3">
                    {isClosable ? 'Sblocca Funzionalità Premium' : 'Periodo di prova terminato'}
                </h2>
                <p className="text-slate-600 mb-8">
                    Scegli il piano che preferisci per continuare a usare l'app e supportare il suo sviluppo.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => handlePayment('lifetime')}
                        disabled={loading !== null}
                        className="w-full relative group p-0.5 rounded-xl font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-50"
                    >
                        <div className="absolute -inset-1 group-hover:blur-md opacity-50 group-hover:opacity-80 transition duration-300 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"></div>
                        <div className="relative w-full text-center px-6 py-4 border border-transparent rounded-lg bg-slate-800">
                            <p className="text-lg">Accesso a Vita</p>
                            <p className="text-2xl font-bold">€4,99 <span className="text-sm font-normal text-slate-400">una tantum</span></p>
                        </div>
                    </button>

                    <button
                        onClick={() => handlePayment('monthly')}
                        disabled={loading !== null}
                        className="w-full p-4 rounded-xl font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition disabled:opacity-50"
                    >
                        <p className="text-lg">Abbonamento</p>
                        <p className="text-2xl font-bold">€1,00 <span className="text-sm font-normal text-slate-500">/ mese</span></p>
                    </button>
                </div>

                {loading && (
                    <div className="mt-4 text-sm text-slate-500 flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Stiamo preparando il tuo checkout...</span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaywallModal;