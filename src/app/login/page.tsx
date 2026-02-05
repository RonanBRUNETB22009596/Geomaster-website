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
                toast.success("Inscription enregistrée ! Veuillez vérifier vos emails pour valider le compte.")
                setIsSignUp(false)
            } else {
                toast.success("Inscription réussie !")
                router.refresh()
                router.push("/dashboard")
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
                router.push("/dashboard")
            }
        }
        setLoading(false)
    }

    const passwordStatus = validatePassword(password)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? "Créer un compte" : "Connexion"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignUp
                            ? "Rejoignez GeoMaster pour sauvegarder vos scores"
                            : "Connectez-vous pour retrouver votre historique"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Continuer avec Google
                        </Button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Ou avec email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {isSignUp && (
                                <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                                    <p className={passwordStatus.minLength ? "text-green-600" : "text-slate-400"}>
                                        ● Min. 8 caractères
                                    </p>
                                    <p className={passwordStatus.hasUpper ? "text-green-600" : "text-slate-400"}>
                                        ● Une majuscule
                                    </p>
                                    <p className={passwordStatus.hasNumber ? "text-green-600" : "text-slate-400"}>
                                        ● Un chiffre
                                    </p>
                                    <p className={passwordStatus.hasSpecial ? "text-green-600" : "text-slate-400"}>
                                        ● Un symbole spécial
                                    </p>
                                </div>
                            )}
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading
                                ? "Chargement..."
                                : isSignUp ? "S'inscrire" : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        variant="link"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full text-sm text-slate-500"
                    >
                        {isSignUp
                            ? "Déjà un compte ? Se connecter"
                            : "Pas encore de compte ? S'inscrire"}
                    </Button>
                    <Button variant="ghost" asChild className="w-full text-xs">
                        <Link href="/">Retour à l'accueil</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
