"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function PublicProfile() {
    const { username } = useParams(); // Récupère le pseudo depuis l'URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // Appel à ta route publique : GET /api/profiles/:username
                const response = await api.get(`/profiles/${username}`);
                setProfile(response.data);
            } catch (err) {
                console.error("Profil introuvable", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchPublicData();
    }, [username]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Chargement...</div>;

    if (error || !profile) return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-50 text-center p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
            <p className="text-gray-500">Ce profil n'existe pas encore ou a été supprimé.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white px-6 py-12">
            <div className="max-w-xl mx-auto flex flex-col items-center">

                {/* Avatar / Initiale */}
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl mb-4 border-4 border-white/10">
                    {profile.displayName?.charAt(0).toUpperCase()}
                </div>

                {/* Infos principales */}
                <h1 className="text-2xl font-black mb-1 tracking-tight">{profile.displayName}</h1>
                <p className="text-indigo-400 font-medium mb-6">@{profile.username}</p>

                {profile.bio && (
                    <p className="text-gray-400 text-center text-sm leading-relaxed mb-10 max-w-sm">
                        {profile.bio}
                    </p>
                )}

                {/* La liste des liens (Le cœur de l'app) */}
                <div className="w-full space-y-4">
                    {profile.links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300"
                        >
                            <span className="font-bold tracking-wide">{link.label}</span>
                            <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                ↗
                            </span>
                        </a>
                    ))}
                </div>

                {/* Footer discret */}
                <div className="mt-20 opacity-30 text-[10px] uppercase tracking-widest">
                    Propulsé par <span className="font-bold">LinkSmart</span>
                </div>
            </div>
        </div>
    );
}