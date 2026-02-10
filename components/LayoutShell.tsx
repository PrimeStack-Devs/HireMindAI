'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import LightRays from '@/components/LightRay'

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // true for /assessment and /assessment/*
  const isAssessmentRoute = pathname.startsWith('/assessment')

  return (
    <>
      {/* Light Rays ONLY if not assessment */}
      {!isAssessmentRoute && (
        <div className="fixed inset-0 z-[-1]">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={7}
            followMouse
            mouseInfluence={0.3}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      )}

      {/* Navbar ONLY if not assessment */}
      {!isAssessmentRoute && <Navbar />}

      {children}
    </>
  )
}
