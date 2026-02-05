"use client"

import { useMemo } from "react"

// Continent SVG paths - simplified world map regions
const CONTINENT_PATHS: Record<string, { path: string; label: string; labelPos: { x: number; y: number } }> = {
    Europe: {
        path: "M520,120 L580,100 L620,120 L640,160 L620,200 L580,220 L540,200 L500,180 L480,140 L500,120 Z",
        label: "Europe",
        labelPos: { x: 560, y: 160 }
    },
    Asia: {
        path: "M640,80 L780,60 L880,100 L900,180 L860,260 L780,280 L700,260 L640,220 L620,160 L640,120 Z",
        label: "Asie",
        labelPos: { x: 760, y: 170 }
    },
    Africa: {
        path: "M480,220 L540,200 L580,220 L600,280 L580,360 L540,400 L480,380 L440,320 L440,260 L460,220 Z",
        label: "Afrique",
        labelPos: { x: 510, y: 300 }
    },
    Americas: {
        path: "M120,60 L200,40 L280,80 L300,160 L280,260 L240,340 L200,400 L160,440 L120,400 L100,320 L80,240 L100,160 L120,100 Z",
        label: "Amériques",
        labelPos: { x: 180, y: 240 }
    },
    Oceania: {
        path: "M780,320 L860,300 L920,340 L900,400 L840,420 L780,400 L760,360 Z",
        label: "Océanie",
        labelPos: { x: 840, y: 360 }
    },
    World: {
        path: "", // World is represented by the entire map background
        label: "Monde",
        labelPos: { x: 500, y: 460 }
    }
}

interface ContinentMasteryMapProps {
    masteryData: Record<string, number> // { Europe: 45, Asia: 100, ... } - number of 8+/10 scores
}

function getMasteryColor(count: number): string {
    // 0 = white, 20 = very light green, 40 = light, 60 = medium, 80 = dark, 100+ = full green
    if (count >= 100) return "rgba(34, 197, 94, 0.8)"   // green-500
    if (count >= 80) return "rgba(34, 197, 94, 0.64)"
    if (count >= 60) return "rgba(34, 197, 94, 0.48)"
    if (count >= 40) return "rgba(34, 197, 94, 0.32)"
    if (count >= 20) return "rgba(34, 197, 94, 0.16)"
    return "rgba(241, 245, 249, 1)" // slate-100 (almost white)
}

function getMasteryLevel(count: number): string {
    if (count >= 100) return "Maître"
    if (count >= 80) return "Expert"
    if (count >= 60) return "Confirmé"
    if (count >= 40) return "Intermédiaire"
    if (count >= 20) return "Débutant"
    return "Novice"
}

export function ContinentMasteryMap({ masteryData }: ContinentMasteryMapProps) {
    const continents = useMemo(() => {
        return Object.entries(CONTINENT_PATHS)
            .filter(([key]) => key !== "World")
            .map(([key, data]) => ({
                id: key,
                ...data,
                count: masteryData[key] || 0,
                color: getMasteryColor(masteryData[key] || 0),
                level: getMasteryLevel(masteryData[key] || 0)
            }))
    }, [masteryData])

    const worldCount = masteryData["World"] || 0

    return (
        <div className="relative w-full">
            <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto"
                style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
            >
                {/* Ocean pattern */}
                <defs>
                    <pattern id="oceanPattern" patternUnits="userSpaceOnUse" width="40" height="40">
                        <circle cx="20" cy="20" r="1" fill="rgba(59, 130, 246, 0.1)" />
                    </pattern>
                </defs>
                <rect width="1000" height="500" fill="url(#oceanPattern)" />

                {/* Continents */}
                {continents.map((continent) => (
                    <g key={continent.id} className="cursor-pointer transition-all duration-300 hover:brightness-110">
                        <path
                            d={continent.path}
                            fill={continent.color}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                            className="transition-all duration-500"
                        />
                        <text
                            x={continent.labelPos.x}
                            y={continent.labelPos.y}
                            textAnchor="middle"
                            className="fill-white text-xs font-bold pointer-events-none"
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                        >
                            {continent.label}
                        </text>
                        <text
                            x={continent.labelPos.x}
                            y={continent.labelPos.y + 16}
                            textAnchor="middle"
                            className="fill-white/70 text-[10px] pointer-events-none"
                        >
                            {continent.count}/100 • {continent.level}
                        </text>
                    </g>
                ))}

                {/* World indicator */}
                <g className="cursor-pointer">
                    <rect
                        x="420"
                        y="440"
                        width="160"
                        height="40"
                        rx="8"
                        fill={getMasteryColor(worldCount)}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                    />
                    <text
                        x="500"
                        y="458"
                        textAnchor="middle"
                        className="fill-slate-800 text-xs font-bold"
                    >
                        🌍 Monde: {worldCount}/100
                    </text>
                    <text
                        x="500"
                        y="472"
                        textAnchor="middle"
                        className="fill-slate-600 text-[10px]"
                    >
                        {getMasteryLevel(worldCount)}
                    </text>
                </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-[10px] shadow-lg">
                <div className="font-bold mb-1 text-slate-700">Progression</div>
                <div className="flex gap-1 items-center">
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(0) }} />
                    <span className="text-slate-500">0</span>
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(20) }} />
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(40) }} />
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(60) }} />
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(80) }} />
                    <div className="w-3 h-3 rounded" style={{ background: getMasteryColor(100) }} />
                    <span className="text-slate-500">100</span>
                </div>
            </div>
        </div>
    )
}
