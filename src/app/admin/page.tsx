"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Profile, Question, Score } from "@/lib/definitions"
import { NavBar } from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Trash2, ShieldAlert, Users, HelpCircle, TrendingUp, BarChart3,
    Search, ChevronDown, ChevronUp, Plus, Eye, EyeOff, Crown, UserX,
    Activity, Globe, MapPin, BookOpen, Flag
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/Footer"
import { cn } from "@/lib/utils"

type Tab = 'overview' | 'users' | 'questions'

type ScoreRow = Score & { profiles?: { email: string } }

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [users, setUsers] = useState<Profile[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [scores, setScores] = useState<ScoreRow[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [searchUsers, setSearchUsers] = useState('')
    const [searchQuestions, setSearchQuestions] = useState('')
    const [sortField, setSortField] = useState<string>('created_at')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
    const router = useRouter()

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            toast.error("Accès refusé. Réservé aux administrateurs.")
            router.push('/')
            return
        }

        setIsAdmin(true)
        fetchAll()
    }

    const fetchAll = async () => {
        setLoading(true)
        const [usersRes, questionsRes, scoresRes] = await Promise.all([
            supabase.from('profiles').select('*').order('created_at', { ascending: false }),
            supabase.from('questions').select('*').order('created_at', { ascending: false }),
            supabase.from('scores').select('*, profiles(email)').order('created_at', { ascending: false }).limit(200),
        ])

        if (usersRes.data) setUsers(usersRes.data as Profile[])
        if (questionsRes.data) setQuestions(questionsRes.data as Question[])
        if (scoresRes.data) setScores(scoresRes.data as ScoreRow[])
        setLoading(false)
    }

    const deleteUser = async (userId: string) => {
        if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return

        // Delete scores first, then profile
        await supabase.from('scores').delete().eq('user_id', userId)
        const { error } = await supabase.from('profiles').delete().eq('id', userId)

        if (error) {
            toast.error("Erreur : " + error.message)
        } else {
            toast.success("Utilisateur supprimé")
            setUsers(users.filter(u => u.id !== userId))
            setScores(scores.filter(s => s.user_id !== userId))
        }
    }

    const deleteQuestion = async (questionId: string) => {
        if (!confirm("Supprimer cette question ?")) return

        const { error } = await supabase.from('questions').delete().eq('id', questionId)
        if (error) {
            toast.error("Erreur : " + error.message)
        } else {
            toast.success("Question supprimée")
            setQuestions(questions.filter(q => q.id !== questionId))
        }
    }

    // ─── Stats ────────────────────────────────────────────────
    const stats = useMemo(() => {
        const totalUsers = users.length
        const totalQuestions = questions.length
        const totalGames = scores.length

        const avgScore = scores.length > 0
            ? (scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / scores.length).toFixed(1)
            : '0'

        // Questions by category
        const categoryCounts: Record<string, number> = {}
        questions.forEach(q => {
            const cat = q.category || 'Non catégorisé'
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
        })

        // Questions by type
        const typeCounts: Record<string, number> = {}
        questions.forEach(q => {
            typeCounts[q.type] = (typeCounts[q.type] || 0) + 1
        })

        // Questions by difficulty
        const diffCounts: Record<string, number> = {}
        questions.forEach(q => {
            const d = q.difficulty || 'Non définie'
            diffCounts[d] = (diffCounts[d] || 0) + 1
        })

        // Recent users (last 7 days)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const recentUsers = users.filter(u => new Date(u.created_at) > oneWeekAgo).length

        // Recent scores (last 7 days)
        const recentGames = scores.filter(s => new Date(s.created_at) > oneWeekAgo).length

        return {
            totalUsers, totalQuestions, totalGames, avgScore,
            categoryCounts, typeCounts, diffCounts,
            recentUsers, recentGames
        }
    }, [users, questions, scores])

    // ─── Filtered lists ───────────────────────────────────────
    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.email.toLowerCase().includes(searchUsers.toLowerCase())
        )
    }, [users, searchUsers])

    const filteredQuestions = useMemo(() => {
        return questions.filter(q =>
            q.question_text.toLowerCase().includes(searchQuestions.toLowerCase()) ||
            q.category?.toLowerCase().includes(searchQuestions.toLowerCase()) ||
            q.correct_answer?.toLowerCase().includes(searchQuestions.toLowerCase())
        )
    }, [questions, searchQuestions])

    if (!isAdmin) return null

    const typeLabels: Record<string, string> = {
        'mcq': 'QCM',
        'map_point': 'Carte (ID point)',
        'map_click_name': 'Carte (Clic nom)',
        'map_pinpoint': 'Carte (Pinpoint)',
        'flag': 'Drapeau',
        'trivia': 'Trivia',
        'endonym': 'Endonyme',
    }

    const TabButton = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all",
                activeTab === tab
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-black/40 backdrop-blur-md border border-white/10 text-white text-slate-300 hover:bg-white/5 hover:text-white/80 border border-slate-200"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="container mx-auto py-8 px-4 flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-2xl">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Administration</h1>
                            <p className="text-sm text-slate-300">Panneau de contrôle GeoMaster</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <TabButton tab="overview" label="Vue d'ensemble" icon={BarChart3} />
                        <TabButton tab="users" label="Utilisateurs" icon={Users} />
                        <TabButton tab="questions" label="Questions" icon={HelpCircle} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                    </div>
                ) : (
                    <>
                        {/* ─── OVERVIEW ─────────────────────────────────────── */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilisateurs</p>
                                                    <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                                                    <p className="text-xs text-emerald-500 font-bold mt-1">+{stats.recentUsers} cette semaine</p>
                                                </div>
                                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                                    <Users className="w-6 h-6 text-blue-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</p>
                                                    <p className="text-3xl font-black text-white mt-1">{stats.totalQuestions}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{Object.keys(stats.categoryCounts).length} catégories</p>
                                                </div>
                                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                                    <HelpCircle className="w-6 h-6 text-purple-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parties jouées</p>
                                                    <p className="text-3xl font-black text-white mt-1">{stats.totalGames}</p>
                                                    <p className="text-xs text-emerald-500 font-bold mt-1">+{stats.recentGames} cette semaine</p>
                                                </div>
                                                <div className="p-3 bg-amber-50 rounded-xl">
                                                    <Activity className="w-6 h-6 text-amber-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Score moyen</p>
                                                    <p className="text-3xl font-black text-white mt-1">{stats.avgScore}%</p>
                                                    <p className="text-xs text-slate-400 mt-1">sur {stats.totalGames} parties</p>
                                                </div>
                                                <div className="p-3 bg-emerald-500/20 rounded-xl">
                                                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Breakdowns */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    {/* By Category */}
                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-primary" />
                                                Par catégorie
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {Object.entries(stats.categoryCounts)
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 8)
                                                .map(([cat, count]) => (
                                                    <div key={cat} className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-200 truncate max-w-[180px]">{cat}</span>
                                                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-white/80">{count}</span>
                                                    </div>
                                                ))}
                                        </CardContent>
                                    </Card>

                                    {/* By Type */}
                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                Par type
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {Object.entries(stats.typeCounts)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([type, count]) => (
                                                    <div key={type} className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-200">{typeLabels[type] || type}</span>
                                                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-white/80">{count}</span>
                                                    </div>
                                                ))}
                                        </CardContent>
                                    </Card>

                                    {/* By Difficulty */}
                                    <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-primary" />
                                                Par difficulté
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {Object.entries(stats.diffCounts)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([diff, count]) => (
                                                    <div key={diff} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                diff === 'Beginner' ? 'bg-emerald-500/200' :
                                                                    diff === 'Intermediate' ? 'bg-amber-500' :
                                                                        diff === 'Professional' ? 'bg-red-500' : 'bg-slate-400'
                                                            )} />
                                                            <span className="text-sm text-slate-200">{diff}</span>
                                                        </div>
                                                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-white/80">{count}</span>
                                                    </div>
                                                ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Scores */}
                                <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                    <CardHeader>
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-primary" />
                                            Dernières parties
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Joueur</TableHead>
                                                        <TableHead>Score</TableHead>
                                                        <TableHead>Catégorie</TableHead>
                                                        <TableHead>Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {scores.slice(0, 10).map((s) => (
                                                        <TableRow key={s.id}>
                                                            <TableCell className="font-medium text-sm">{s.profiles?.email || 'Inconnu'}</TableCell>
                                                            <TableCell>
                                                                <span className={cn(
                                                                    "font-bold text-sm",
                                                                    (s.score / s.total) >= 0.8 ? "text-emerald-600" :
                                                                        (s.score / s.total) >= 0.5 ? "text-amber-600" : "text-red-600"
                                                                )}>
                                                                    {s.score}/{s.total}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-300">{s.category || 'Général'}</TableCell>
                                                            <TableCell className="text-sm text-slate-400">{new Date(s.created_at).toLocaleDateString('fr-FR')}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ─── USERS ────────────────────────────────────────── */}
                        {activeTab === 'users' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Rechercher par email..."
                                            className="pl-10 bg-black/40 backdrop-blur-md border border-white/10 text-white border-slate-200"
                                            value={searchUsers}
                                            onChange={(e) => setSearchUsers(e.target.value)}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-400 font-mono">{filteredUsers.length} résultats</span>
                                </div>

                                <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-white/5">
                                                        <TableHead className="font-bold">Email</TableHead>
                                                        <TableHead className="font-bold">Rôle</TableHead>
                                                        <TableHead className="font-bold">Inscription</TableHead>
                                                        <TableHead className="font-bold text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredUsers.map((user) => (
                                                        <TableRow key={user.id} className="hover:bg-white/10">
                                                            <TableCell className="font-medium">{user.email}</TableCell>
                                                            <TableCell>
                                                                <span className={cn(
                                                                    "px-2.5 py-1 rounded-full text-xs font-bold",
                                                                    user.role === 'admin'
                                                                        ? 'bg-purple-100 text-purple-700'
                                                                        : 'bg-white/10 text-slate-200'
                                                                )}>
                                                                    {user.role === 'admin' && <Crown className="w-3 h-3 inline mr-1" />}
                                                                    {user.role}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-300">
                                                                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                                })}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => deleteUser(user.id)}
                                                                    disabled={user.role === 'admin'}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ─── QUESTIONS ────────────────────────────────────── */}
                        {activeTab === 'questions' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Rechercher une question..."
                                            className="pl-10 bg-black/40 backdrop-blur-md border border-white/10 text-white border-slate-200"
                                            value={searchQuestions}
                                            onChange={(e) => setSearchQuestions(e.target.value)}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-400 font-mono">{filteredQuestions.length} résultats</span>
                                </div>

                                <Card className="border-none shadow-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-white/5">
                                                        <TableHead className="font-bold max-w-[300px]">Question</TableHead>
                                                        <TableHead className="font-bold">Réponse</TableHead>
                                                        <TableHead className="font-bold">Catégorie</TableHead>
                                                        <TableHead className="font-bold">Type</TableHead>
                                                        <TableHead className="font-bold">Difficulté</TableHead>
                                                        <TableHead className="font-bold text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredQuestions.slice(0, 50).map((q) => (
                                                        <TableRow key={q.id} className="hover:bg-white/10">
                                                            <TableCell className="max-w-[300px]">
                                                                <p className="text-sm font-medium text-white/80 truncate">
                                                                    {q.question_text}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-700 px-2 py-1 rounded-full">
                                                                    {q.correct_answer}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-300">{q.category}</TableCell>
                                                            <TableCell>
                                                                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-700 rounded-full font-medium">
                                                                    {typeLabels[q.type] || q.type}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className={cn(
                                                                    "text-xs px-2 py-1 rounded-full font-bold",
                                                                    q.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-700' :
                                                                        q.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                                                                            'bg-red-50 text-red-700'
                                                                )}>
                                                                    {q.difficulty}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => deleteQuestion(q.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        {filteredQuestions.length > 50 && (
                                            <p className="text-center text-xs text-slate-400 py-4">
                                                Affichage des 50 premières questions sur {filteredQuestions.length}. Utilisez la recherche pour filtrer.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    )
}
