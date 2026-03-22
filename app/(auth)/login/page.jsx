"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Indispensable pour la navigation interne
import api from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            router.push('/admin');
        } catch (err) {
            setError(err.response?.data?.error || "Identifiants incorrects ou erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-black text-gray-900">
                        LinkSmart
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Gérez tous vos liens en un seul endroit.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs rounded animate-shake">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="Adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="space-y-1 text-right">
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* LIEN MOT DE PASSE OUBLIÉ */}
                            <Link href="/forgot-password" size="sm" className="text-xs text-indigo-600 hover:underline font-medium">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all disabled:opacity-50"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                {/* LIEN VERS INSCRIPTION */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                            S&lsquo;inscrire gratuitement
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}