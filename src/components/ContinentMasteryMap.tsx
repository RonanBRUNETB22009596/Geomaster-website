"use client"

import { useMemo } from "react"

// Continent SVG paths - simplified world map regions
const CONTINENT_PATHS: Record<string, { path: string; label: string; labelPos: { x: number; y: number } }> = {
    Europe: {
        path: "M520,120 C 560,80 600,100 620,120 C 660,160 630,220 580,220 C 520,220 480,200 480,140 C 480,120 500,100 520,120 Z",
        label: "Europe",
        labelPos: { x: 560, y: 160 }
    },
    Asia: {
        path: "M640,80 C 740,40 840,60 880,100 C 930,150 900,230 860,260 C 800,300 700,280 640,220 C 600,180 600,120 640,80 Z",
        label: "Asie",
        labelPos: { x: 760, y: 170 }
    },
    Africa: {
        path: "M480,220 C 520,190 560,200 580,220 C 620,260 610,320 580,360 C 560,400 520,420 480,380 C 420,320 420,280 440,260 C 450,240 460,230 480,220 Z",
        label: "Afrique",
        labelPos: { x: 510, y: 300 }
    },
    Americas: {
        path: "M 120,60 C 180,20 220,20 280,80 C 320,130 310,200 280,260 C 260,300 260,320 240,340 C 200,420 180,480 120,400 C 80,340 60,300 80,240 C 100,180 80,140 120,60 Z",
        label: "Amériques",
        labelPos: { x: 180, y: 240 }
    },
    Oceania: {
        path: "M780,320 C 840,290 900,320 920,340 C 940,380 880,440 840,420 C 780,400 740,360 780,320 Z",
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
