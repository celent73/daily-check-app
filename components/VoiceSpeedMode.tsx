
import React, { useState, useEffect, useRef } from 'react';
import { ActivityType } from '../types';

interface VoiceSpeedModeProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateActivity: (activity: ActivityType, count: number) => void;
}

// Helper to check browser support
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

const VoiceSpeedMode: React.FC<VoiceSpeedModeProps> = ({ isOpen, onClose, onUpdateActivity }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            startListening();
        } else {
            stopListening();
        }
    }, [isOpen]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setFeedback("Il tuo browser non supporta i comandi vocali.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'it-IT';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback("Ti ascolto... (es: '3 contatti', '2 appuntamenti')");
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;
            setTranscript(text);
            parseCommand(text);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setFeedback("Errore di riconoscimento. Riprova.");
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const parseCommand = (text: string) => {
        const lowerText = text.toLowerCase();
        let number = 1;

        // Extract number (word or digit)
        const words = lowerText.split(' ');
        const numberMap: { [key: string]: number } = {
            'uno': 1, 'due': 2, 'tre': 3, 'quattro': 4, 'cinque': 5,
            'sei': 6, 'sette': 7, 'otto': 8, 'nove': 9, 'dieci': 10
        };

        for (const word of words) {
            if (!isNaN(parseInt(word))) {
                number = parseInt(word);
                break;
            }
            if (numberMap[word]) {
                number = numberMap[word];
                break;
            }
        }

        // Identify Activity
        let activity: ActivityType | null = null;
        if (lowerText.includes('contatt') || lowerText.includes('chiamat')) activity = ActivityType.CONTACTS;
        else if (lowerText.includes('appuntament') || lowerText.includes('fissat')) activity = ActivityType.APPOINTMENTS;
        else if (lowerText.includes('contratt') || lowerText.includes('chius')) activity = ActivityType.NEW_CONTRACTS;
        else if (lowerText.includes('video') || lowerText.includes('inviat')) activity = ActivityType.VIDEOS_SENT;
        else if (lowerText.includes('family') || lowerText.includes('utility')) activity = ActivityType.NEW_FAMILY_UTILITY;

        if (activity) {
            onUpdateActivity(activity, number);
            setFeedback(`✅ Aggiunti ${number} ${activity === ActivityType.NEW_FAMILY_UTILITY ? 'Family Utility' : activity}!`);
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setFeedback(`❓ Non ho capito l'attività. Riprova.`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden border border-slate-200 dark:border-slate-800">

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full mb-6 transition-all duration-300 ${isListening ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </div>

                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Speed Mode</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                    {feedback}
                </p>

                {transcript && (
                    <div className="bg-slate-100 dark:bg-black p-3 rounded-xl mb-6">
                        <p className="font-mono text-sm text-slate-600 dark:text-slate-300">"{transcript}"</p>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`px-6 py-2 rounded-xl font-bold text-white transition-all ${isListening ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30' : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'}`}
                    >
                        {isListening ? 'Ferma' : 'Riprova'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceSpeedMode;
