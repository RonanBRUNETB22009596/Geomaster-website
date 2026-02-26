"use client"

import { useMemo } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Question } from "@/lib/definitions"
import { cn } from "@/lib/utils"

interface QuizCardProps {
    question: Question
    currentQuestionIndex: number
    totalQuestions: number
    onAnswer: (option: string) => void
    isSubmitting?: boolean
}

export function QuizCard({
    question,
    currentQuestionIndex,
    totalQuestions,
    onAnswer,
    isSubmitting = false
}: QuizCardProps) {
    // Parse options if it's a string (from some legacy DB ingest) or valid array
    const shuffledOptions = useMemo(() => {
        const baseOptions = Array.isArray(question.options)
            ? question.options
            : typeof question.options === 'string'
                ? JSON.parse(question.options)
                : []

        // Fisher-Yates shuffle
        const shuffled = [...baseOptions]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled
    }, [question.id, question.options])

    const progress = ((currentQuestionIndex) / totalQuestions) * 100

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg animate-in fade-in zoom-in duration-300">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground font-mono">
                        Question {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">
                        {question.category || 'Général'}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
                <CardTitle className="text-xl md:text-2xl mt-4 leading-relaxed text-center">
                    {question.question_text}
                </CardTitle>

                {question.media_url && (
                    <div className="mt-6 flex justify-center">
                        <div className="relative w-64 h-40 overflow-hidden rounded-lg shadow-md border border-white/10">
                            <img
                                src={question.media_url}
                                alt="Drapeau"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledOptions.map((option: string, idx: number) => (
                    <Button
                        key={idx}
                        variant="outline"
                        className={cn(
                            "h-auto py-6 text-lg justify-start px-6 whitespace-normal text-left",
                            "hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5",
                            "transition-all duration-200",
                            "active:scale-[0.98] transform"
                        )}
                        onClick={() => onAnswer(option)}
                        disabled={isSubmitting}
                    >
                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                            {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}
