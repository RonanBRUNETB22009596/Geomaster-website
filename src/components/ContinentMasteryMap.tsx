"use client"

import { useMemo } from "react"
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map"

// Continent center coordinates
const CONTINENT_CENTERS: Record<string, { lng: number; lat: number; label: string }> = {
    Europe: { lng: 15, lat: 50, label: "Europe" },
    Asia: { lng: 90, lat: 35, label: "Asie" },
    Africa: { lng: 20, lat: 5, label: "Afrique" },
    Americas: { lng: -80, lat: 15, label: "Amériques" },
    Oceania: { lng: 135, lat: -25, label: "Océanie" },
    World: { lng: 0, lat: 0, label: "Monde" }
}

interface ContinentMasteryMapProps {
    masteryData: Record<string, number>
}

function getMasteryColor(count: number): string {
    if (count >= 100) return "rgba(34, 197, 94, 0.9)"
    if (count >= 80) return "rgba(34, 197, 94, 0.72)"
    if (count >= 60) return "rgba(34, 197, 94, 0.54)"
    if (count >= 40) return "rgba(250, 204, 21, 0.7)"
    if (count >= 20) return "rgba(251, 146, 60, 0.7)"
    return "rgba(148, 163, 184, 0.5)"
}

function getMasteryLevel(count: number): string {
    if (count >= 100) return "Maître"
    if (count >= 80) return "Expert"
    if (count >= 60) return "Confirmé"
    if (count >= 40) return "Intermédiaire"
    if (count >= 20) return "Débutant"
    return "Novice"
}

function getMasteryRing(count: number): string {
    if (count >= 100) return "ring-2 ring-emerald-400"
    if (count >= 80) return "ring-2 ring-emerald-500/60"
    if (count >= 60) return "ring-2 ring-emerald-500/40"
    if (count >= 40) return "ring-2 ring-yellow-400/50"
    if (count >= 20) return "ring-2 ring-orange-400/50"
    return "ring-1 ring-slate-400/30"
}

export function ContinentMasteryMap({ masteryData }: ContinentMasteryMapProps) {
    const continents = useMemo(() => {
        return Object.entries(CONTINENT_CENTERS)
            .filter(([key]) => key !== "World")
            .map(([key, data]) => ({
                id: key,
                ...data,
                count: masteryData[key] || 0,
                color: getMasteryColor(masteryData[key] || 0),
                level: getMasteryLevel(masteryData[key] || 0),
                ring: getMasteryRing(masteryData[key] || 0),
                pct: Math.min(100, (masteryData[key] || 0))
            }))
    }, [masteryData])

    const worldCount = masteryData["World"] || 0

    return (
        <div className="relative w-full">
            <div className="h-[320px] md:h-[400px] w-full rounded-xl overflow-hidden">
                <Map
                    theme="dark"
                    center={[20, 20]}
                    zoom={1}
                    attributionControl={false}
                >
                    <MapControls />

                    {continents.map((c) => (
                        <MapMarker key={c.id} longitude={c.lng} latitude={c.lat}>
                            <MarkerContent>
                                <div className="flex flex-col items-center group cursor-default">
                                    {/* Circle indicator */}
                                    <div
                                        className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg ${c.ring} transition-transform group-hover:scale-110`}
                                        style={{ background: c.color }}
                                    >
                                        <span className="text-[11px] md:text-xs font-black text-white drop-shadow-md">
                                            {c.pct}
                                        </span>
                                    </div>

                                    {/* Label */}
                                    <div className="mt-1 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-md">
                                        <p className="text-[10px] md:text-[11px] font-bold text-white whitespace-nowrap leading-tight">{c.label}</p>
                                        <p className="text-[8px] md:text-[9px] text-slate-300 text-center leading-tight">{c.level}</p>
                                    </div>
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    ))}
                </Map>
            </div>

            {/* World badge */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/10 flex items-center gap-3">
                <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${getMasteryRing(worldCount)}`}
                    style={{ background: getMasteryColor(worldCount) }}
                >
                    <span className="text-[10px] font-black text-white">{Math.min(100, worldCount)}</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-white">🌍 Monde</p>
                    <p className="text-[10px] text-slate-400">{getMasteryLevel(worldCount)}</p>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-white/10">
                <div className="font-bold mb-1.5 text-[10px] text-slate-300">Progression (scores 8+/10)</div>
                <div className="flex gap-1 items-center">
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(0) }} />
                    <span className="text-[9px] text-slate-400">0</span>
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(20) }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(40) }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(60) }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(80) }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: getMasteryColor(100) }} />
                    <span className="text-[9px] text-slate-400">100</span>
                </div>
            </div>
        </div>
    )
}
