"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Loader2, TrendingUp, Target, Star, Info, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

type LeaderboardEntry = {
    username: string
    avatar_url: string | null
    weighted_score: number
    average_ratio: number
    games_played: number
    best_score: number
    total_points: number
}

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [showInfo, setShowInfo] = useState(false)
    const { t } = useI18n()

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data, error } = await supabase
                .from('leaderboard_view')
                .select('*')
                .order('weighted_score', { ascending: false })
                .limit(20)

            if (data) {
                const formatted = data.map((item: any) => ({
                    username: item.username || item.email?.split('@')[0] || "Anonyme",
                    avatar_url: item.avatar_url || null,
                    weighted_score: Number(item.weighted_score) || 0,
                    average_ratio: Number(item.average_ratio) || 0,
                    games_played: Number(item.games_played) || 0,
                    best_score: Number(item.best_score) || 0,
                    total_points: Number(item.total_points) || 0
                }))
                setEntries(formatted)
            }
            setLoading(false)
        }
        fetchLeaderboard()
    }, [])

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="max-w-[1056px] w-full mx-auto py-32 px-6 sm:px-8 xl:px-0 flex-1">
                <div className="text-center mb-28">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        {t('leaderboard.title')}
                    </h1>
                    <p className="text-white text-lg mb-2">
                        {t('leaderboard.subtitle')}
                    </p>
                </div>

                <Card className="shadow-2xl border-none overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-[32px]">
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white pt-10 pb-8 rounded-t-[32px]">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-8 h-8" />
                            <div>
                                <CardTitle className="text-2xl">{t('leaderboard.top20')}</CardTitle>
                                <p className="text-white/90 text-sm mt-1">
                                    {t('leaderboard.balanced')}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center p-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-center p-20 text-slate-400">
                                {t('leaderboard.empty')}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-white/5 text-white border-b-0">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="w-16 text-center font-bold text-white">{t('leaderboard.rank')}</TableHead>
                                        <TableHead className="font-bold text-white">{t('leaderboard.explorer')}</TableHead>
                                        <TableHead className="text-center font-bold text-white">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-4 h-4" />
                                                {t('leaderboard.score')}
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center font-bold hidden md:table-cell text-white">
                                            <div className="flex items-center justify-center gap-1">
                                                <Target className="w-4 h-4" />
                                                {t('leaderboard.average')}
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center font-bold hidden sm:table-cell text-white">{t('leaderboard.games')}</TableHead>
                                        <TableHead className="text-center font-bold hidden lg:table-cell text-white">{t('leaderboard.record')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((entry, index) => (
                                        <TableRow
                                            key={index}
                                            className={`border-none hover:bg-white/5 transition-colors ${index === 0 ? 'bg-white/10' : ''}`}
                                        >
                                            <TableCell className="text-center">
                                                {index === 0 ? (
                                                    <Medal className="w-7 h-7 text-yellow-500 mx-auto drop-shadow" />
                                                ) : index === 1 ? (
                                                    <Medal className="w-6 h-6 text-slate-400 mx-auto" />
                                                ) : index === 2 ? (
                                                    <Medal className="w-6 h-6 text-amber-600 mx-auto" />
                                                ) : (
                                                    <span className="font-bold text-white">{index + 1}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                                                        <AvatarImage src={entry.avatar_url || undefined} alt={entry.username} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                            {entry.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className={`font-bold ${index < 3 ? 'text-white' : 'text-white/90'}`}>
                                                        {entry.username}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-black text-xl ${index === 0 ? 'text-yellow-600' : 'text-primary'
                                                    }`}>
                                                    {entry.weighted_score.toFixed(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center hidden md:table-cell">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="font-semibold text-white">
                                                        {(entry.average_ratio * 10).toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-white/70">/10</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-white hidden sm:table-cell">
                                                {entry.games_played}
                                            </TableCell>
                                            <TableCell className="text-center hidden lg:table-cell">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    {entry.best_score}/10
                                                </span>
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
        </div >
    )
}
