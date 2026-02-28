"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Settings as SettingsIcon, Save, Loader2, AlertTriangle, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    // Configurations
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [heroTitle, setHeroTitle] = useState("Explorez le Monde")
    const [heroSubtitle, setHeroSubtitle] = useState("Découvrez notre test de géographie et défiez vos connaissances mondiales.")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)

        // Check if super admin
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
            if (profile?.role === 'super_admin') {
                setIsSuperAdmin(true)
            }
        }

        // Load settings
        const { data: settings } = await supabase.from('site_settings').select('*')

        if (settings) {
            settings.forEach(setting => {
                if (setting.key === 'maintenance_mode') {
                    setMaintenanceMode(setting.value === 'true' || setting.value === true)
                }
                if (setting.key === 'hero_text' && setting.value) {
                    setHeroTitle(setting.value.title || "Explorez le Monde")
                    setHeroSubtitle(setting.value.subtitle || "Découvrez notre test de géographie.")
                }
            })
        }

        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isSuperAdmin) {
            toast.error("Seul un Super Admin peut modifier ces paramètres.")
            return
        }

        setSaving(true)

        const payload1 = { key: 'maintenance_mode', value: maintenanceMode }
        const payload2 = { key: 'hero_text', value: { title: heroTitle, subtitle: heroSubtitle } }

        const { error: err1 } = await supabase.from('site_settings').upsert(payload1)
        const { error: err2 } = await supabase.from('site_settings').upsert(payload2)

        if (err1 || err2) {
            toast.error("Erreur lors de l'enregistrement.")
            console.error(err1, err2)
        } else {
            toast.success("Paramètres enregistrés avec succès.")
        }

        setSaving(false)
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
            <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-slate-400" />
                    Configuration du Site
                </h1>
                <p className="text-sm text-slate-400">Gérez le statut de maintenance et les textes principaux.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8 max-w-3xl">

                {/* Maintenance Card */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-white shadow-lg overflow-hidden relative">
                    {maintenanceMode && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    )}

                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <AlertTriangle className={`w-5 h-5 ${maintenanceMode ? 'text-red-500' : 'text-slate-400'}`} />
                        <h2 className="text-lg font-bold">Mode Maintenance</h2>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-slate-200">Activer le mode maintenance</p>
                            <p className="text-sm text-slate-400">Si activé, seuls les administrateurs pourront accéder au site.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 ${maintenanceMode ? 'bg-red-500' : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Homepage Text Card */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-bold">Page d'accueil</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Titre Principal (Slogan GSAP)</Label>
                            <Input
                                value={heroTitle}
                                onChange={e => setHeroTitle(e.target.value)}
                                className="bg-black/40 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Sous-titre de la page d'accueil</Label>
                            <Input
                                value={heroSubtitle}
                                onChange={e => setHeroSubtitle(e.target.value)}
                                className="bg-black/40 border-white/10"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving || !isSuperAdmin}
                        className="bg-primary text-white hover:bg-primary/90 gap-2 h-12 px-8"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Enregistrer les modifications
                    </Button>
                </div>
            </form>
        </div>
    )
}
