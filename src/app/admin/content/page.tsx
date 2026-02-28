"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Question } from "@/lib/definitions"
import { HelpCircle, Search, Trash2, Edit, Plus, ArrowLeft, Loader2, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function AdminContentPage() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Form state
    const [isEditing, setIsEditing] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setQuestions(data as Question[])
        setLoading(false)
    }

    const filteredQuestions = useMemo(() => {
        return questions.filter(q =>
            q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (q.category || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [questions, searchQuery])

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return

        const { error } = await supabase.from('questions').delete().eq('id', id)

        if (error) {
            toast.error("Erreur de suppression: " + error.message)
        } else {
            toast.success("Question supprimée.")
            setQuestions(questions.filter(q => q.id !== id))
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingQuestion || !editingQuestion.question_text || !editingQuestion.correct_answer) {
            toast.error("Veuillez remplir les champs obligatoires.")
            return
        }

        setSaving(true)
        const isNew = !editingQuestion.id

        // Format options securely into JSON array
        let formattedOptions = editingQuestion.options || []
        if (typeof formattedOptions === 'string') {
            formattedOptions = (formattedOptions as string).split(',').map(s => s.trim())
        }

        const payload = {
            question_text: editingQuestion.question_text,
            options: formattedOptions,
            correct_answer: editingQuestion.correct_answer,
            category: editingQuestion.category || 'Général',
            difficulty: editingQuestion.difficulty || 'Beginner',
            type: editingQuestion.type || 'mcq',
            media_url: editingQuestion.media_url || null,
            latitude: editingQuestion.latitude ? parseFloat(String(editingQuestion.latitude)) : null,
            longitude: editingQuestion.longitude ? parseFloat(String(editingQuestion.longitude)) : null
        }

        let res
        if (isNew) {
            res = await supabase.from('questions').insert([payload]).select().single()
        } else {
            res = await supabase.from('questions').update(payload).eq('id', editingQuestion.id).select().single()
        }

        if (res.error) {
            toast.error("Erreur: " + res.error.message)
        } else {
            toast.success(isNew ? "Question créée" : "Question mise à jour")
            if (isNew) {
                setQuestions([res.data, ...questions])
            } else {
                setQuestions(questions.map(q => q.id === res.data.id ? res.data : q))
            }
            setIsEditing(false)
            setEditingQuestion(null)
        }
        setSaving(false)
    }

    const openEdit = (q?: Question) => {
        if (q) {
            setEditingQuestion(q)
        } else {
            // New question defaults
            setEditingQuestion({
                type: 'mcq',
                difficulty: 'Beginner',
                category: 'Europe',
                options: []
            })
        }
        setIsEditing(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (isEditing && editingQuestion) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(false)} className="bg-transparent border-white/10 text-white hover:bg-white/10">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-black text-white">
                        {editingQuestion.id ? 'Modifier la question' : 'Nouvelle question'}
                    </h1>
                </div>

                <form onSubmit={handleSave} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-white max-w-3xl">
                    <div className="space-y-2">
                        <Label>Question *</Label>
                        <Input
                            value={editingQuestion.question_text || ''}
                            onChange={e => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                            required
                            className="bg-black/40 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Bonne réponse *</Label>
                            <Input
                                value={editingQuestion.correct_answer || ''}
                                onChange={e => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })}
                                required
                                className="bg-black/40 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Options (Séparées par des virgules pour un QCM)</Label>
                            <Input
                                value={Array.isArray(editingQuestion.options) ? editingQuestion.options.join(', ') : editingQuestion.options || ''}
                                onChange={e => setEditingQuestion({ ...editingQuestion, options: e.target.value as any })}
                                className="bg-black/40 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Input
                                value={editingQuestion.category || ''}
                                onChange={e => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                                className="bg-black/40 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Difficulté</Label>
                            <Select
                                value={editingQuestion.difficulty || 'Beginner'}
                                onValueChange={(v: string) => setEditingQuestion({ ...editingQuestion, difficulty: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={editingQuestion.type || 'mcq'}
                                onValueChange={(v: string) => setEditingQuestion({ ...editingQuestion, type: v })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mcq">QCM Classique</SelectItem>
                                    <SelectItem value="map_point">Carte: ID Point</SelectItem>
                                    <SelectItem value="map_click_name">Carte: Clic Nom</SelectItem>
                                    <SelectItem value="map_pinpoint">Carte: Pinpoint</SelectItem>
                                    <SelectItem value="flag">Drapeau</SelectItem>
                                    <SelectItem value="trivia">Trivia</SelectItem>
                                    <SelectItem value="endonym">Endonyme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Coordinates for map questions */}
                    {(editingQuestion.type?.includes('map') || editingQuestion.type === 'flag') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="space-y-2">
                                <Label>Latitude</Label>
                                <Input
                                    type="number" step="any"
                                    value={editingQuestion.latitude || ''}
                                    onChange={e => setEditingQuestion({ ...editingQuestion, latitude: e.target.value as any })}
                                    className="bg-black/40 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Longitude</Label>
                                <Input
                                    type="number" step="any"
                                    value={editingQuestion.longitude || ''}
                                    onChange={e => setEditingQuestion({ ...editingQuestion, longitude: e.target.value as any })}
                                    className="bg-black/40 border-white/10"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Image URL (Optionnel)</Label>
                        <Input
                            value={editingQuestion.media_url || ''}
                            onChange={e => setEditingQuestion({ ...editingQuestion, media_url: e.target.value })}
                            placeholder="https://..."
                            className="bg-black/40 border-white/10"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-white/20 text-white">Annuler</Button>
                        <Button type="submit" disabled={saving} className="bg-primary text-white hover:bg-primary/90 gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-purple-400" />
                        Gestion du Contenu
                    </h1>
                    <p className="text-sm text-slate-400">Ajoutez, modifiez ou supprimez des questions de quiz.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher une question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <Button onClick={() => openEdit()} className="bg-primary text-white hover:bg-primary/90 gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </Button>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                                <th className="p-4 font-semibold">Question ({filteredQuestions.length})</th>
                                <th className="p-4 font-semibold">Réponse</th>
                                <th className="p-4 font-semibold">Cat/Diff</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Aucune question trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <tr key={q.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 max-w-xs truncate">
                                            <p className="font-semibold text-white truncate" title={q.question_text}>{q.question_text}</p>
                                            <p className="text-xs text-slate-400">{q.type}</p>
                                        </td>
                                        <td className="p-4 text-emerald-400 font-medium">
                                            {q.correct_answer}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-semibold px-2 py-1 bg-white/10 text-white rounded-md mr-2">{q.category}</span>
                                            <span className={`text-xs px-2 py-1 rounded-md ${q.difficulty === 'Professional' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{q.difficulty}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(q)}
                                                    className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(q.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
