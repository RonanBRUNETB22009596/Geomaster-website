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
import { useI18n } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const { t } = useI18n()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const form = e.currentTarget
        const name = (form.elements.namedItem('name') as HTMLInputElement).value
        const email = (form.elements.namedItem('email') as HTMLInputElement).value
        const subject = (form.elements.namedItem('subject') as HTMLInputElement).value
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{ name, email, subject, message }])

            if (error) throw error

            toast.success(t('contact.message_sent') || "Votre message a bien été envoyé ! Nous vous répondrons rapidement.")
            form.reset()
        } catch (error: any) {
            console.error("Error sending message:", error)
            toast.error(t('settings.error_occured') || "Une erreur est survenue lors de l'envoi du message.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <NavBar />

            <div className="flex-1 container mx-auto px-4 py-32 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        {t('contact.title')}
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        {t('contact.subtitle')}
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
                                        <h3 className="font-bold text-white">{t('contact.email')}</h3>
                                        <p className="text-sm text-slate-300">brt.ronan@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{t('contact.office')}</h3>
                                        <p className="text-sm text-slate-300">Toulouse, France</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Formulaire */}
                    <Card className="md:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 text-white border-none shadow-2xl rounded-[32px]">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('contact.send_message')}</CardTitle>
                            <CardDescription className="text-slate-300">
                                {t('contact.form_desc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-white">{t('contact.full_name')}</Label>
                                        <Input id="name" required placeholder={t('contact.name_placeholder')} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white">{t('contact.email_address')}</Label>
                                        <Input id="email" type="email" required placeholder={t('contact.email_placeholder')} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-white">{t('contact.subject')}</Label>
                                    <Input id="subject" required placeholder={t('contact.subject_placeholder')} className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-white">{t('contact.message')}</Label>
                                    <Textarea
                                        id="message"
                                        required
                                        placeholder={t('contact.message_placeholder')}
                                        className="min-h-[150px] bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full sm:w-auto text-black bg-white hover:bg-slate-200">
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    {loading ? (t('login.signing_in') || "Envoi...") : t('contact.send')}
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
