import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isResetMode, setIsResetMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isResetMode) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setSuccessMsg('Email di recupero inviata! Controlla la tua casella di posta.');
            } else if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLoginSuccess();
                onClose();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccessMsg('Registrazione completata! Controlla la tua email per confermare.');
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setError(null);
        setSuccessMsg(null);
        if (isResetMode) {
            setIsResetMode(false);
            setIsLogin(true);
        } else {
            setIsLogin(!isLogin);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20 relative overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-2xl font-black text-center mb-2 text-slate-800 dark:text-white relative z-10">
                    {isResetMode ? 'Recupera Password 🔐' : (isLogin ? 'Bentornato! 👋' : 'Crea Account 🚀')}
                </h2>
                <p className="text-center text-slate-500 text-sm mb-6 relative z-10">
                    {isResetMode ? 'Inserisci la tua email per ricevere il link di reset.' : (isLogin ? 'Accedi per continuare i tuoi progressi.' : 'Inizia il tuo viaggio verso il successo.')}
                </p>

                <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent font-bold dark:text-white focus:border-blue-500 outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tuo@email.com"
                        />
                    </div>

                    {!isResetMode && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-slate-500">Password</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline"
                                        onClick={() => {
                                            setIsResetMode(true);
                                            setError(null);
                                            setSuccessMsg(null);
                                        }}
                                    >
                                        Password dimenticata?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent font-bold dark:text-white focus:border-blue-500 outline-none transition-colors pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-bold text-center animate-fade-in">
                            {successMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Caricamento...' : (isResetMode ? 'Invia Link Reset' : (isLogin ? 'Accedi' : 'Registrati'))}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-medium text-slate-500 relative z-10">
                    {isResetMode ? (
                        <button
                            onClick={toggleMode}
                            className="text-blue-600 hover:underline font-bold"
                        >
                            Torna al login
                        </button>
                    ) : (
                        <>
                            {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
                            <button
                                onClick={toggleMode}
                                className="ml-2 text-blue-600 hover:underline font-bold"
                            >
                                {isLogin ? 'Registrati ora' : 'Accedi'}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
