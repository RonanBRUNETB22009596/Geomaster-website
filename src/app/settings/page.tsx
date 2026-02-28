"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { User, ShieldAlert, Trash2, Camera, Loader2, Check, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRef } from "react"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [username, setUsername] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [uploading, setUploading] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }
            setUser(user)

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile) {
                setProfile(profile)
                setUsername(profile.username || "")
                setAvatarUrl(profile.avatar_url || "")
            }
            setLoading(false)
        }
        loadData()
    }, [router])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("L'image est trop lourde (max 2Mo)")
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Le fichier doit être une image")
            return
        }

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)
            toast.success("Image chargée ! N'oubliez pas d'enregistrer.")
        } catch (error: any) {
            console.error("Erreur upload:", error)
            toast.error("Échec du chargement : " + (error.message || "Erreur inconnue"))
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)

        const { error } = await supabase
            .from('profiles')
            .update({
                username,
                avatar_url: avatarUrl
            })
            .eq('id', user.id)

        if (error) {
            toast.error("Erreur lors de la mise à jour : " + error.message)
        } else {
            toast.success("Profil mis à jour avec succès !")
            setProfile({ ...profile, username, avatar_url: avatarUrl })
            // Redirect to home after a short delay
            setTimeout(() => {
                router.push("/")
            }, 1000)
        }
        setUpdating(false)
    }

    const handleDeleteAccount = async () => {
        const confirmResult = window.confirm("ATTENTION : Cette action est irréversible. Toutes vos données (scores, compte) seront supprimées définitivement. Souhaitez-vous continuer ?")

        if (!confirmResult) return

        setDeleting(true)
        try {
            const { data, error } = await supabase.functions.invoke('delete-account', {
                method: 'POST'
            })

            if (error) throw error

            toast.success("Votre compte a été supprimé.")
            await supabase.auth.signOut()
            router.push("/")
        } catch (error: any) {
            console.error("Erreur suppression compte:", error)
            toast.error("Échec de la suppression : " + (error.message || "Une erreur est survenue"))
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="container mx-auto pt-24 pb-10 px-4 flex-1 max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Paramètres</h1>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <Card className="shadow-sm border-none bg-black/40 backdrop-blur-md border border-white/10">
                        <CardHeader>
                            <CardTitle>Profil</CardTitle>
                            <CardDescription>Personnalisez votre apparence sur GeoMaster.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-slate-100">
                                    <div className="relative group">
                                        <div
                                            className="relative cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-md transition-transform group-hover:scale-105">
                                                <AvatarImage src={avatarUrl} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold uppercase">
                                                    {username.charAt(0) || user?.email?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                {uploading ? <Loader2 className="text-white w-6 h-6 animate-spin" /> : <Camera className="text-white w-6 h-6" />}
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white">Photo de profil</h3>
                                            <p className="text-sm text-slate-300">Cliquez sur l'avatar pour modifier l'image (JPG, PNG, max 2Mo).</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                        >
                                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            Choisir un fichier
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Pseudonyme</Label>
                                        <Input
                                            id="username"
                                            placeholder="Ex: ExplorateurGeo"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email (non modifiable)</Label>
                                        <Input value={user.email} disabled className="bg-white/5 opacity-60" />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full sm:w-auto" disabled={updating}>
                                    {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                    Enregistrer les modifications
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border border-red-500/30 bg-red-950/40 backdrop-blur-md">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-red-600">
                                <ShieldAlert className="h-5 w-5" />
                                <CardTitle className="text-lg">Zone de danger</CardTitle>
                            </div>
                            <CardDescription className="text-red-600/70">
                                Ces actions ont des conséquences permanentes sur votre compte.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white border border-red-100">
                                <div>
                                    <h3 className="font-bold text-white">Supprimer mon compte</h3>
                                    <p className="text-sm text-slate-300">Suppression définitive de votre compte et de vos scores.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="gap-2"
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                >
                                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Supprimer le compte
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}
