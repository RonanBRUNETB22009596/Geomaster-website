"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Score } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function DashboardPage() {
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchScores() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setScores(data as Score[])
            setLoading(false)
        }
        fetchScores()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <NavBar />
            <div className="container mx-auto py-10 px-4 flex-1">

                <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Parties Jouées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : scores.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Meilleur Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {loading ? "..." : Math.max(0, ...scores.map(s => s.score))} / 10
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {loading ? "..." : (scores.reduce((acc, curr) => acc + curr.score, 0) / (scores.length || 1)).toFixed(1)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                                        <TableHead>Score</TableHead>
                                        <TableHead>Note</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scores.map((score) => (
                                        <TableRow key={score.id}>
                                            <TableCell>{new Date(score.created_at).toLocaleDateString()} {new Date(score.created_at).toLocaleTimeString()}</TableCell>
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
