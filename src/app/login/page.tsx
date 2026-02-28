"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [showVerify, setShowVerify] = useState(false)
    const [otp, setOtp] = useState("")
    const router = useRouter()

    const handleGoogleLogin = async () => {
        setLoading(true)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        }
    }


    const validatePassword = (pass: string) => {
        const minLength = pass.length >= 8
        const hasUpper = /[A-Z]/.test(pass)
        const hasNumber = /[0-9]/.test(pass)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        return { minLength, hasUpper, hasNumber, hasSpecial }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isSignUp) {
            const { minLength, hasUpper, hasNumber, hasSpecial } = validatePassword(password)
            if (!minLength || !hasUpper || !hasNumber || !hasSpecial) {
                toast.error("Le mot de passe ne respecte pas les critères de sécurité.")
                return
            }
        }

        setLoading(true)

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) {
                toast.error(error.message)
            } else if (data.user && !data.session) {
                toast.success("Code de vérification envoyé ! Vérifiez vos emails.")
                setShowVerify(true)
            } else {
                toast.success("Inscription réussie !")
                router.refresh()
                router.push("/")
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                toast.error(error.message || "Échec de la connexion.")
            } else {
                toast.success("Connexion réussie !")
                router.refresh()
                router.push("/")
            }
        }
        setLoading(false)
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Veuillez entrer votre email.")
            return
        }
        setLoading(true)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}/auth/update-password`,
        })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.")
            setIsForgotPassword(false)
        }
        setLoading(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup'
        })

        if (error) {
            toast.error(error.message || "Code invalide.")
        } else {
            toast.success("Compte vérifié avec succès !")
            router.refresh()
            router.push("/")
        }
        setLoading(false)
    }

    const passwordStatus = validatePassword(password)

    return (
        <div className="flex h-screen w-full bg-white">
            <div className="w-full hidden md:flex md:w-1/2 relative">
                <img
                    className="h-full w-full object-cover"
                    src="/images/prague_login.jpg"
                    alt="Login Banner"
                />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">

                <form onSubmit={showVerify ? handleVerifyOtp : isForgotPassword ? handleResetPassword : handleAuth} className="md:w-96 w-80 flex flex-col items-center justify-center">
                    <h2 className="text-4xl text-gray-900 font-medium">
                        {showVerify ? "Vérification" : isForgotPassword ? "Réinitialisation" : isSignUp ? "Créer un compte" : "Bon retour !"}
                    </h2>
                    <p className="text-sm text-gray-500/90 mt-3 mb-8 text-center">
                        {showVerify
                            ? "Entrez le code reçu par email."
                            : isForgotPassword
                                ? "Entrez votre email pour réinitialiser."
                                : isSignUp
                                    ? "Inscrivez-vous pour continuer."
                                    : "Connectez-vous pour continuer."}
                    </p>

                    {!isForgotPassword && !showVerify && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-gray-500/10 hover:bg-gray-500/20 flex items-center justify-center h-12 rounded-full transition-colors"
                            >
                                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
                            </button>

                            <div className="flex items-center gap-4 w-full my-5">
                                <div className="w-full h-px bg-gray-300/90"></div>
                                <p className="w-full text-nowrap text-sm text-gray-500/90">ou via email</p>
                                <div className="w-full h-px bg-gray-300/90"></div>
                            </div>
                        </>
                    )}

                    {!showVerify && (
                        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                                required
                                disabled={showVerify}
                            />
                        </div>
                    )}

                    {showVerify && (
                        <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 w-4 h-4">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Code (6 chiffres)"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                                required
                            />
                        </div>
                    )}

                    {!isForgotPassword && !showVerify && (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                                </svg>
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full pr-4"
                                    required
                                />
                            </div>
                            {isSignUp && (
                                <div className="flex flex-wrap gap-2 mt-2 px-2">
                                    <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.minLength ? "text-green-600" : "text-gray-400"}`}>
                                        ● 8 car.
                                    </span>
                                    <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasUpper ? "text-green-600" : "text-gray-400"}`}>
                                        ● Maj.
                                    </span>
                                    <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasNumber ? "text-green-600" : "text-gray-400"}`}>
                                        ● Chiffre
                                    </span>
                                    <span className={`text-[10px] flex items-center gap-1 ${passwordStatus.hasSpecial ? "text-green-600" : "text-gray-400"}`}>
                                        ● Symbole
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {!isForgotPassword && !showVerify && (
                        <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                            <div className="flex items-center gap-2">
                                <input className="h-5 accent-indigo-500" type="checkbox" id="checkbox" />
                                <label className="text-sm" htmlFor="checkbox">Se souvenir de moi</label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsForgotPassword(true)}
                                className="text-sm underline hover:text-indigo-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading
                            ? "Chargement..."
                            : showVerify
                                ? "Vérifier"
                                : isForgotPassword
                                    ? "Envoyer"
                                    : isSignUp ? "S'inscrire" : "Se connecter"}
                    </button>

                    {!showVerify && (
                        <p className="text-gray-500/90 text-sm mt-4">
                            {isForgotPassword
                                ? "Retour à la connexion ?"
                                : isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false)
                                    if (!isForgotPassword) setIsSignUp(!isSignUp)
                                }}
                                className="ml-1 text-indigo-400 hover:underline bg-transparent border-none p-0 cursor-pointer"
                            >
                                {isForgotPassword
                                    ? "Se connecter"
                                    : isSignUp ? "Se connecter" : "S'inscrire"}
                            </button>
                        </p>
                    )}

                    <Link href="/" className="mt-8 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                        ← Retour à l'accueil
                    </Link>
                </form>
            </div>
        </div>
    )
}
