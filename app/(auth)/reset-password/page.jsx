"use client";

import { useState, Suspense } from 'react'; // Ajoute Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

// 1. On crée un composant interne pour le formulaire
function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Les mots de passe ne correspondent pas.");
        if (!token) return setError("Token invalide.");

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setMessage("Mot de passe modifié !");
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError("Le lien a expiré ou est invalide.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && <div className="p-4 mb-4 text-green-700 bg-green-50 rounded-xl">✅ {message}</div>}
            {error && <div className="p-4 mb-4 text-red-700 bg-red-50 rounded-xl">❌ {error}</div>}
            
            {!message && (
                <>
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50"
                    >
                        {loading ? "Mise à jour..." : "Enregistrer"}
                    </button>
                </>
            )}
        </form>
    );
}

// 2. Le composant principal exporté utilise Suspense
export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-2xl font-black text-slate-900 mb-6">Nouveau mot de passe</h1>
                
                {/* 🛡️ C'est cette ligne qui corrige l'erreur Netlify */}
                <Suspense fallback={<p className="text-center text-slate-500">Chargement...</p>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-8 text-center text-sm">
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}