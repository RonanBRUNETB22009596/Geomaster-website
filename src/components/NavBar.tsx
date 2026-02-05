"use client"

import Link from "next/link"
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
import { Globe, User, LogOut, ShieldAlert } from "lucide-react"

export function NavBar() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        const loadUserAndProfile = async (sessionUser: any) => {
            if (!sessionUser) {
                setProfile(null)
                return
            }
            const { data } = await supabase
                .from('profiles')
                .select('avatar_url, username')
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

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    return (
        <nav className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-64px)] max-w-5xl h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-[75px] shadow-2xl transition-all duration-300">
            <div className="flex h-full items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                        <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-white drop-shadow-md hidden sm:inline">GeoMaster</span>
                </Link>


                <div className="flex items-center gap-4">
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
                                        <p className="text-sm font-bold leading-none">{profile?.username || "Mon Compte"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer rounded-xl">
                                        <User className="mr-2 h-4 w-4" />
                                        Tableau de bord
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer rounded-xl">
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Paramètres
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer rounded-xl">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Se déconnecter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild className="rounded-full px-6 h-9 bg-white text-slate-900 hover:bg-slate-100 font-bold border-none text-sm">
                            <Link href="/login">Connexion</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
