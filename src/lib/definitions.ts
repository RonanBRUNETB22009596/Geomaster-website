export type Question = {
    id: string
    question_text: string
    options: string[] // stored as jsonb array
    correct_answer: string
    category: string
    difficulty: string
    type: string
    media_url?: string
    latitude?: number
    longitude?: number
    created_at: string
}

export type Profile = {
    id: string
    email: string
    role: 'user' | 'admin'
    created_at: string
}

export type Score = {
    id: string
    user_id: string
    score: number
    total: number
    created_at: string
}
