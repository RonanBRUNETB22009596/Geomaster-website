"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/definitions"
import Link from "next/link"
import { Users, Search, Trash2, Loader2, Eye, Pencil, MessageSquare, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState<string>('admin')
    const [searchQuery, setSearchQuery] = useState('')

    // Rename modal state
    const [renameUserId, setRenameUserId] = useState<string | null>(null)
    const [newUsername, setNewUsername] = useState('')

    // Message modal state
    const [messageUserId, setMessageUserId] = useState<string | null>(null)
    const [messageTitle, setMessageTitle] = useState('')
    const [messageBody, setMessageBody] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
            if (profile) setCurrentUserRole(profile.role)
        }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setUsers(data as Profile[])
        setLoading(false)
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [users, searchQuery])

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (currentUserRole !== 'super_admin') {
            toast.error("Seul un Super Admin peut modifier les rôles.")
            return
        }

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            toast.error("Erreur de mise à jour: " + error.message)
        } else {
            toast.success("Rôle mis à jour.")
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as Profile['role'] } : u))
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (currentUserRole !== 'super_admin') {
            toast.error("Seul un Super Admin peut supprimer des utilisateurs.")
            return
        }

        if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action supprimera ses scores mais le compte Auth restera si aucune Edge Function n'est configurée.")) return

        await supabase.from('scores').delete().eq('user_id', userId)
        const { error } = await supabase.from('profiles').delete().eq('id', userId)

        if (error) {
            toast.error("Erreur de suppression: " + error.message)
        } else {
            toast.success("Profil utilisateur supprimé.")
            setUsers(users.filter(u => u.id !== userId))
        }
    }

    const handleRename = async () => {
        if (!renameUserId || !newUsername.trim()) return

        const { error } = await supabase
            .from('profiles')
            .update({ username: newUsername.trim() })
            .eq('id', renameUserId)

        if (error) {
            toast.error("Erreur: " + error.message)
        } else {
            toast.success("Pseudo mis à jour !")
            setUsers(users.map(u => u.id === renameUserId ? { ...u, username: newUsername.trim() } : u))
            setRenameUserId(null)
            setNewUsername('')
        }
    }

    const handleSendMessage = async () => {
        if (!messageUserId || !messageBody.trim()) return

        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: messageUserId,
                title: messageTitle.trim() || 'Message de l\'administration',
                message: messageBody.trim(),
            })

        if (error) {
            toast.error("Erreur: " + error.message)
        } else {
            toast.success("Message envoyé !")
            setMessageUserId(null)
            setMessageTitle('')
            setMessageBody('')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-400" />
                        Gestion des Utilisateurs
                    </h1>
                    <p className="text-sm text-slate-400">Gérez les comptes, les rôles et les accès.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher (email, pseudo)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                                <th className="p-4 font-semibold">Utilisateur</th>
                                <th className="p-4 font-semibold">Inscription</th>
                                <th className="p-4 font-semibold">Rôle</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-white">{u.username || 'Sans pseudo'}</p>
                                            <p className="text-xs text-slate-400">{u.email}</p>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {new Date(u.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="p-4">
                                            {currentUserRole === 'super_admin' ? (
                                                <Select
                                                    value={u.role || 'user'}
                                                    onValueChange={(val) => handleRoleChange(u.id, val)}
                                                >
                                                    <SelectTrigger className="w-32 h-8 bg-transparent border-white/10 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">Utilisateur</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'super_admin' ? 'bg-red-500/20 text-red-400' :
                                                    u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-slate-800 text-slate-300'
                                                    }`}>
                                                    {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 h-8 w-8"
                                                    title="Voir l'historique"
                                                >
                                                    <Link href={`/admin/users/${u.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 h-8 w-8"
                                                    title="Renommer"
                                                    onClick={() => {
                                                        setRenameUserId(u.id)
                                                        setNewUsername(u.username || '')
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-400 hover:text-green-300 hover:bg-green-500/20 h-8 w-8"
                                                    title="Envoyer un message"
                                                    onClick={() => {
                                                        setMessageUserId(u.id)
                                                        setMessageTitle('')
                                                        setMessageBody('')
                                                    }}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    disabled={currentUserRole !== 'super_admin' || u.role === 'super_admin'}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8"
                                                    title="Supprimer l'utilisateur"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rename Modal */}
            {renameUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1625] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-amber-400" />
                                Renommer l&apos;utilisateur
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-white h-8 w-8"
                                onClick={() => setRenameUserId(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <Input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Nouveau pseudo..."
                            className="bg-white/5 border-white/10 text-white mb-4"
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                className="text-slate-400"
                                onClick={() => setRenameUserId(null)}
                            >
                                Annuler
                            </Button>
                            <Button onClick={handleRename} disabled={!newUsername.trim()}>
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {messageUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1625] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-green-400" />
                                Envoyer un message
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-white h-8 w-8"
                                onClick={() => setMessageUserId(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                            À : {users.find(u => u.id === messageUserId)?.username || users.find(u => u.id === messageUserId)?.email}
                        </p>
                        <Input
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            placeholder="Titre du message (optionnel)"
                            className="bg-white/5 border-white/10 text-white mb-3"
                        />
                        <textarea
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            placeholder="Votre message..."
                            rows={4}
                            className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-lg resize-none placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                className="text-slate-400"
                                onClick={() => setMessageUserId(null)}
                            >
                                Annuler
                            </Button>
                            <Button onClick={handleSendMessage} disabled={!messageBody.trim()}>
                                Envoyer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
