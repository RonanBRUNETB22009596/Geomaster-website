"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Flame } from "lucide-react"

interface StreakBadgeProps {
    size?: 'sm' | 'md' | 'lg'
    showWarning?: boolean
}

export function StreakBadge({ size = 'md', showWarning = true }: StreakBadgeProps) {
    const [streak, setStreak] = useState<number | null>(null)
    const [warning, setWarning] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStreak() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('profiles')
                .select('streak, streak_warning')
                .eq('id', user.id)
                .single()

            if (data) {
                setStreak(data.streak || 0)
                setWarning(data.streak_warning || 0)
            }
            setLoading(false)
        }
        fetchStreak()
    }, [])

    if (loading || streak === null) return null
    if (streak === 0 && !showWarning) return null

    const sizeClasses = {
        sm: 'text-xs px-2 py-1 gap-1',
        md: 'text-sm px-3 py-1.5 gap-1.5',
        lg: 'text-base px-4 py-2 gap-2'
    }

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    return (
        <div className={`
            inline-flex items-center rounded-full font-bold
            ${streak > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 text-slate-500'}
            ${warning > 0 && showWarning ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
            ${sizeClasses[size]}
        `}>
            <Flame className={`${iconSizes[size]} ${streak > 0 ? 'animate-pulse' : ''}`} />
            <span>{streak}</span>
            {warning > 0 && showWarning && (
                <span className="ml-1 text-orange-200">⚠️</span>
            )}
        </div>
    )
}
