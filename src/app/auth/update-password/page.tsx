"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavBar } from "@/components/NavBar"
import { useI18n } from "@/lib/i18n"

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)
    const router = useRouter()
    const { t } = useI18n()

    useEffect(() => {
        // Listen for PASSWORD_RECOVERY event from the URL hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setChecking(false)
            } else if (event === 'SIGNED_IN' && session) {
                setChecking(false)
            }
        })

        // Also try to get current session (user may already be authenticated via the link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setChecking(false)
            } else {
                // Give a moment for the hash to be processed
                setTimeout(() => setChecking(false), 2000)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const validatePassword = (pass: string) => {
        const minLength = pass.length >= 8
        const hasUpper = /[A-Z]/.test(pass)
        const hasNumber = /[0-9]/.test(pass)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        return { minLength, hasUpper, hasNumber, hasSpecial, valid: minLength && hasUpper && hasNumber && hasSpecial }
    }

    const passwordStatus = validatePassword(password)

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!passwordStatus.valid) {
            toast.error(t('update_password.password_criteria_error') || "Le mot de passe ne respecte pas les critères de sécurité.")
            return
        }

        if (password !== confirmPassword) {
            toast.error(t('update_password.password_mismatch') || "Les mots de passe ne correspondent pas.")
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success(t('update_password.password_updated') || "Mot de passe mis à jour avec succès !")
            router.push("/")
        }

        setLoading(false)
    }

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-transparent">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-white">Vérification en cours...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <Lock className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-black text-white">
                                {t('update_password.title') || "Nouveau mot de passe"}
                            </h1>
                        </div>

                        <p className="text-slate-300 mb-8">
                            {t('update_password.desc') || "Choisissez un nouveau mot de passe sécurisé pour votre compte."}
                        </p>

                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                    {t('update_password.new_password') || "Nouveau mot de passe"}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white"
                                    required
                                    minLength={8}
                                />
                                {password && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.minLength ? 'text-green-500' : 'text-slate-400'}`}>● {t('login.password_min')}</span>
                                        <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasUpper ? 'text-green-500' : 'text-slate-400'}`}>● {t('login.password_upper')}</span>
                                        <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasNumber ? 'text-green-500' : 'text-slate-400'}`}>● {t('login.password_number')}</span>
                                        <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasSpecial ? 'text-green-500' : 'text-slate-400'}`}>● {t('login.password_special')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">
                                    {t('update_password.confirm') || "Confirmer le mot de passe"}
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                {t('update_password.save') || "Enregistrer"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
