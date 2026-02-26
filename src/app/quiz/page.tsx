"use client"

import { Suspense, useEffect, useReducer, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Question } from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { NavBar } from "@/components/NavBar"
import { QuizCard } from "@/components/QuizCard"
import { MapQuizCard } from "@/components/MapQuizCard"

// State Management
type State = {
    questions: Question[]
    currentIndex: number
    score: number
    pointMultiplier: number
    status: 'loading' | 'ready' | 'finished' | 'error'
    userAnswers: { questionId: string; answer: string; correct: boolean }[]
}

type Action =
    | { type: 'SET_QUESTIONS'; payload: { questions: Question[]; multiplier: number } }
    | { type: 'ANSWER_QUESTION'; payload: { answer: string; isCorrect: boolean } }
    | { type: 'ERROR'; payload: string }

const initialState: State = {
    questions: [],
    currentIndex: 0,
    score: 0,
    pointMultiplier: 1,
    status: 'loading',
    userAnswers: []
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return { ...state, questions: action.payload.questions, pointMultiplier: action.payload.multiplier, status: 'ready' }
        case 'ANSWER_QUESTION':
            const nextIndex = state.currentIndex + 1
            const isFinished = nextIndex >= state.questions.length
            const pointsEarned = action.payload.isCorrect ? state.pointMultiplier : 0
            return {
                ...state,
                score: state.score + pointsEarned,
                currentIndex: nextIndex,
                status: isFinished ? 'finished' : 'ready',
                userAnswers: [...state.userAnswers, {
                    questionId: state.questions[state.currentIndex].id,
                    answer: action.payload.answer,
                    correct: action.payload.isCorrect
                }]
            }
        case 'ERROR':
            return { ...state, status: 'error' }
        default:
            return state
    }
}

