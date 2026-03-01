"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Mail, Trash2, Check, Clock } from "lucide-react"

type ContactMessage = {
    id: string
    name: string
    email: string
    subject: string
    message: string
    created_at: string
    read: boolean
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAdminAndFetchMessages()
    }, [])

    const checkAdminAndFetchMessages = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
                router.push("/")
                return
            }

            setIsAdmin(true)
            fetchMessages()
        } catch (error) {
            console.error(error)
            router.push("/")
        }
    }

    const fetchMessages = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error("Erreur lors du chargement des messages")
        } else {
            setMessages(data || [])
        }
        setLoading(false)
    }

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ read: true })
            .eq('id', id)

        if (error) {
            toast.error("Erreur de mise à jour")
        } else {
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error("Erreur lors de la suppression")
        } else {
            toast.success("Message supprimé")
            setMessages(messages.filter(m => m.id !== id))
        }
    }

    if (loading && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#0B0914] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="min-h-screen bg-[#0B0914] flex flex-col">
            <NavBar />

            <div className="flex-1 container mx-auto px-4 py-32 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Mail className="w-8 h-8 text-primary" />
                            Messages de Contact
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Gérez les messages envoyés depuis le formulaire de contact du site.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <Card className="bg-white/5 border-white/10 text-white text-center py-20">
                        <CardContent>
                            <Mail className="w-16 h-16 mx-auto text-slate-500 mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">Aucun message</h3>
                            <p className="text-slate-400">La boîte de réception est vide.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <Card key={msg.id} className={`bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-xl transition-all ${!msg.read ? 'border-primary/50 shadow-primary/10' : ''}`}>
                                <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-3 text-lg">
                                            {!msg.read && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                                            {msg.subject}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 text-slate-300">
                                            <span className="font-bold text-white">{msg.name}</span>
                                            <span>({msg.email})</span>
                                            <span className="flex items-center gap-1 text-slate-400 text-xs">
                                                <Clock className="w-3 h-3" />
                                                {new Date(msg.created_at).toLocaleString('fr-FR')}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!msg.read && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-transparent border-primary text-primary hover:bg-primary/20"
                                                onClick={() => markAsRead(msg.id)}
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Marquer lu
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border-transparent"
                                            onClick={() => deleteMessage(msg.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                                        {msg.message}
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <Button
                                            variant="secondary"
                                            className="bg-white/10 hover:bg-white/20 text-white"
                                            onClick={() => window.location.href = `mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                                        >
                                            Répondre par email
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
