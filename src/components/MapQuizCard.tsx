"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map"
import { Question } from "@/lib/definitions"
import { cn } from "@/lib/utils"
import { MapIcon, MousePointer2, Target, MapPin, Navigation } from "lucide-react"

interface MapQuizCardProps {
    question: Question
    currentQuestionIndex: number
    totalQuestions: number
    onAnswer: (answer: string) => void
    isSubmitting?: boolean
}

// Distance helper (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

export function MapQuizCard({
    question,
    currentQuestionIndex,
    totalQuestions,
    onAnswer,
    isSubmitting = false
}: MapQuizCardProps) {
    const [userPoint, setUserPoint] = useState<{ lng: number; lat: number } | null>(null)
    const [hasInteracted, setHasInteracted] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultDistance, setResultDistance] = useState<number | null>(null)
    const [resultIsCorrect, setResultIsCorrect] = useState(false)

    const progress = (currentQuestionIndex / totalQuestions) * 100

    const optionsData = useMemo(() => {
        if (!question.options) return []
        try {
            return typeof question.options === 'string'
                ? JSON.parse(question.options)
                : question.options
        } catch (e) {
            return []
        }
    }, [question.options])

    const handleMapClick = useCallback((e: any) => {
        setHasInteracted(true)
        if (question.type === 'map_pinpoint' && !isSubmitting && !showResult) {
            setUserPoint({ lng: e.lngLat.lng, lat: e.lngLat.lat })
        }
    }, [question.type, isSubmitting, showResult])

    const handleConfirm = () => {
        if (question.type === 'map_pinpoint' && userPoint) {
            const distance = getDistance(
                userPoint.lat,
                userPoint.lng,
                question.latitude ?? 0,
                question.longitude ?? 0
            )
            setResultDistance(Math.round(distance))
            setResultIsCorrect(distance <= 400)
            setShowResult(true)
        }
    }

    const handleContinue = () => {
        if (resultIsCorrect) {
            onAnswer(question.correct_answer)
        } else {
            onAnswer("WRONG_LOCATION")
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 bg-black/40 backdrop-blur-md text-white border border-white/10">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapIcon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-300 font-mono">
                            DÉFI CARTE — {currentQuestionIndex + 1} / {totalQuestions}
                        </span>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-white/10 text-white rounded-full uppercase tracking-widest border border-white/20">
                        {question.difficulty ? `(${question.difficulty}) ` : ''}{question.category || 'Général'}
                    </span>
                </div>
                <Progress value={progress} className="h-1.5 mb-6 bg-white/10" />
                <CardTitle className="text-2xl md:text-3xl font-black text-white text-center leading-tight">
                    {question.question_text}
                </CardTitle>
                {question.type === 'map_pinpoint' && !showResult && (
                    <p className="text-center text-sm text-slate-300 mt-2 flex items-center justify-center gap-1.5">
                        <MapIcon className="w-3.5 h-3.5" />
                        Réponse correcte dans un rayon de 400 km
                    </p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                <div className={cn(
                    "relative h-[220px] md:h-[260px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group",
                    question.type === 'map_pinpoint' && !showResult && "cursor-crosshair"
                )}>
                    <Map
                        key={question.id}
                        theme="light"
                        center={[
                            question.type === 'map_point' || question.type === 'map_pinpoint' ? (question.longitude ?? 0) : 0,
                            question.type === 'map_point' || question.type === 'map_pinpoint' ? (question.latitude ?? 20) : 20
                        ]}
                        zoom={question.type === 'map_point' ? 4 : 1}
                        onClick={handleMapClick}
                        attributionControl={false}
                    >
                        <MapControls />

                        {/* Mode Débutant : Un seul point fixe */}
                        {question.type === 'map_point' && (
                            <MapMarker
                                longitude={question.longitude ?? 0}
                                latitude={question.latitude ?? 0}
                            >
                                <MarkerContent>
                                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl animate-pulse" />
                                </MarkerContent>
                            </MapMarker>
                        )}

                        {/* Mode Intermédiaire : 4 points à cliquer */}
                        {question.type === 'map_click_name' && optionsData.map((opt: any, i: number) => (
                            <MapMarker
                                key={i}
                                longitude={opt.longitude}
                                latitude={opt.latitude}
                                onClick={() => {
                                    if (!isSubmitting) {
                                        onAnswer(opt.name)
                                    }
                                }}
                            >
                                <MarkerContent>
                                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-primary shadow-lg hover:scale-125 transition-transform cursor-pointer group-hover:bg-primary/10">
                                        <MousePointer2 className="w-4 h-4 text-primary" />
                                    </div>
                                </MarkerContent>
                            </MapMarker>
                        ))}

                        {/* Mode Pro : Point placé par le joueur (orange en résultat, rose sinon) */}
                        {question.type === 'map_pinpoint' && userPoint && (
                            <MapMarker
                                longitude={userPoint.lng}
                                latitude={userPoint.lat}
                            >
                                <MarkerContent>
                                    {showResult ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-5 h-5 bg-orange-500 rounded-full border-3 border-white shadow-xl" />
                                            <span className="mt-1 text-[10px] font-bold text-orange-600 bg-white/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                                                Votre réponse
                                            </span>
                                        </div>
                                    ) : (
                                        <Target className="w-8 h-8 text-rose-500 drop-shadow-lg" />
                                    )}
                                </MarkerContent>
                            </MapMarker>
                        )}

                        {/* Résultat : Marqueur vert à la bonne position */}
                        {showResult && question.type === 'map_pinpoint' && (
                            <MapMarker
                                longitude={question.longitude ?? 0}
                                latitude={question.latitude ?? 0}
                            >
                                <MarkerContent>
                                    <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                        <MapPin className="w-8 h-8 text-emerald-500 drop-shadow-lg fill-emerald-500" />
                                        <span className="mt-1 text-[10px] font-bold text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                                            {question.correct_answer}
                                        </span>
                                    </div>
                                </MarkerContent>
                            </MapMarker>
                        )}
                    </Map>

                    {question.type === 'map_pinpoint' && !userPoint && !hasInteracted && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px] transition-opacity duration-300">
                            <p className="bg-slate-900/90 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                                Cliquez sur la carte pour placer la ville
                            </p>
                        </div>
                    )}
                </div>

                {/* Résultat : Bannière cliquable = bouton continuer */}
                {showResult && resultDistance !== null && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            console.log('Continue clicked', resultIsCorrect)
                            handleContinue()
                        }}
                        className={cn(
                            "relative z-50 w-full h-auto flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98]",
                            resultIsCorrect
                                ? "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-400"
                                : "bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400"
                        )}
                    >
                        <Navigation className={cn(
                            "w-5 h-5 shrink-0",
                            resultIsCorrect ? "text-emerald-400" : "text-red-400"
                        )} />
                        <span className={cn(
                            "text-sm font-bold",
                            resultIsCorrect ? "text-emerald-400" : "text-red-400"
                        )}>
                            {resultIsCorrect
                                ? `Bravo ! Vous étiez à ${resultDistance} km — Cliquez pour continuer →`
                                : `Raté ! Vous étiez à ${resultDistance} km — Cliquez pour continuer →`
                            }
                        </span>
                    </Button>
                )}

                {/* Choix Multiple pour le mode Débutant */}
                {question.type === 'map_point' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {optionsData.map((option: string, i: number) => (
                            <Button
                                key={i}
                                variant="outline"
                                className="h-14 font-bold border border-white/10 bg-white/5 hover:border-primary hover:bg-primary/20 hover:text-white transition-all text-white"
                                onClick={() => onAnswer(option)}
                                disabled={isSubmitting}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>

            {question.type === 'map_pinpoint' && !showResult && (
                <CardFooter className="bg-transparent border-t border-white/10 p-6 flex justify-center mt-4">
                    <Button
                        size="lg"
                        className="px-12 font-black rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105"
                        disabled={!userPoint || isSubmitting}
                        onClick={handleConfirm}
                    >
                        Valider ma position
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
