"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Score } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trophy, Target, TrendingUp, Flame, BarChart3 } from "lucide-react"
import { Footer } from "@/components/Footer"
import dynamic from "next/dynamic"

const ContinentMasteryMap = dynamic(() => import("@/components/ContinentMasteryMap").then(m => ({ default: m.ContinentMasteryMap })), {
    ssr: false,
    loading: () => <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />
})

export default function DashboardPage() {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)
    const [masteryData, setMasteryData] = useState<Record<string, number>>({})
    const [streak, setStreak] = useState(0)
    const [streakWarning, setStreakWarning] = useState(0)

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            const { data: scoresData } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (scoresData) {
                setScores(scoresData as Score[])

                const mastery: Record<string, number> = {}
                const categories = ['World', 'Europe', 'Americas', 'Asia', 'Africa', 'Oceania']

                categories.forEach(cat => {
                    mastery[cat] = scoresData.filter(
                        (s: Score) => s.category === cat && s.score >= 8 && s.total === 10
                    ).length
                })

                setMasteryData(mastery)
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('streak, streak_warning')
                .eq('id', user.id)
                .single()

            if (profile) {
                setStreak(profile.streak || 0)
                setStreakWarning(profile.streak_warning || 0)
            }

            setLoading(false)
        }
        fetchData()
    }, [])

    const avg = scores.length > 0
        ? (scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length).toFixed(1)
        : '0'
    const best = scores.length > 0
        ? Math.max(...scores.map(s => s.score))
        : 0

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NavBar />
            <div className="container mx-auto pt-24 pb-10 px-4 flex-1">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <BarChart3 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Tableau de bord</h1>
                        <p className="text-sm text-slate-500">Vos statistiques et votre progression</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="border-none shadow-lg bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parties</p>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{loading ? "..." : scores.length}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Target className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meilleur score</p>
                                    <p className="text-3xl font-black text-emerald-600 mt-1">{loading ? "..." : best}/10</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <Trophy className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Moyenne</p>
                                    <p className="text-3xl font-black text-blue-600 mt-1">{loading ? "..." : avg}</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border-none shadow-lg bg-white ${streakWarning > 0 ? 'ring-2 ring-orange-300' : ''}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Streak 🔥
                                        {streakWarning > 0 && <span className="ml-1 text-orange-500">⚠️</span>}
                                    </p>
                                    <p className={`text-3xl font-black mt-1 ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`}>
                                        {loading ? "..." : streak}
                                    </p>
                                    {streakWarning > 0 && (
                                        <p className="text-[10px] text-orange-500 mt-1">{streakWarning}/6 strikes</p>
                                    )}
                                </div>
                                <div className="p-3 bg-orange-50 rounded-xl">
                                    <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Continent Mastery Map */}
                <Card className="mb-8 border-none shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            🌍 Carte de Maîtrise
                            <span className="text-sm font-normal text-slate-400">
                                100 scores de 8+/10 par continent pour débloquer
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : (
                            <ContinentMasteryMap masteryData={masteryData} />
                        )}
                    </CardContent>
                </Card>

                {/* History */}
                <Card className="border-none shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Historique des parties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : scores.length === 0 ? (
                            <div className="text-center p-8 text-slate-400">Aucune partie jouée pour le moment.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-bold">Date</TableHead>
                                            <TableHead className="font-bold">Catégorie</TableHead>
                                            <TableHead className="font-bold">Score</TableHead>
                                            <TableHead className="font-bold">Note</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.slice(0, 20).map((score) => (
                                            <TableRow key={score.id} className="hover:bg-slate-50/60">
                                                <TableCell className="text-sm text-slate-600">
                                                    {new Date(score.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                        {score.category || 'World'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-black text-slate-800">{score.score} / {score.total}</TableCell>
                                                <TableCell>
                                                    <span className={`text-xs font-bold ${(score.score / score.total) >= 0.8 ? 'text-emerald-600' :
                                                        (score.score / score.total) >= 0.5 ? 'text-amber-600' : 'text-red-500'
                                                        }`}>
                                                        {(score.score / score.total) >= 0.8 ? '🏆 Excellent' :
                                                            (score.score / score.total) >= 0.5 ? '👍 Bien' : '💪 Peut mieux faire'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
