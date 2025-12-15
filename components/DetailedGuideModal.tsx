
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface DetailedGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailedGuideModal: React.FC<DetailedGuideModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    });
    setTimeout(() => {
        onClose();
    }, 1500); 
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: "Benvenuto in Daily Check 🚀",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            La tua nuova arma segreta per monitorare il successo e raggiungere i tuoi obiettivi commerciali!
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              💡 Cos'è Daily Check?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Un'app intuitiva per tracciare contatti, appuntamenti e contratti, analizzare le performance e scalare la tua carriera.
            </p>
          </div>
        </div>
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Inserisci i Dati ✍️",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Usa il pannello laterale (o in alto su mobile) per registrare le tue attività quotidiane.
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 text-sm">
            <li><strong className="text-blue-600">Contatti:</strong> Quante persone hai sentito?</li>
            <li><strong className="text-emerald-600">Appuntamenti:</strong> Quanti incontri fissati?</li>
            <li><strong className="text-purple-600">Contratti:</strong> Le chiusure effettuate!</li>
          </ul>
           <div className="text-xs text-slate-500 italic mt-2">
            Tip: Puoi usare la "Power Mode" per inserimenti super veloci durante le sessioni di call!
          </div>
        </div>
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "La Tua Dashboard 📊",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Tutto sotto controllo in un colpo d'occhio.
          </p>
           <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border dark:border-slate-700">
                  <span className="block font-bold text-slate-700 dark:text-slate-200">Riepilogo</span>
                  Totali giornalieri, settimanali e mensili.
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border dark:border-slate-700">
                  <span className="block font-bold text-slate-700 dark:text-slate-200">Statistiche</span>
                  Tassi di conversione per capire dove migliorare.
              </div>
           </div>
        </div>
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
        title: "Livelli e Carriera 🏆",
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Visualizza i tuoi progressi di carriera basati sui punti accumulati.
            </p>
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-2xl">🌟</span>
                <span className="text-amber-800 dark:text-amber-200 font-medium">Scala le classifiche e sblocca nuovi Badge!</span>
            </div>
             <p className="text-sm text-slate-500">
                Ogni contratto "Green" vale doppio! Punta alla qualità.
             </p>
          </div>
        ),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      },
  ];

  const currentStepData = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with heavy blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-slate-700 transform transition-all duration-500 scale-100 animate-fade-in-up">
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="p-8 relative z-10 flex flex-col h-full min-h-[500px]">
            
            {/* Header / Icon */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="p-4 bg-white dark:bg-slate-700 rounded-full shadow-lg mb-4 animate-bounce-short">
                    {currentStepData.icon}
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {currentStepData.title}
                </h2>
            </div>
            
            {/* Body Content */}
            <div className="flex-grow">
                 <div className="text-center">
                    {currentStepData.content}
                 </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mb-8 mt-4">
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-2 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-600'}`}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                    onClick={step === 0 ? onClose : handleBack}
                    className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                    {step === 0 ? 'Salta' : 'Indietro'}
                </button>
                
                <button 
                    onClick={handleNext}
                    className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {step === steps.length - 1 ? 'Iniziamo!' : 'Avanti'}
                        {step !== steps.length - 1 && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DetailedGuideModal;
