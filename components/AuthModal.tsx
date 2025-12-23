import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
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
                alert('Registrazione completata! Controlla la tua email per confermare.');
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20">
                <h2 className="text-2xl font-black text-center mb-6 text-slate-800 dark:text-white">
                    {isLogin ? 'Bentornato! 👋' : 'Crea Account 🚀'}
                </h2>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent font-bold dark:text-white focus:border-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent font-bold dark:text-white focus:border-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm font-medium text-slate-500">
                    {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-600 hover:underline font-bold"
                    >
                        {isLogin ? 'Registrati ora' : 'Accedi'}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
