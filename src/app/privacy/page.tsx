"use client"

import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="container mx-auto pt-24 pb-16 px-4 flex-1">
                <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Shield className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6">Politique de Confidentialité</h1>
                        <p className="text-slate-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

                        <div className="space-y-8 text-slate-300">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">1. Collecte des informations</h2>
                                <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, et lorsque vous participez à nos quiz. Les informations recueillies incluent votre adresse e-mail, votre nom d'utilisateur et vos statistiques de jeu.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">2. Utilisation des informations</h2>
                                <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                                    <li>Fournir un contenu publicitaire personnalisé</li>
                                    <li>Améliorer notre site Web</li>
                                    <li>Améliorer le service client et vos besoins de prise en charge</li>
                                    <li>Vous contacter par e-mail</li>
                                    <li>Administrer un concours, une promotion, ou un classement</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">3. Confidentialité du commerce en ligne</h2>
                                <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">4. Divulgation à des tiers</h2>
                                <p>Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">5. Protection des informations</h2>
                                <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie (Supabase Auth) pour protéger les informations sensibles transmises en ligne.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">6. Consentement</h2>
                                <p>En utilisant notre site, vous consentez à notre politique de confidentialité.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
