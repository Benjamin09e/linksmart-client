"use client";

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // Appelle ta future route Backend : POST /api/auth/forgot-password
            await api.post('/auth/forgot-password', { email });
            setMessage("Si cet email existe, un lien de réinitialisation a été envoyé.");
        } catch (err) {
            setError(err.response?.data?.error || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Mot de passe oublié ?</h1>
                <p className="text-slate-500 mb-6 text-sm"> Pas de panique ! Entre ton email et on t&lsquo;envoie un lien pour en créer un nouveau.</p>

                {message && <div className="p-4 mb-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-100">{message}</div>}
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 pl-1">Email</label>
                        <input
                            type="email"
                            placeholder="ton@email.com"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        {loading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}