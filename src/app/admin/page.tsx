"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/Footer"

export default function AdminPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        // Check role in profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            toast.error("Accès refusé. Réservé aux administrateurs.")
            router.push('/')
            return
        }

        setIsAdmin(true)
        fetchUsers()
    }

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error("Erreur de chargement des utilisateurs")
        } else {
            setUsers(data as Profile[])
        }
        setLoading(false)
    }

    const deleteUser = async (userId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return

        // Note: Supabase Client SDK can only delete from public tables (profiles, scores).
        // To delete from auth.users, you typically need a Server Action with Service Role Key.
        // For this MVP constraint (client-side focus), we will delete the PROFILE data.
        // Real deletion of auth user requires backend logic.

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (error) {
            toast.error("Erreur lors de la suppression : " + error.message)
        } else {
            toast.success("Utilisateur supprimé (Données publiques)")
            setUsers(users.filter(u => u.id !== userId))
        }
    }

    if (!isAdmin) return null

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <NavBar />
            <div className="container mx-auto py-10 px-4 flex-1">
                <div className="flex items-center gap-4 mb-8">
                    <ShieldAlert className="h-10 w-10 text-red-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Panneau d'Administration</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead>Date d'inscription</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteUser(user.id)}
                                                disabled={user.role === 'admin'} // Prevent deleting admins
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
