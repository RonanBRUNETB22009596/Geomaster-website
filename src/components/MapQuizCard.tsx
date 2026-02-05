"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map"
import { Question } from "@/lib/definitions"
import { cn } from "@/lib/utils"
import { MapIcon, MousePointer2, Target } from "lucide-react"

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
        if (question.type === 'map_pinpoint' && !isSubmitting) {
            setUserPoint({ lng: e.lngLat.lng, lat: e.lngLat.lat })
        }
    }, [question.type, isSubmitting])

    const handleConfirm = () => {
        if (question.type === 'map_pinpoint' && userPoint) {
            const distance = getDistance(
                userPoint.lat,
                userPoint.lng,
                question.latitude ?? 0,
                question.longitude ?? 0
            )
            if (distance <= 400) {
                onAnswer(question.correct_answer)
            } else {
                onAnswer("WRONG_LOCATION")
            }
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border-none bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapIcon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-500 font-mono">
                            DÉFI CARTE — {currentQuestionIndex + 1} / {totalQuestions}
                        </span>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-slate-900 text-white rounded-full uppercase tracking-widest">
                        {question.difficulty}
                    </span>
                </div>
                <Progress value={progress} className="h-1.5 mb-6" />
                <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 text-center leading-tight">
                    {question.question_text}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className={cn(
                    "relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group",
                    question.type === 'map_pinpoint' && "cursor-crosshair"
                )}>
                    <Map
                        key={question.id}
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

                        {/* Mode Pro : Placement de point par le joueur */}
                        {question.type === 'map_pinpoint' && userPoint && (
                            <MapMarker
                                longitude={userPoint.lng}
                                latitude={userPoint.lat}
                            >
                                <MarkerContent>
                                    <Target className="w-8 h-8 text-rose-500 drop-shadow-lg" />
                                </MarkerContent>
                            </MapMarker>
                        )}
                    </Map>

                    {question.type === 'map_pinpoint' && !userPoint && !hasInteracted && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px] transition-opacity duration-300">
                            <p className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-slate-800 shadow-lg border border-white">
                                Cliquez sur la carte pour placer la ville
                            </p>
                        </div>
                    )}
                </div>

                {/* Choix Multiple pour le mode Débutant */}
                {question.type === 'map_point' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {optionsData.map((option: string, i: number) => (
                            <Button
                                key={i}
                                variant="outline"
                                className="h-14 font-bold border-2 hover:border-primary hover:bg-primary/5 transition-all text-slate-700"
                                onClick={() => onAnswer(option)}
                                disabled={isSubmitting}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>

            {question.type === 'map_pinpoint' && (
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-center">
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
