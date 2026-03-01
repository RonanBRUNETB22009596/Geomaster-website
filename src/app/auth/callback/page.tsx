"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                router.push("/auth/update-password")
            } else if (event === 'SIGNED_IN' && session) {
                router.push("/")
            }
        })

        // Also check if we already have a session (e.g. from fragment)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push("/")
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-white/5">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h1 className="text-xl font-bold text-white">Finalisation de la connexion...</h1>
                <p className="text-slate-300">Un instant, nous vous redirigeons vers votre espace.</p>
            </div>
        </div>
    )
}
