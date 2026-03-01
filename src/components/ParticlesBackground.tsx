"use client"

import dynamic from "next/dynamic"

const Particles = dynamic(() => import("@/components/Particles"), { ssr: false })

export function ParticlesBackground() {
    return (
        <div className="fixed inset-0 z-[1] pointer-events-none blur-[3px]" style={{ width: '100vw', height: '100vh' }}>
            <Particles
                particleColors={["#ffffff"]}
                particleCount={300}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover
                alphaParticles={true}
                disableRotation={false}
                sizeRandomness={1}
                cameraDistance={20}
                particleHoverFactor={1}
                pixelRatio={1}
            />
        </div>
    )
}
