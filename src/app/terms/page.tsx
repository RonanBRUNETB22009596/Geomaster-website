"use client"

import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { FileText } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />
            <div className="container mx-auto pt-24 pb-16 px-4 flex-1">
                <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <FileText className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6">Conditions d'Utilisation</h1>
                        <p className="text-slate-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

                        <div className="space-y-8 text-slate-300">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">1. Acceptation des conditions</h2>
                                <p>En accédant à ce site web et en l'utilisant, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'êtes pas d'accord avec l'une de ces conditions, il vous est interdit d'utiliser ou d'accéder à ce site.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">2. Licence d'utilisation</h2>
                                <p>Il est permis de télécharger temporairement une copie des documents (informations ou logiciels) sur le site Web de GeoMaster pour une visualisation transitoire personnelle et non commerciale uniquement. Il s'agit de la concession d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas :</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Modifier ou copier les documents ;</li>
                                    <li>Utiliser les documents à des fins commerciales ou pour toute exposition publique (commerciale ou non commerciale) ;</li>
                                    <li>Tenter de décompiler ou d'inverser l'ingénierie de tout logiciel contenu sur le site Web de GeoMaster ;</li>
                                    <li>Supprimer tout droit d'auteur ou autres notations de propriété des documents ; ou</li>
                                    <li>Transférer les documents à une autre personne ou « faire un miroir » des documents sur tout autre serveur.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">3. Clause de non-responsabilité</h2>
                                <p>Les documents sur le site Web de GeoMaster sont fournis « tels quels ». GeoMaster ne donne aucune garantie, expresse ou implicite, et rejette et annule par la présente toutes les autres garanties, y compris, sans limitation, les garanties ou conditions implicites de qualité marchande, d'adéquation à un usage particulier ou de non-violation de la propriété intellectuelle ou autre violation des droits.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">4. Limites</h2>
                                <p>En aucun cas GeoMaster ou ses fournisseurs ne seront tenus responsables de tout dommage (y compris, sans s'y limiter, les dommages pour perte de données ou de profit, ou en raison d'une interruption des activités) découlant de l'utilisation ou de l'incapacité d'utiliser les documents sur le site Internet de GeoMaster.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">5. Précision des matériels</h2>
                                <p>Les documents apparaissant sur le site Web de GeoMaster peuvent inclure des erreurs techniques, typographiques ou photographiques. GeoMaster ne garantit pas que les éléments de son site Web sont exacts, complets ou à jour. GeoMaster peut apporter des modifications au matériel contenu sur son site Web à tout moment sans préavis.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3">6. Modifications</h2>
                                <p>GeoMaster peut réviser ces conditions d'utilisation de son site Web à tout moment sans préavis. En utilisant ce site Web, vous acceptez d'être lié par la version alors en vigueur de ces conditions d'utilisation.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
