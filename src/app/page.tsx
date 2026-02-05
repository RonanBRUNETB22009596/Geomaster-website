"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import { NavBar } from "@/components/NavBar"
import Beams from "@/components/Beams"
import { Footer } from "@/components/Footer"
import TiltedCard from "@/components/TiltedCard"
import SplitText from "@/components/SplitText"
import { StreakBadge } from "@/components/StreakBadge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-48 pb-32 px-6 text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={6}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center">
          <SplitText
            text="Devenez un pro de la géo"
            className="text-4xl md:text-7xl font-black text-white mb-8 max-w-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            delay={40}
            duration={0.8}
            ease="power4.out"
            from={{ opacity: 0, y: 50, rotateX: -40 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />

          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            Testez vos connaissances sur les capitales, drapeaux, et populations avec notre quiz interactif de 10 questions.
          </p>

          {/* Streak Badge */}
          <div className="mb-8">
            <StreakBadge size="lg" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => {
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Commencer le Quiz
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-900 font-bold border-none">
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 bg-white relative z-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Choisissez votre défi</h2>
            <p className="text-slate-500 text-lg">Sélectionnez une région pour tester vos connaissances géographiques.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto place-items-center">
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Monde Entier</h3>
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Europe</h3>
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Amériques</h3>
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Asie</h3>
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Afrique</h3>
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
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">Catégorie</p>
                    <h3 className="text-2xl font-black">Océanie</h3>
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
