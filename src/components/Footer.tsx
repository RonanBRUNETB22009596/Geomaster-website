"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Github, Linkedin, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Footer() {
    const { t } = useI18n()

    return (
        <footer className="bg-[#0b0416] text-slate-300 py-12 border-t border-white/5 relative z-10">
            <div className="max-w-[1056px] mx-auto px-6 sm:px-8 xl:px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                            <div className="bg-white p-1 rounded-full shadow-sm flex items-center justify-center w-8 h-8">
                                <Image src="/logo.png" alt="GeoMaster" width={24} height={24} className="rounded-full object-contain" />
                            </div>
                            <span>GeoMaster</span>
                        </Link>

                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/brunetronan/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://github.com/RonanBRUNETB22009596" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Github className="w-4 h-4" />
                            </a>
                            <Link href="/contact" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Mail className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">{t('footer.navigation')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} className="hover:text-primary transition-colors">{t('footer.home')}</Link></li>
                            <li><Link href="/#categories" className="hover:text-primary transition-colors">{t('footer.start_quiz')}</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">{t('footer.my_dashboard')}</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">{t('footer.login_signup')}</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">{t('footer.categories')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/quiz/init?category=Europe" className="hover:text-primary transition-colors">Europe</Link></li>
                            <li><Link href="/quiz/init?category=Americas" className="hover:text-primary transition-colors">{t('footer.americas')}</Link></li>
                            <li><Link href="/quiz/init?category=Asia" className="hover:text-primary transition-colors">{t('footer.asia')}</Link></li>
                            <li><Link href="/quiz/init?category=Africa" className="hover:text-primary transition-colors">{t('footer.africa')}</Link></li>
                            <li><Link href="/quiz/init?category=Oceania" className="hover:text-primary transition-colors">{t('footer.oceania')}</Link></li>
                        </ul>
                    </div>

                    {/* Support/Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">{t('footer.legal')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © 2026 GeoMaster. {t('footer.rights')} Next.js & Supabase.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <span>v1.0.0</span>
                        <span>{t('footer.status')}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
