"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Profile, Score } from "@/lib/definitions"
import { Loader2, ArrowLeft, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserHistoryPage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true)

            // Get user profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', params.id)
                .single()

            if (profileData) {
                setProfile(profileData as Profile)
            }

            // Get all scores for this user
            const { data: scoresData } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', params.id)
                .order('created_at', { ascending: false })

            if (scoresData) {
                setScores(scoresData as Score[])
            }

            setLoading(false)
        }

        if (params.id) {
            fetchUserData()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="space-y-6">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                    <Link href="/admin/users"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
                </Button>
                <div className="text-center p-8 text-slate-400">
                    Utilisateur introuvable.
                </div>
            </div>
        )
    }

    const avg = scores.length > 0
        ? (scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length).toFixed(1)
        : '0'
    const best = scores.length > 0
        ? Math.max(...scores.map(s => s.score))
        : 0

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-4">
                <Button asChild variant="ghost" className="w-fit text-white hover:bg-white/10">
                    <Link href="/admin/users"><ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste</Link>
                </Button>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <History className="text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">
                            Historique de {profile.username || profile.email}
                        </h1>
                        <p className="text-sm text-slate-400">
                            {scores.length} parties jouées • Meilleur score: {best}/10 • Moyenne: {avg}/10
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    {scores.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Cet utilisateur n'a joué aucune partie.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-white/5 border-white/10">
                                    <TableHead className="font-bold text-white">Date</TableHead>
                                    <TableHead className="font-bold text-white">Catégorie</TableHead>
                                    <TableHead className="font-bold text-white">Score</TableHead>
                                    <TableHead className="font-bold text-white">Performance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((score) => (
                                    <TableRow key={score.id} className="border-b border-white/5 hover:bg-white/5">
                                        <TableCell className="text-slate-300">
                                            {new Date(score.created_at).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                                                {score.category || 'World'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-bold text-white">
                                            {score.score} / {score.total}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${(score.score / score.total) >= 0.8 ? 'bg-green-500/20 text-green-400' :
                                                (score.score / score.total) >= 0.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {(score.score / score.total) >= 0.8 ? 'Excellent' :
                                                    (score.score / score.total) >= 0.5 ? 'Moyen' : 'Faible'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    )
}
