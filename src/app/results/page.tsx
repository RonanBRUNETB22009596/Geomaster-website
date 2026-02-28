"use client"

import { useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, RefreshCw, Home } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import TiltedCard from "@/components/TiltedCard"
import { StreakBadge } from "@/components/StreakBadge"

function ResultsContent() {
    const searchParams = useSearchParams()
    const score = parseInt(searchParams.get('score') || '0')
    const total = parseInt(searchParams.get('total') || '10')
    const category = searchParams.get('category') || 'World'

    useEffect(() => {
        if (score >= 8) {
            const end = Date.now() + 2 * 1000 // 2 seconds
            const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

            const frame = () => {
                if (Date.now() > end) return

                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    startVelocity: 60,
                    origin: { x: 0, y: 0.5 },
                    colors: colors,
                })
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    startVelocity: 60,
                    origin: { x: 1, y: 0.5 },
                    colors: colors,
                })

                requestAnimationFrame(frame)
            }
            frame()
        }
    }, [score])

    // Calculate percentage and message
    const percentage = Math.round((score / total) * 100)
    let message = ""
    let color = ""

    if (percentage >= 80) {
        message = "Excellent ! Vous êtes un expert en géographie."
        color = "text-green-600"
    } else if (percentage >= 50) {
        message = "Bravo ! Vous avez de bonnes bases."
        color = "text-yellow-600"
    } else {
        message = "Continuez vos efforts, ça va venir !"
        color = "text-red-600"
    }

    return (
        <div className="flex-1 w-full container mx-auto flex flex-col items-center justify-center pt-24 pb-12 px-4">
            <TiltedCard
                containerWidth="100%"
                containerHeight="auto"
                imageHeight="auto"
                imageWidth="450px"
                rotateAmplitude={6}
                scaleOnHover={1.01}
                glareOpacity={0.12}
            >
                <Card className="w-full text-center shadow-2xl border-x border-b border-x-white/10 border-b-white/10 bg-black/40 backdrop-blur-md border-t-8 border-t-primary animate-in fade-in slide-in-from-bottom-5 text-white">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Quiz Terminé !</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-6xl font-black text-white/90">
                            {score} <span className="text-2xl text-slate-400 font-medium">/ {total}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${percentage >= 80 ? 'bg-emerald-100 text-emerald-700' : percentage >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {percentage}%
                        </div>
                        <p className={`text-lg font-medium ${color}`}>
                            {message}
                        </p>
                        {/* Current Streak */}
                        <div className="pt-2">
                            <StreakBadge size="md" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button asChild className="w-full h-12 text-lg">
                            <Link href={`/quiz/init?category=${category}`}>
                                <RefreshCw className="mr-2 h-5 w-5" /> Recommencer
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full bg-white text-black hover:bg-slate-200 border-none">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" /> Retour à l'accueil
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </TiltedCard>
        </div>
    )
}

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="flex-1 flex flex-col">
                <Suspense fallback={<div className="p-10 text-center">Chargement des résultats...</div>}>
                    <ResultsContent />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}
