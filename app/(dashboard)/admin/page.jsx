"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import api from '@/lib/api';

export default function AdminDashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newLink, setNewLink] = useState({ label: '', url: '' });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState({ displayName: '', bio: '' });
    const [copiedId, setCopiedId] = useState(null); // Pour l'effet visuel de copie

    const router = useRouter();



    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profiles/me');
            setProfile(data);
            setTempProfile({ displayName: data.displayName, bio: data.bio });
        } catch (err) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // --- ACTIONS ---

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000); // Reset l'icône après 2s
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profiles/me', tempProfile);
            setIsEditingProfile(false);
            fetchProfile();
            toast.success("Profil mis à jour !"); // <--- Plus d'alert !
        } catch (err) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/profiles/links', newLink);
            setNewLink({ label: '', url: '' });
            setShowForm(false);
            fetchProfile();
            toast.success("Lien ajouté avec succès 🚀");
        } catch (err) {
            toast.error("Impossible d'ajouter le lien");
        }
    };

    const handleDeleteLink = async (linkId) => {
        // On peut même faire une confirmation plus jolie plus tard, 
        // mais gardons le confirm() pour l'instant et ajoutons le toast après.
        if (!confirm("Supprimer ce lien ?")) return;
        try {
            const updatedLinks = profile.links.filter(l => l._id !== linkId);
            await api.put('/profiles/me', { links: updatedLinks });
            fetchProfile();
            toast.info("Lien supprimé");
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-indigo-600 italic">Chargement du profil...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 pb-20">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* BARRE DE DÉCONNEXION */}
                <div className="flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 rounded-xl font-bold text-sm shadow-sm border border-red-50 hover:bg-red-50 transition-all"
                    >
                        <span>Déconnexion</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                    </button>
                </div>

                {/* BLOC 1 : PROFIL ET BIO */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    {!isEditingProfile ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 uppercase">
                                {profile?.username?.[0] || "?"}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900">{profile?.displayName || "Chargement..."}</h1>
                            <p className="text-slate-400 mb-4 font-medium">@{profile?.username}</p>
                            <p className="text-slate-600 mb-6 leading-relaxed">{profile?.bio || "Aucune biographie définie."}</p>
                            <button onClick={() => setIsEditingProfile(true)} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-6 py-2 rounded-full hover:bg-indigo-100 transition">
                                Modifier mon profil
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <input
                                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                                value={tempProfile.displayName}
                                onChange={e => setTempProfile({ ...tempProfile, displayName: e.target.value })}
                                placeholder="Nom d'affichage"
                            />
                            <textarea
                                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]"
                                value={tempProfile.bio}
                                onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
                                placeholder="Ta biographie"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Sauvegarder</button>
                                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Annuler</button>
                            </div>
                        </form>
                    )}
                </div>

                {/* BLOC 2 : AJOUT DE LIEN */}
                {!showForm ? (
                    <button onClick={() => setShowForm(true)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all">
                        + Ajouter un nouveau lien
                    </button>
                ) : (
                    <form onSubmit={handleAddLink} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-4">
                            <input
                                className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                                placeholder="Titre (ex: Mon GitHub)"
                                value={newLink.label}
                                onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                                required
                            />
                            <input
                                className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                                placeholder="URL (https://...)"
                                value={newLink.url}
                                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                                required
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Ajouter</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Fermer</button>
                            </div>
                        </div>
                    </form>
                )}

                {/* BLOC 3 : LISTE DES LIENS */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Liens Actifs</h2>
                    {profile?.links?.map((link) => (
                        <div key={link._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                            <div className="overflow-hidden flex-1">
                                <h3 className="font-bold text-slate-800">{link.label}</h3>
                                <p className="text-xs text-indigo-500 truncate">{link.url}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* BOUTON COPIER */}
                                <button
                                    onClick={() => handleCopy(link.url, link._id)}
                                    className={`p-2 rounded-lg transition-colors ${copiedId === link._id ? 'text-green-500 bg-green-50' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
                                    title="Copier le lien"
                                >
                                    {copiedId === link._id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    )}
                                </button>

                                {/* BOUTON SUPPRIMER */}
                                <button
                                    onClick={() => handleDeleteLink(link._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                    title="Supprimer le lien"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}