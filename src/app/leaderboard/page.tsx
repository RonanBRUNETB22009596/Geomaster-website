"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, Loader2 } from "lucide-react"

type LeaderboardEntry = {
    username: string
    total_points: number
    games_played: number
    last_played_at: string
}

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data, error } = await supabase
                .from('leaderboard_view')
                .select('*')
                .order('total_points', { ascending: false })
                .limit(20)

            if (data) {
                const formatted = data.map((item: any) => ({
                    username: item.username || item.email?.split('@')[0] || "Anonyme",
                    total_points: item.total_points,
                    games_played: item.games_played,
                    last_played_at: item.last_played_at
                }))
                setEntries(formatted)
            }
            setLoading(false)
        }
        fetchLeaderboard()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <NavBar />
            <div className="container mx-auto py-32 px-4 flex-1">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Classement Mondial
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Les meilleurs explorateurs de GeoMaster (Cumul des points).
                        </p>
                    </div>

                    <Card className="shadow-2xl border-none overflow-hidden">
                        <CardHeader className="bg-primary text-white pb-8">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-8 h-8" />
                                <CardTitle className="text-2xl">Top 20 Explorateurs</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex justify-center p-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                </div>
                            ) : entries.length === 0 ? (
                                <div className="text-center p-20 text-slate-400">
                                    Aucun explorateur enregistré pour le moment. Soyez le premier !
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-20 text-center font-bold">Rang</TableHead>
                                            <TableHead className="font-bold">Explorateur</TableHead>
                                            <TableHead className="text-right font-bold">Points Totaux</TableHead>
                                            <TableHead className="text-right font-bold hidden sm:table-cell">Parties</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entries.map((entry, index) => (
                                            <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="text-center">
                                                    {index === 0 ? (
                                                        <Medal className="w-6 h-6 text-yellow-500 mx-auto" />
                                                    ) : index === 1 ? (
                                                        <Medal className="w-6 h-6 text-slate-400 mx-auto" />
                                                    ) : index === 2 ? (
                                                        <Medal className="w-6 h-6 text-amber-600 mx-auto" />
                                                    ) : (
                                                        <span className="font-bold text-slate-400">{index + 1}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-slate-700">{entry.username}</span>
                                                </TableCell>
                                                <TableCell className="text-right font-black text-lg text-primary">
                                                    {entry.total_points} <span className="text-xs text-slate-400 font-medium">pts</span>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-400 text-sm hidden sm:table-cell">
                                                    {entry.games_played}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}
