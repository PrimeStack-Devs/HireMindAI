'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { questions } from '@/lib/questions'
import { ChevronRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const TIMER_DURATION = 30

export default function TestPage() {
  const router = useRouter()

  // fullscreen enforcement refs
  const fullscreenExitCount = useRef(0)
  const hasShownFullscreenWarning = useRef(false)

  // state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  )
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [needsFullscreen, setNeedsFullscreen] = useState(false)

  const hasTimedOut = useRef(false)

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isWarning = timeLeft <= 10 && timeLeft > 0

  /* ---------------- TIMER (RESTARTS PER QUESTION) ---------------- */
  useEffect(() => {
    hasTimedOut.current = false
    setTimeLeft(TIMER_DURATION)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuestion])

  /* ---------------- TIMEOUT HANDLER ---------------- */
  useEffect(() => {
    if (timeLeft === 0 && !hasTimedOut.current) {
      hasTimedOut.current = true

      toast.error('⏰ Time’s up — moving to next question', {
        duration: 2000,
      })

      const timeout = setTimeout(() => {
        if (isLastQuestion) {
          setIsSubmitted(true)
        } else {
          setCurrentQuestion((prev) => prev + 1)
        }
      }, 1200)

      return () => clearTimeout(timeout)
    }
  }, [timeLeft, isLastQuestion])

  /* ---------------- FULLSCREEN VIOLATION HANDLER ---------------- */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        fullscreenExitCount.current += 1

        // FIRST VIOLATION
        if (fullscreenExitCount.current === 1) {
          if (!hasShownFullscreenWarning.current) {
            hasShownFullscreenWarning.current = true
            toast.error(
              '⚠️ Do not exit fullscreen again or the test will be terminated.',
              { duration: 3000 }
            )
          }
          setNeedsFullscreen(true)
        }

        // SECOND VIOLATION
        if (fullscreenExitCount.current >= 2) {
          toast.error('❌ Test terminated due to fullscreen violation', {
            duration: 3000,
          })

          router.replace('/assessment')
        }
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [router])

  /* ---------------- ACTIONS ---------------- */
  const handleSelectAnswer = (index: number) => {
    if (timeLeft === 0) return
    const copy = [...selectedAnswers]
    copy[currentQuestion] = index
    setSelectedAnswers(copy)
  }

  const handleNext = () => {
    if (!isLastQuestion) setCurrentQuestion((prev) => prev + 1)
  }

  const handleSubmit = () => {
    fullscreenExitCount.current = 0
    hasShownFullscreenWarning.current = false
    setIsSubmitted(true)
  }

  /* ---------------- SUBMIT SCREEN ---------------- */
  if (isSubmitted) return <SubmitConfirmation />

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-blue-950 py-8 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Assessment Test
            </h1>

            <div className="flex gap-8">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-lg font-bold text-primary">
                  {currentQuestion + 1} / {questions.length}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                  <Clock className="w-4 h-4" /> Time Left
                </p>
                <p
                  className={`text-lg font-mono font-bold ${
                    isWarning ? 'text-red-500 animate-pulse' : 'text-primary'
                  }`}
                >
                  00:{String(timeLeft).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="relative p-8 bg-card/60 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-blue-400" />

              <p className="text-sm font-semibold text-primary mb-2">
                Question {currentQuestion + 1}
              </p>
              <h2 className="text-lg font-bold mb-6">{question.question}</h2>

              <div className="space-y-3 mb-8">
                {question.options.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAnswers[currentQuestion] === i
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                {isLastQuestion ? (
                  <Button onClick={handleSubmit} className="gap-2">
                    Submit Test <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-2">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FULLSCREEN RECOVERY OVERLAY */}
      {needsFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <Card className="p-8 max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Fullscreen Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please return to fullscreen to continue the test.
            </p>
            <Button
              onClick={async () => {
                await document.documentElement.requestFullscreen()
                setNeedsFullscreen(false)
              }}
              className="w-full"
            >
              Continue Test
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ---------------- SUBMIT CONFIRMATION ---------------- */

function SubmitConfirmation() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-3">✅ Test Submitted</h1>
        <p className="text-muted-foreground mb-6">
          Your responses were recorded successfully.
        </p>
        <Button onClick={() => router.push('/assessment')} className="w-full">
          Back to Assessment
        </Button>
      </Card>
    </div>
  )
}
