"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Profile, Question, Score } from "@/lib/definitions"
import { Users, HelpCircle, Trophy, Target, Globe, BookOpen, Flag, MapPin, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = 'overview' | 'users' | 'questions' | 'scores'

// Shared subset
type ScoreRow = Score & { profiles?: { email: string } }

export default function AdminOverviewPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [scores, setScores] = useState<ScoreRow[]>([])
    const [totalViews, setTotalViews] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        setLoading(true)
        const [usersRes, questionsRes, scoresRes, viewsRes] = await Promise.all([
            supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            supabase.from('questions').select('*').order('created_at', { ascending: false }),
            supabase.from('scores').select('*, profiles(email)').order('created_at', { ascending: false }).limit(500),
            supabase.from('page_views').select('*', { count: 'exact', head: true })
        ])

        if (usersRes.data) setUsers(usersRes.data as Profile[])
        if (questionsRes.data) setQuestions(questionsRes.data as Question[])
        if (scoresRes.data) setScores(scoresRes.data as ScoreRow[])
        if (viewsRes.count !== null) setTotalViews(viewsRes.count)

        setLoading(false)
    }

    const stats = useMemo(() => {
        const totalUsers = users.length
        const totalQuestions = questions.length
        const totalGames = scores.length

        const avgScore = scores.length > 0
            ? (scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / scores.length).toFixed(1)
            : '0'

        const categoryCounts: Record<string, number> = {}
        questions.forEach(q => {
            const cat = q.category || 'Non catégorisé'
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
        })

        const typeCounts: Record<string, number> = {}
        questions.forEach(q => {
            typeCounts[q.type] = (typeCounts[q.type] || 0) + 1
        })

        const diffCounts: Record<string, number> = {}
        questions.forEach(q => {
            const d = q.difficulty || 'Non définie'
            diffCounts[d] = (diffCounts[d] || 0) + 1
        })

        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const recentUsers = users.filter(u => new Date(u.created_at) > oneWeekAgo).length
        const recentGames = scores.filter(s => new Date(s.created_at) > oneWeekAgo).length

        return {
            totalUsers, totalQuestions, totalGames, avgScore,
            categoryCounts, typeCounts, diffCounts,
            recentUsers, recentGames
        }
    }, [users, questions, scores])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    const typeLabels: Record<string, string> = {
        'mcq': 'QCM',
        'map_point': 'Carte (ID point)',
        'map_click_name': 'Carte (Clic nom)',
        'map_pinpoint': 'Carte (Pinpoint)',
        'flag': 'Drapeau',
        'trivia': 'Trivia',
        'endonym': 'Endonyme',
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-black text-white">Vue d'ensemble</h1>
                <p className="text-slate-400">Statistiques globales de la plateforme GeoMaster.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visites Uniques</p>
                            <p className="text-3xl font-black text-white mt-1">{totalViews}</p>
                            <p className="text-xs text-slate-400 mt-1">Sur la page d'accueil</p>
                        </div>
                        <div className="p-3 bg-pink-500/20 rounded-xl">
                            <Eye className="w-6 h-6 text-pink-400" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilisateurs</p>
                            <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                            <p className="text-xs text-emerald-400 font-bold mt-1">+{stats.recentUsers} <span className="text-slate-400 font-normal">cette semaine</span></p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</p>
                            <p className="text-3xl font-black text-white mt-1">{stats.totalQuestions}</p>
                            <p className="text-xs text-slate-400 mt-1">{Object.keys(stats.categoryCounts).length} catégories actives</p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <HelpCircle className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parties Jouées</p>
                            <p className="text-3xl font-black text-white mt-1">{stats.totalGames}</p>
                            <p className="text-xs text-emerald-400 font-bold mt-1">+{stats.recentGames} <span className="text-slate-400 font-normal">cette semaine</span></p>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <Trophy className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Score Moyen</p>
                            <p className="text-3xl font-black text-white mt-1">{stats.avgScore}%</p>
                            <p className="text-xs text-slate-400 mt-1">Sur 500 dernières parties</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <Target className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Charts / Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Category Breakdown */}
                <div className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold text-white">Par Catégorie</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                            <div key={cat}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300 font-medium">{cat}</span>
                                    <span className="text-slate-400">{count}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(count / Math.max(1, stats.totalQuestions)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-orange-400" />
                        <h3 className="font-bold text-white">Par Difficulté</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(stats.diffCounts).sort((a, b) => b[1] - a[1]).map(([diff, count]) => (
                            <div key={diff}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300 font-medium">{diff}</span>
                                    <span className="text-slate-400">{count}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-400 rounded-full"
                                        style={{ width: `${(count / Math.max(1, stats.totalQuestions)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Question Types */}
                <div className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold text-white">Types de questions</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        {Object.entries(stats.typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                            const isMap = type.includes('map')
                            const Icon = isMap ? MapPin : (type === 'flag' ? Flag : HelpCircle)
                            return (
                                <div key={type} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg", isMap ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400")}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-200 text-sm font-medium">{typeLabels[type] || type}</span>
                                    </div>
                                    <span className="font-mono text-slate-400">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
