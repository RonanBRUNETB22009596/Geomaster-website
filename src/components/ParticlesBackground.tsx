"use client"

import dynamic from "next/dynamic"

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false })

export function ParticlesBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
            <Particles
                particleColors={["#ffffff"]}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={false}
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={1}
            />
        </div>
    )
}
