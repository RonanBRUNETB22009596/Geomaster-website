"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Score } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy, Target, TrendingUp, Flame, BarChart3, ChevronDown, ChevronUp } from "lucide-react"
import { Footer } from "@/components/Footer"
import { useI18n } from "@/lib/i18n"
import dynamic from "next/dynamic"

const ContinentMasteryMap = dynamic(() => import("@/components/ContinentMasteryMap").then(m => ({ default: m.ContinentMasteryMap })), {
    ssr: false,
    loading: () => <div className="h-48 animate-pulse bg-white/10 rounded-xl" />
})

export default function DashboardPage() {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)
    const [masteryData, setMasteryData] = useState<Record<string, number>>({})
    const [streak, setStreak] = useState(0)
    const [streakWarning, setStreakWarning] = useState(0)
    const [showAll, setShowAll] = useState(false)
    const { t, locale } = useI18n()

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
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="max-w-[1056px] w-full mx-auto pt-24 pb-10 px-6 sm:px-8 xl:px-0 flex-1">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <BarChart3 className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{t('dashboard.title')}</h1>
                        <p className="text-sm text-slate-300">{t('dashboard.subtitle')}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="bg-black border-white/10 shadow-xl text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.games')}</p>
                                    <p className="text-3xl font-black text-white mt-1">{loading ? "..." : scores.length}</p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Target className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10 shadow-xl text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.best_score')}</p>
                                    <p className="text-3xl font-black text-emerald-600 mt-1">{loading ? "..." : best}/10</p>
                                </div>
                                <div className="p-3 bg-emerald-500/20 rounded-xl">
                                    <Trophy className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10 shadow-xl text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('dashboard.average')}</p>
                                    <p className="text-3xl font-black text-blue-600 mt-1">{loading ? "..." : avg}</p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-xl bg-black border-white/10 text-white ${streakWarning > 0 ? 'ring-2 ring-orange-300' : ''}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {t('dashboard.streak')}
                                        {streakWarning > 0 && <span className="ml-1 text-orange-500">⚠️</span>}
                                    </p>
                                    <p className={`text-3xl font-black mt-1 ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`}>
                                        {loading ? "..." : streak}
                                    </p>
                                    {streakWarning > 0 && (
                                        <p className="text-[10px] text-orange-500 mt-1">{streakWarning}/6 {t('dashboard.strikes')}</p>
                                    )}
                                </div>
                                <div className="p-3 bg-orange-500/20 rounded-xl">
                                    <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Continent Mastery Map */}
                <Card className="mb-8 bg-black border-white/10 shadow-xl text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {t('dashboard.mastery_map')}
                            <span className="text-sm font-normal text-slate-400">
                                {t('dashboard.mastery_desc')}
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
                <Card className="bg-black border-white/10 shadow-xl text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('dashboard.history')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : scores.length === 0 ? (
                            <div className="text-center p-8 text-slate-400">{t('dashboard.no_games')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 bg-white/5">
                                            <TableHead className="font-bold text-slate-400">{t('dashboard.date')}</TableHead>
                                            <TableHead className="font-bold text-slate-400">{t('dashboard.category')}</TableHead>
                                            <TableHead className="font-bold text-slate-400">{t('dashboard.score')}</TableHead>
                                            <TableHead className="font-bold text-slate-400">{t('dashboard.grade')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(showAll ? scores : scores.slice(0, 5)).map((score) => (
                                            <TableRow key={score.id} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="text-sm text-white">
                                                    {new Date(score.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
                                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                                                        {score.category || 'World'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-black text-white/90">{score.score} / {score.total}</TableCell>
                                                <TableCell>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${(score.score / score.total) >= 0.8 ? 'bg-green-500/20 text-green-400' :
                                                        (score.score / score.total) >= 0.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {(score.score / score.total) >= 0.8 ? t('dashboard.excellent') :
                                                            (score.score / score.total) >= 0.5 ? t('dashboard.good') : t('dashboard.improve')}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {scores.length > 5 && (
                                    <div className="flex justify-center p-4 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowAll(!showAll)}
                                            className="text-white hover:bg-white/10 rounded-full group"
                                        >
                                            {showAll ? (
                                                <>{t('dashboard.see_less')} <ChevronUp className="ml-2 w-4 h-4 group-hover:-translate-y-1 transition-transform" /></>
                                            ) : (
                                                <>{t('dashboard.see_more')} ({scores.length - 5} {t('dashboard.others')}) <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" /></>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
