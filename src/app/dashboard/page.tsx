"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Score } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trophy, Target, TrendingUp, Flame } from "lucide-react"
import { Footer } from "@/components/Footer"
import { ContinentMasteryMap } from "@/components/ContinentMasteryMap"

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

            // Fetch all scores
            const { data: scoresData } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (scoresData) {
                setScores(scoresData as Score[])

                // Calculate mastery: count of scores >= 8/10 per category
                const mastery: Record<string, number> = {}
                const categories = ['World', 'Europe', 'Americas', 'Asia', 'Africa', 'Oceania']

                categories.forEach(cat => {
                    mastery[cat] = scoresData.filter(
                        (s: Score) => s.category === cat && s.score >= 8 && s.total === 10
                    ).length
                })

                setMasteryData(mastery)
            }

            // Fetch streak
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

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <NavBar />
            <div className="container mx-auto py-10 px-4 flex-1">

                <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Parties Jouées</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : scores.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Meilleur Score</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {loading ? "..." : Math.max(0, ...scores.map(s => s.score))} / 10
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {loading ? "..." : (scores.reduce((acc, curr) => acc + curr.score, 0) / (scores.length || 1)).toFixed(1)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={streakWarning > 0 ? 'border-2 border-orange-400' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Streak 🔥
                                {streakWarning > 0 && <span className="ml-2 text-orange-500 text-xs">⚠️ Attention</span>}
                            </CardTitle>
                            <Flame className={`h-4 w-4 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                                {loading ? "..." : streak}
                                {streak > 0 && <span className="text-sm ml-1">parties</span>}
                            </div>
                            {streakWarning > 0 && (
                                <p className="text-xs text-orange-500 mt-1">{streakWarning}/6 strikes. {6 - streakWarning} vies restantes.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Continent Mastery Map */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🌍 Carte de Maîtrise
                            <span className="text-sm font-normal text-muted-foreground">
                                Obtenez 100 scores de 8+/10 par continent pour le débloquer !
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <ContinentMasteryMap masteryData={masteryData} />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Historique des parties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : scores.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">Aucune partie jouée pour le moment.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Note</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scores.slice(0, 20).map((score) => (
                                        <TableRow key={score.id}>
                                            <TableCell>{new Date(score.created_at).toLocaleDateString()} {new Date(score.created_at).toLocaleTimeString()}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 rounded-full text-xs bg-slate-100">
                                                    {score.category || 'World'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-bold">{score.score} / {score.total}</TableCell>
                                            <TableCell>
                                                {(score.score / score.total) >= 0.8 ? '🏆 Excellent' :
                                                    (score.score / score.total) >= 0.5 ? '👍 Bien' : '💪 Peut mieux faire'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
