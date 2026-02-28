"use client"

import { useState } from "react"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Mail, Send, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const subject = (form.elements.namedItem('subject') as HTMLInputElement).value
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

        // Open the default email client
        window.location.href = `mailto:brt.ronan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

        toast.success("Ouverture de votre messagerie...")
        form.reset()
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />

            <div className="flex-1 container mx-auto px-4 py-32 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Contactez-nous
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Une question, un bug à signaler ou une suggestion d'amélioration ? N'hésitez pas à nous envoyer un message !
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Infos Contact */}
                    <div className="space-y-6">
                        <Card className="bg-black/40 backdrop-blur-md border border-white/10 text-white border-none shadow-2xl">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/20 rounded-xl text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Email</h3>
                                        <p className="text-sm text-slate-300">brt.ronan@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Bureau</h3>
                                        <p className="text-sm text-slate-300">Toulouse, France</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Formulaire */}
                    <Card className="md:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 text-white border-none shadow-2xl rounded-[32px]">
                        <CardHeader>
                            <CardTitle className="text-2xl">Envoyez un message</CardTitle>
                            <CardDescription className="text-slate-300">
                                Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24h.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-white">Nom complet</Label>
                                        <Input id="name" required placeholder="Ex: Jean Dupont" className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white">Adresse Email</Label>
                                        <Input id="email" type="email" required placeholder="Ex: jean@example.com" className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-white">Sujet</Label>
                                    <Input id="subject" required placeholder="Ex: Suggestion de nouvelle catégorie" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-white">Message</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        className="min-h-[150px] bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <Button type="submit" className="w-full sm:w-auto text-black bg-white hover:bg-slate-200">
                                    <Send className="w-4 h-4 mr-2" /> Envoyer le message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    )
}
