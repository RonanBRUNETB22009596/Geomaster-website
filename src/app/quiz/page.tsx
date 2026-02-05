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
    status: 'loading' | 'ready' | 'finished' | 'error'
    userAnswers: { questionId: string; answer: string; correct: boolean }[]
}

type Action =
    | { type: 'SET_QUESTIONS'; payload: Question[] }
    | { type: 'ANSWER_QUESTION'; payload: { answer: string; isCorrect: boolean } }
    | { type: 'ERROR'; payload: string }

const initialState: State = {
    questions: [],
    currentIndex: 0,
    score: 0,
    status: 'loading',
    userAnswers: []
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return { ...state, questions: action.payload, status: 'ready' }
        case 'ANSWER_QUESTION':
            const nextIndex = state.currentIndex + 1
            const isFinished = nextIndex >= state.questions.length
            return {
                ...state,
                score: action.payload.isCorrect ? state.score + 1 : state.score,
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

                    dispatch({ type: 'SET_QUESTIONS', payload: finalQuestions })
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
            total: state.questions.length,
            date: new Date().toISOString()
        }))

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { error } = await supabase.from('scores').insert({
                user_id: user.id,
                score: state.score,
                total: state.questions.length,
                category: categoryStr || 'World'
            })

            if (error) {
                console.error("Erreur sauvegarde score:", error)
                toast.error("Votre score n'a pas pu être sauvegardé sur votre compte.")
            } else {
                toast.success("Score sauvegardé !")
            }
        } else {
            console.log("Quiz terminé : Utilisateur non connecté. Score sauvegardé localement uniquement.")
        }

        setSaving(false)
        const params = new URLSearchParams()
        params.set('score', state.score.toString())
        params.set('total', state.questions.length.toString())
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
        <div className="container mx-auto py-10 px-4 flex-1 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-2xl mb-6 flex justify-end">
                <Button
                    variant="ghost"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors gap-2"
                    onClick={() => {
                        if (confirm("Voulez-vous vraiment quitter le quiz ? Votre progression sera perdue.")) {
                            router.push('/')
                        }
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
