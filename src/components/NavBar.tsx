"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, User, LogOut, Settings, Trophy, ShieldAlert, Languages, Bell } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function NavBar() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [notifications, setNotifications] = useState<any[]>([])

    useEffect(() => {
        const loadUserAndProfile = async (sessionUser: any) => {
            if (!sessionUser) {
                setProfile(null)
                return
            }
            const { data } = await supabase
                .from('profiles')
                .select('avatar_url, username, role')
                .eq('id', sessionUser.id)
                .single()
            setProfile(data)
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            const sessionUser = session?.user ?? null
            setUser(sessionUser)
            loadUserAndProfile(sessionUser)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null
            setUser(sessionUser)
            loadUserAndProfile(sessionUser)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Fetch notifications for logged-in user
    useEffect(() => {
        if (!user) return
        const fetchNotifs = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)
            if (data) setNotifications(data)
        }
        fetchNotifs()
    }, [user])

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ read: true }).eq('id', id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const unreadCount = notifications.filter(n => !n.read).length

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        window.location.href = '/'
    }

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    const { locale, setLocale, t } = useI18n();

    return (
        <nav className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] sm:w-[calc(100%-64px)] max-w-[1056px] h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-[75px] shadow-2xl transition-all duration-300">
            <div className="flex h-full items-center justify-between px-6 sm:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
                    <div className="bg-white p-1 rounded-full shadow-sm flex items-center justify-center w-8 h-8">
                        <Image src="/logo.png" alt="GeoMaster" width={24} height={24} className="rounded-full object-contain" />
                    </div>
                    <span className="text-white drop-shadow-md hidden sm:inline">GeoMaster</span>
                </Link>


                <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <button
                        onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10 uppercase tracking-wider"
                        title={locale === 'fr' ? 'Switch to English' : 'Passer en Français'}
                    >
                        <Languages className="w-3.5 h-3.5" />
                        {locale === 'fr' ? 'FR' : 'EN'}
                    </button>

                    {/* Notifications Bell */}
                    {user && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className="relative flex items-center justify-center w-9 h-9 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10">
                                    <Bell className="w-4 h-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72 mt-4 rounded-2xl max-h-80 overflow-y-auto" align="end" forceMount>
                                <DropdownMenuLabel className="font-bold text-sm">
                                    Notifications
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        Aucune notification
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <DropdownMenuItem
                                            key={n.id}
                                            className={`flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl ${!n.read ? 'bg-primary/5' : ''}`}
                                            onClick={() => markAsRead(n.id)}
                                        >
                                            <span className="font-semibold text-xs flex items-center gap-2">
                                                {!n.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                                                {n.title || 'Notification'}
                                            </span>
                                            <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>
                                            <span className="text-[10px] text-muted-foreground/60">
                                                {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 p-0 overflow-hidden">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={profile?.avatar_url || ""} />
                                        <AvatarFallback className="bg-primary/20 text-white font-bold text-xs">
                                            {profile?.username?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-4 rounded-3xl" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{profile?.username || t('nav.my_account')}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {isAdmin && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer rounded-xl text-emerald-600 focus:text-emerald-700 font-medium">
                                                <ShieldAlert className="mr-2 h-4 w-4" />
                                                {t('nav.admin')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}

                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer rounded-xl">
                                        <User className="mr-2 h-4 w-4" />
                                        {t('nav.dashboard')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer rounded-xl">
                                        <Settings className="mr-2 h-4 w-4" />
                                        {t('nav.settings')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/leaderboard" className="cursor-pointer rounded-xl">
                                        <Trophy className="mr-2 h-4 w-4" />
                                        Classement
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer rounded-xl">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('nav.logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild className="rounded-full px-6 h-9 bg-white text-slate-900 hover:bg-slate-100 font-bold border-none text-sm">
                            <Link href="/login">{t('nav.login')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
