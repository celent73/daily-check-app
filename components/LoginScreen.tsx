
import React from 'react';

interface LoginScreenProps {
    onAnonymousContinue: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAnonymousContinue }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text mb-2">
            Benvenuto in Daily Check
        </h1>
        <p className="text-slate-500 mb-8">
          Monitora le tue attività giornaliere, settimanali e mensili in modo semplice ed efficace.
        </p>

        <button 
            onClick={onAnonymousContinue}
            className="w-full px-4 py-3 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Inizia
        </button>
        <p className="text-xs text-slate-400 mt-4">I dati verranno salvati su questo dispositivo.</p>
      </div>
    </div>
  );
};

export default LoginScreen;