function QuizContent() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryStr = searchParams.get('category')
    const difficultyStr = searchParams.get('difficulty')

    useEffect(() => {
        async function fetchQuestions() {
            let query = supabase.from('questions').select('*')

            if (categoryStr && categoryStr !== 'World') {
                query = query.eq('category', categoryStr)
            }
            if (difficultyStr) {
                query = query.eq('difficulty', difficultyStr)
            }

            const { data, error } = await query

            if (error) {
                toast.error("Erreur lors du chargement des questions")
                dispatch({ type: 'ERROR', payload: error.message })
                return
            }

            if (data) {
                if (data.length === 0) {
                    dispatch({ type: 'ERROR', payload: "Aucune question pour cette catégorie." })
                } else {
                    // 1. Separate map and text questions FROM THE FILTERED DATA
                    const mapQuestions = data.filter(q => ['map_point', 'map_click_name', 'map_pinpoint'].includes(q.type))
                    const textQuestions = data.filter(q => !['map_point', 'map_click_name', 'map_pinpoint'].includes(q.type))

                    // 2. Shuffle both
                    const shuffledMap = [...mapQuestions].sort(() => 0.5 - Math.random())
                    const shuffledText = [...textQuestions].sort(() => 0.5 - Math.random())

                    // 3. Define how many map questions to include (3-4 if possible)
                    const mapCountTotal = Math.min(shuffledMap.length, 3 + Math.floor(Math.random() * 2))

                    // 4. Build final 10 questions ONLY from this data
                    const finalQuestions = [
                        ...shuffledMap.slice(0, mapCountTotal),
                        ...shuffledText.slice(0, 10 - mapCountTotal)
                    ].sort(() => 0.5 - Math.random())

                    // 5. Calculate point multiplier based on difficulty
                    const multiplier = difficultyStr === 'Professional' ? 2 : difficultyStr === 'Intermediate' ? 1.5 : 1

                    dispatch({ type: 'SET_QUESTIONS', payload: { questions: finalQuestions, multiplier } })
                }
            }
        }
        fetchQuestions()
    }, [categoryStr])

    useEffect(() => {
        if (state.status === 'finished') {
            finishQuiz()
        }
    }, [state.status])

    const finishQuiz = async () => {
        setSaving(true)
        localStorage.setItem('lastScore', JSON.stringify({
            score: state.score,
            total: state.questions.length * state.pointMultiplier,
            date: new Date().toISOString()
        }))

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Save score
            const { error } = await supabase.from('scores').insert({
                user_id: user.id,
                score: state.score,
                total: state.questions.length * state.pointMultiplier,
                category: categoryStr || 'World'
            })

            if (error) {
                console.error("Erreur sauvegarde score:", error)
                toast.error("Votre score n'a pas pu être sauvegardé sur votre compte.")
            } else {
                toast.success("Score sauvegardé !")
            }

            // Manage streak (based on ratio >= 80%)
            const maxScore = state.questions.length * state.pointMultiplier
            const scoreRatio = state.score / maxScore
            const isGoodScore = scoreRatio >= 0.8
            const { data: profile } = await supabase
                .from('profiles')
                .select('streak, streak_warning')
                .eq('id', user.id)
                .single()

            if (profile) {
                const currentStreak = profile.streak || 0
                const currentWarning = profile.streak_warning || 0

                if (isGoodScore) {
                    // Good score: increment streak, reset warning
                    await supabase.from('profiles').update({
                        streak: currentStreak + 1,
                        streak_warning: 0
                    }).eq('id', user.id)

                    if (currentStreak + 1 > 1) {
                        toast.success(`🔥 Streak de ${currentStreak + 1} !`, { duration: 2000 })
                    }
                } else {
                    // Bad score
                    const newWarningCount = currentWarning + 1

                    if (newWarningCount >= 6) {
                        // 6th failure (or more): reset streak
                        await supabase.from('profiles').update({
                            streak: 0,
                            streak_warning: 0
                        }).eq('id', user.id)

                        if (currentStreak > 0) {
                            toast.error(`💔 Streak perdu ! (6 mauvaises parties consécutives)`, { duration: 4000 })
                        }
                    } else {
                        // Increment warning/strikes
                        await supabase.from('profiles').update({
                            streak_warning: newWarningCount
                        }).eq('id', user.id)

                        if (currentStreak > 0) {
                            const remainingLives = 6 - newWarningCount
                            toast.warning(`⚠️ Attention ! Plus que ${remainingLives} chances avant de perdre votre streak !`, { duration: 3000 })
                        }
                    }
                }
            }
        } else {
            console.log("Quiz terminé : Utilisateur non connecté. Score sauvegardé localement uniquement.")
        }

        setSaving(false)
        const maxScoreTotal = state.questions.length * state.pointMultiplier
        const params = new URLSearchParams()
        params.set('score', state.score.toString())
        params.set('total', maxScoreTotal.toString())
        if (categoryStr) params.set('category', categoryStr)
        router.push(`/results?${params.toString()}`)
    }

    const handleAnswer = (answer: string) => {
        const currentQuestion = state.questions[state.currentIndex]
        const isCorrect = currentQuestion.correct_answer === answer
        if (isCorrect) toast.success("Bonne réponse !", { duration: 1000 })
        else toast.error(`Mauvaise réponse : ${currentQuestion.correct_answer}`, { duration: 2000 })
        dispatch({ type: 'ANSWER_QUESTION', payload: { answer, isCorrect } })
    }

    if (state.status === 'loading') {
        return (
            <div className="container mx-auto max-w-2xl flex flex-col gap-4 mt-20 p-4">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-64 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" />
                </div>
            </div>
        )
    }

    if (state.status === 'error') {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Oups !</h2>
                <p className="text-slate-600 mb-8">Nous n'avons pas trouvé de questions pour cette catégorie.</p>
                <button onClick={() => router.push('/quiz')} className="text-primary hover:underline">
                    Essayer le quiz général
                </button>
            </div>
        )
    }

    if (state.status === 'finished' || saving) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const currentQuestion = state.questions[state.currentIndex]
    const isMapQuestion = ['map_point', 'map_click_name', 'map_pinpoint'].includes(currentQuestion.type)

    return (
        <div className="container mx-auto pt-20 pb-10 px-4 flex-1 flex flex-col items-center relative">
            <div className="w-full max-w-4xl mb-4 flex justify-end">
                <Button
                    variant="outline"
                    className="text-slate-500 border-slate-300 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors gap-2"
                    onClick={() => {
                        router.push('/')
                    }}
                >
                    <X className="w-4 h-4" />
                    Quitter le quiz
                </Button>
            </div>

            {isMapQuestion ? (
                <MapQuizCard
                    question={currentQuestion}
                    currentQuestionIndex={state.currentIndex}
                    totalQuestions={state.questions.length}
                    onAnswer={handleAnswer}
                />
            ) : (
                <QuizCard
                    question={currentQuestion}
                    currentQuestionIndex={state.currentIndex}
                    totalQuestions={state.questions.length}
                    onAnswer={handleAnswer}
                />
            )}
        </div>
    )
}

export default function QuizPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <NavBar />
            <Suspense fallback={<div className="p-10 text-center">Chargement du quiz...</div>}>
                <QuizContent />
            </Suspense>
        </div>
    )
}
