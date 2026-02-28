"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import dynamic from "next/dynamic"

const BounceCards = dynamic(() => import("@/components/BounceCards"), { ssr: false })
import { StreakBadge } from "@/components/StreakBadge"
import { Footer } from "@/components/Footer"

function DifficultyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const category = searchParams.get('category') || 'World'

    const levels = [
        {
            id: 'Beginner',
            name: 'Débutant',
            description: 'Les pays les plus connus et leurs capitales emblématiques.',
            icon: ShieldCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/200/10',
            border: 'border-emerald-500/20'
        },
        {
            id: 'Intermediate',
            name: 'Intermédiaire',
            description: 'Un défi plus relevé avec des pays moins familiers.',
            icon: Shield,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            id: 'Professional',
            name: 'Professionnel',
            description: 'Le test ultime pour les vrais experts de la géographie.',
            icon: ShieldAlert,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20'
        }
    ]

    const handleSelect = (difficulty: string) => {
        const params = new URLSearchParams()
        params.set('category', category)
        params.set('difficulty', difficulty)
        router.push(`/quiz?${params.toString()}`)
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-32 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">
                Choisissez votre défi
            </h1>
            <p className="text-slate-300 text-lg mb-6 text-center max-w-2xl">
                Catégorie : <span className="font-bold text-primary">{category}</span>.
                Sélectionnez un niveau de difficulté pour commencer votre aventure.
            </p>

            {/* Streak Badge */}
            <div className="mb-10">
                <StreakBadge size="lg" />
            </div>

            <BounceCards
                animationDelay={0.04}
                animationStagger={0.06}
                containerWidth="100%"
            >
                {levels.map((level) => (
                    <Card
                        key={level.id}
                        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 ${level.border} h-full bg-black/40 backdrop-blur-md text-white`}
                        onClick={() => handleSelect(level.id)}
                    >
                        <div className={`absolute inset-0 ${level.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <CardHeader className="relative z-10 text-center pt-8">
                            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${level.bg}`}>
                                <level.icon className={`w-8 h-8 ${level.color}`} />
                            </div>
                            <CardTitle className="text-2xl font-bold mb-2 text-white">{level.name}</CardTitle>
                            <CardDescription className="text-slate-300 px-4">
                                {level.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="relative z-10 text-center pb-8">
                            <Button
                                variant="outline"
                                className={`w-full group-hover:bg-primary group-hover:text-white transition-colors`}
                            >
                                Commencer
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </BounceCards>

            <button
                onClick={() => router.push('/#categories')}
                className="mt-12 text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest text-xs font-bold"
            >
                ← Retour aux régions
            </button>
        </div>
    )
}

export default function DifficultyPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="flex-1">
                <Suspense fallback={<div className="p-32 text-center">Préparation...</div>}>
                    <DifficultyContent />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}
