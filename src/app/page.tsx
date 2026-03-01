"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"
import { BorderBeam } from "@/components/ui/border-beam"

import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { StreakBadge } from "@/components/StreakBadge"
import { supabase } from "@/lib/supabase"
import { AlertTriangle, Clock } from "lucide-react"

const DottedMap = dynamic(() => import("@/components/ui/dotted-map").then(m => ({ default: m.DottedMap })), { ssr: false })
const TiltedCard = dynamic(() => import("@/components/TiltedCard"), { ssr: false })
const SplitText = dynamic(() => import("@/components/SplitText"), { ssr: false })

export default function Home() {
  const [heroTitle, setHeroTitle] = useState("Devenez un pro de la géo")
  const [heroSubtitle, setHeroSubtitle] = useState("Testez vos connaissances sur les capitales, drapeaux, et populations avec notre quiz interactif de 10 questions.")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // Fetch settings
      const { data: settings } = await supabase.from('site_settings').select('*')
      let isMaintenance = false
      if (settings) {
        settings.forEach(s => {
          if (s.key === 'maintenance_mode') isMaintenance = (s.value === 'true' || s.value === true)
          if (s.key === 'hero_text' && s.value) {
            if (s.value.title) setHeroTitle(s.value.title)
            if (s.value.subtitle) setHeroSubtitle(s.value.subtitle)
          }
        })
      }

      // If maintenance, check if user is admin
      if (isMaintenance) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            isMaintenance = false // Let admins see the site
          }
        }
      }

      // Track visit
      await supabase.from('page_views').insert([{ path: '/', created_at: new Date().toISOString() }])

      setMaintenanceMode(isMaintenance)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    )
  }

  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black -z-10"></div>
        <Clock className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Site en maintenance</h1>
        <p className="text-slate-400 text-lg max-w-md mb-8">
          GeoMaster fait actuellement une pause pour des mises à jour. Nous serons de retour très bientôt !
        </p>
        <Button asChild variant="outline" className="bg-transparent border-white/10 text-white hover:bg-white/5">
          <Link href="/login">Accès Administrateur</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-48 pb-32 px-6 text-center">

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center">
          <SplitText
            text={heroTitle}
            className="text-4xl md:text-7xl font-black text-white mb-8 max-w-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            delay={40}
            duration={0.8}
            ease="power4.out"
            key={heroTitle} // re-render on title change
            from={{ opacity: 0, y: 50, rotateX: -40 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />

          <div className="relative mb-6 max-w-2xl rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md border border-white/10">
            <p className="text-lg md:text-xl text-white/90 p-4">
              {heroSubtitle}
            </p>
            <BorderBeam duration={8} size={100} colorFrom="#ffffff" colorTo="#ffffff" />
          </div>

          {/* ... */}
          <div className="mb-8">
            <StreakBadge size="lg" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-[180px] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => {
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Commencer le Quiz
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-[180px] bg-white text-black font-bold border-none hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl">
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-transparent relative z-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Choisissez votre défi</h2>
            <p className="text-slate-300 text-lg">Sélectionnez une région pour tester vos connaissances géographiques.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 max-w-[1056px] mx-auto">
            {/* World */}
            <Link href="/quiz/init?category=World">
              <TiltedCard
                imageSrc="/images/world.png"
                altText="Quiz Monde"
                captionText="Quiz - Monde"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Monde Entier</h3>
                  </div>
                }
              />
            </Link>

            {/* Europe */}
            <Link href="/quiz/init?category=Europe">
              <TiltedCard
                imageSrc="/images/europe.png"
                altText="Quiz Europe"
                captionText="Quiz - Europe"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Europe</h3>
                  </div>
                }
              />
            </Link>

            {/* Americas */}
            <Link href="/quiz/init?category=Americas">
              <TiltedCard
                imageSrc="/images/americas.png"
                altText="Quiz Amériques"
                captionText="Quiz - Amériques"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Amériques</h3>
                  </div>
                }
              />
            </Link>

            {/* Asia */}
            <Link href="/quiz/init?category=Asia">
              <TiltedCard
                imageSrc="/images/asia.png"
                altText="Quiz Asie"
                captionText="Quiz - Asie"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Asie</h3>
                  </div>
                }
              />
            </Link>

            {/* Africa */}
            <Link href="/quiz/init?category=Africa">
              <TiltedCard
                imageSrc="/images/africa.png"
                altText="Quiz Afrique"
                captionText="Quiz - Afrique"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Afrique</h3>
                  </div>
                }
              />
            </Link>

            {/* Oceania */}
            <Link href="/quiz/init?category=Oceania">
              <TiltedCard
                imageSrc="/images/oceania.png"
                altText="Quiz Océanie"
                captionText="Quiz - Océanie"
                containerHeight="380px"
                containerWidth="320px"
                imageHeight="380px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.08}
                displayOverlayContent
                overlayContent={
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-white font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black text-white">Océanie</h3>
                  </div>
                }
              />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
