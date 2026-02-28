import Link from "next/link"
import { Globe, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#0b0416] text-slate-300 py-12 border-t border-white/5 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                            <Globe className="w-6 h-6 text-primary" />
                            <span>GeoMaster</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            La plateforme ultime pour tester vos connaissances géographiques et découvrir le monde tout en s'amusant.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors hover:text-white">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">Navigation</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                            <li><Link href="/#categories" className="hover:text-primary transition-colors">Démarrer un Quiz</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Mon Tableau de Bord</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Connexion / Inscription</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">Catégories</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/quiz/init?category=Europe" className="hover:text-primary transition-colors">Europe</Link></li>
                            <li><Link href="/quiz/init?category=Americas" className="hover:text-primary transition-colors">Amériques</Link></li>
                            <li><Link href="/quiz/init?category=Asia" className="hover:text-primary transition-colors">Asie</Link></li>
                            <li><Link href="/quiz/init?category=Africa" className="hover:text-primary transition-colors">Afrique</Link></li>
                            <li><Link href="/quiz/init?category=Oceania" className="hover:text-primary transition-colors">Océanie</Link></li>
                        </ul>
                    </div>

                    {/* Support/Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-wider">Légal & Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contactez-nous</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © 2026 GeoMaster. Tous droits réservés. Développé avec Next.js et Supabase.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <span>v1.0.0</span>
                        <span>Status: En ligne</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
