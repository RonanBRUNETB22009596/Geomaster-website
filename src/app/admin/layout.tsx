"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { BarChart3, Users, HelpCircle, Settings, ShieldAlert, LogOut, Menu, X, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            router.push('/')
            return
        }

        setIsAdmin(true)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                </div>
            </div>
        )
    }

    if (!isAdmin) return null

    const navItems = [
        { href: '/admin', label: 'Vue d\'ensemble', icon: BarChart3 },
        { href: '/admin/users', label: 'Utilisateurs', icon: Users },
        { href: '/admin/content', label: 'Contenu (Quiz)', icon: HelpCircle },
        { href: '/admin/logs', label: 'Journaux Système', icon: Activity },
        { href: '/admin/settings', label: 'Configuration', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />

            <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-24 gap-6">

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex justify-between items-center mb-4 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl text-white">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className="font-bold">Admin Panel</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Sidebar */}
                <aside className={cn(
                    "md:w-64 flex-shrink-0 flex flex-col gap-2 transition-all",
                    isMobileMenuOpen ? "flex" : "hidden md:flex"
                )}>
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 sticky top-28">
                        <div className="hidden md:flex items-center gap-3 mb-6 p-2">
                            <div className="p-2 bg-red-500/20 rounded-xl">
                                <ShieldAlert className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white leading-tight">Super Admin</h2>
                            </div>
                        </div>

                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all",
                                        isActive
                                            ? "bg-slate-800 text-white shadow-lg border border-white/20"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                                    {item.label}
                                </Link>
                            )
                        })}

                        <div className="mt-8 pt-4 border-t border-white/10">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-slate-400 hover:bg-white/5 hover:text-white"
                            >
                                <LogOut className="w-5 h-5" />
                                Quitter l'Admin
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[500px]">
                    {children}
                </main>

            </div>

            <Footer />
        </div>
    )
}
