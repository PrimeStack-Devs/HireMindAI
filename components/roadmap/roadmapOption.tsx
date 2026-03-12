'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MapPin, Sparkles } from 'lucide-react'

interface RoadmapOptionProps {
  open: boolean
  onClose: () => void
}

export function RoadmapOption({ open, onClose }: RoadmapOptionProps) {
  const router = useRouter()

  const handleSimpleRoadmap = () => {
    window.localStorage.removeItem('roadmap')
    onClose()
    router.push('/roadmap/simple')
  }

  const handleSmartRoadmap = () => {
    window.localStorage.removeItem('roadmap')
    onClose()
    router.push('/roadmap/smart')
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-5xl p-6 bg-slate-900/95 border border-slate-700/60 backdrop-blur-xl rounded-3xl">

        {/* Headline Section */}
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Build Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI-Powered Learning Roadmap
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Choose how you want to generate your roadmap. Go quick with basic inputs or unlock
            a personalized path powered by skill-gap analysis and adaptive AI planning.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Simple Roadmap */}
          <div className="group relative rounded-2xl p-7 border border-slate-700/50 bg-slate-800/60 transition-all duration-300 hover:border-slate-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden">

            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-cyan-500" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Quick Roadmap
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Instantly generate a structured roadmap based on your selected niche,
                target role, and timeline. Perfect if you already know your level
                and want a fast, goal-oriented plan.
              </p>

              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Weekly breakdown</li>
                <li>• Suggested projects</li>
                <li>• Interview preparation tips</li>
              </ul>

              <Button
                onClick={handleSimpleRoadmap}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
              >
                Generate Quick Roadmap
              </Button>
            </div>
          </div>

          {/* Smart Roadmap */}
          <div className="group relative rounded-2xl p-7 border border-slate-700/50 bg-slate-800/60 transition-all duration-300 hover:border-slate-500 hover:shadow-2xl hover:scale-[1.02] overflow-hidden">

            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-pink-500" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Smart Roadmap <span className="text-xs text-purple-400">(Recommended)</span>
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Take a short AI-powered skill assessment. We analyze your strengths,
                identify gaps, and generate a highly personalized roadmap that focuses
                on what truly needs improvement.
              </p>

              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Skill-gap analysis</li>
                <li>• Strength-based acceleration</li>
                <li>• Adaptive weekly planning</li>
              </ul>

              <Button
                onClick={handleSmartRoadmap}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              >
                Start Smart Assessment
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}