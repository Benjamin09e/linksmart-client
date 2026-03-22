"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // Récupère le ?token=... dans l'URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        if (!token) {
            return setError("Token de réinitialisation manquant ou invalide.");
        }

        setLoading(true);
        setError('');

        try {
            // Appel à ton futur endpoint Backend : POST /api/auth/reset-password
            await api.post('/auth/reset-password', { token, password });
            
            setMessage("Mot de passe modifié avec succès ! Redirection...");
            
            // On redirige vers le login après 3 secondes
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Le lien a expiré ou est invalide.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Nouveau mot de passe</h1>
                <p className="text-slate-500 mb-6 text-sm">Choisis un mot de passe robuste pour ton compte.</p>

                {message && <div className="p-4 mb-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-100 font-medium">✅ {message}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 font-medium">❌ {error}</div>}

                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 pl-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 pl-1">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm">
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}