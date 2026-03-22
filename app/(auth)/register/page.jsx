"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            router.push('/admin');
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-2xl font-black text-center mb-6 text-indigo-600">Créer un compte</h1>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text" placeholder="Nom d'utilisateur (unique)"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <input
                        type="email" placeholder="Email"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password" placeholder="Mot de passe"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                        S&lsquo;inscrire gratuitement
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Déjà un compte ? <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                        Retour à la connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}