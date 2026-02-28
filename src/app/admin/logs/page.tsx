"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Activity, AlertTriangle, Eye, Loader2 } from "lucide-react"

export default function AdminLogsPage() {
    const [pageViews, setPageViews] = useState<any[]>([])
    const [errorLogs, setErrorLogs] = useState<any[]>([])
    const [loadingViews, setLoadingViews] = useState(true)
    const [loadingErrors, setLoadingErrors] = useState(true)

    useEffect(() => {
        fetchPageViews()
        fetchErrorLogs()
    }, [])

    const fetchPageViews = async () => {
        setLoadingViews(true)
        const { data } = await supabase
            .from('page_views')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (data) setPageViews(data)
        setLoadingViews(false)
    }

    const fetchErrorLogs = async () => {
        setLoadingErrors(true)
        const { data } = await supabase
            .from('error_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (data) setErrorLogs(data)
        setLoadingErrors(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-400" />
                    Journaux Système
                </h1>
                <p className="text-sm text-slate-400">Consultez l'historique récent des visites et des erreurs d'application.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Page Views Log */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <h2 className="font-bold text-white">Dernières visites (100)</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {loadingViews ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : pageViews.length === 0 ? (
                            <p className="text-slate-500 text-center py-10 text-sm">Aucune visite enregistrée.</p>
                        ) : (
                            pageViews.map(view => (
                                <div key={view.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-sm border border-white/5">
                                    <span className="text-blue-300 font-mono">{view.path}</span>
                                    <span className="text-slate-400 text-xs">
                                        {new Date(view.created_at).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Error Logs */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-red-500/10">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h2 className="font-bold text-white">Erreurs d'application (100)</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {loadingErrors ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-6 h-6 animate-spin text-red-400" />
                            </div>
                        ) : errorLogs.length === 0 ? (
                            <p className="text-slate-500 text-center py-10 text-sm">Aucune erreur enregistrée.</p>
                        ) : (
                            errorLogs.map(log => (
                                <div key={log.id} className="p-3 bg-red-500/10 rounded-xl text-sm border border-red-500/20 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-300 font-bold">{log.message}</span>
                                        <span className="text-slate-400 text-xs">
                                            {new Date(log.created_at).toLocaleString('fr-FR')}
                                        </span>
                                    </div>
                                    {log.stack && (
                                        <pre className="text-xs text-red-200/70 p-2 bg-black/40 rounded overflow-x-auto">
                                            {log.stack}
                                        </pre>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
