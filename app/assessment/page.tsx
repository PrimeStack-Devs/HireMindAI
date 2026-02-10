'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

export default function AssessmentPage() {
  const router = useRouter()

const handleStartTest = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    }
    router.push('/assessment/test')
  } catch (err) {
    console.error('Fullscreen request failed', err)
    // optional: show toast saying "Please allow fullscreen"
  }
}
useEffect(() => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}, [])

  return (
    <div className="max-h-screen h-screen bg-gradient-to-br from-background via-background to-blue-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      > 
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
            Assessment Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge with our comprehensive assessment platform
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-accent" />

            <div className="p-8 md:p-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-foreground leading-relaxed">
                  This assessment consists of multiple-choice questions designed to evaluate your knowledge and understanding. Answer each question carefully and proceed at your own pace.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid md:grid-cols-2 gap-6 mb-8"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border/30">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-3xl font-bold text-foreground">20</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border/30">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Time</p>
                    <p className="text-3xl font-bold text-foreground">~20 min</p>
                  </div>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 mb-8 p-4 rounded-lg bg-secondary border border-border/30"
              >
                <h3 className="font-semibold text-foreground mb-4">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Multiple choice questions with 4 options each</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Progress tracking throughout the test</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Navigate between questions freely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Submit your assessment when complete</span>
                  </li>
                </ul>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleStartTest}
                  className="w-full bg-primary hover:bg-blue-500 text-primary-foreground font-semibold py-3 h-12 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Start Test
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          You can review all your answers before final submission
        </motion.p> */}
      </motion.div>
    </div>
  )
}
