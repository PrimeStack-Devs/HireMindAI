'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStrapi } from '@/lib/api/useStrapi'

export default function TestPage() {
  const router = useRouter()
  const params = useParams()

  const docId = Array.isArray(params.id)
    ? params.id[0]
    : params.id

  /* ---------------- FETCH QUESTIONS FROM STRAPI ---------------- */

  const query = useMemo(
    () => ({
      populate: {
        assessment: {
          populate: {
            questions: {
              populate: ("*"),
            }
          },
        },
      },
      where: {
        documentId: docId,
      },
    }),
    [docId]
  )

  const { data, isLoading } = useStrapi(
    'assessment-schedules',
    query
  )
  console.log("data", data)
  const dbQuestions =
    (data?.data?.[0] as any)?.assessment?.questions ?? []

  /* ---------------- STATE ---------------- */

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [selectedAnswers, setSelectedAnswers] =
    useState<(number | null)[]>([])

  const [isSubmitted, setIsSubmitted] =
    useState(false)

  const [needsFullscreen, setNeedsFullscreen] =
    useState(false)

  /* initialize answers when questions load */
  useEffect(() => {
    if (dbQuestions.length > 0) {
      setSelectedAnswers(
        new Array(dbQuestions.length).fill(null)
      )
    }
  }, [dbQuestions.length])

  const question = dbQuestions[currentQuestion]

  const isLastQuestion =
    currentQuestion === dbQuestions.length - 1

  const progress =
    dbQuestions.length > 0
      ? ((currentQuestion + 1) / dbQuestions.length) *
      100
      : 0

  /* ---------------- FULLSCREEN SECURITY ---------------- */

  const fullscreenExitCount = useRef(0)
  const hasShownFullscreenWarning = useRef(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        fullscreenExitCount.current += 1

        if (fullscreenExitCount.current === 1) {
          if (!hasShownFullscreenWarning.current) {
            hasShownFullscreenWarning.current = true
            toast.error(
              '⚠️ Do not exit fullscreen again or test will terminate.'
            )
          }
          setNeedsFullscreen(true)
        }

        if (fullscreenExitCount.current >= 2) {
          toast.error(
            '❌ Test terminated due to violation'
          )
          router.replace('/assessment')
        }
      }
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )

    return () =>
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
  }, [router])

  /* ---------------- ACTIONS ---------------- */

  const handleSelectAnswer = (index: number) => {
    const copy = [...selectedAnswers]
    copy[currentQuestion] = index
    setSelectedAnswers(copy)
  }

  const handleNext = () => {
    if (!isLastQuestion)
      setCurrentQuestion(prev => prev + 1)
  }

const handleSubmit = () => {

  fullscreenExitCount.current = 0
  hasShownFullscreenWarning.current = false

  let score = 0

  dbQuestions.forEach((q: any, questionIndex: number) => {

    const correctIndex =
      q.options.findIndex(
        (opt: any) => opt.isCorrect
      )

    if (selectedAnswers[questionIndex] === correctIndex) {
      score++
    }

  })

  console.log("Selected answers:", selectedAnswers)

  console.log("Score:", score)

  console.log("Total:", dbQuestions.length)

  setIsSubmitted(true)
}

  /* ---------------- LOADING ---------------- */

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading questions...
      </div>
    )

  if (isSubmitted)
    return <SubmitConfirmation />

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen bg-gradient-to-br from-background to-blue-950 py-8 px-4">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex justify-between">

            <h1 className="text-xl font-bold text-primary">
              Assessment Test
            </h1>

            <div className="text-right">

              <p className="text-sm text-muted-foreground">
                Progress
              </p>

              <p className="text-lg font-bold text-primary">
                {currentQuestion + 1} / {dbQuestions.length}
              </p>

            </div>

          </div>

          <Progress value={progress} className="mt-4" />

        </div>


        {/* QUESTION */}
        <AnimatePresence mode="wait">

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >

            <Card className="p-8">

              <p className="text-primary mb-2">
                Question {currentQuestion + 1}
              </p>

              <h2 className="text-lg font-bold mb-6">
                {question?.questionText?.[0]?.children?.[0]?.text}
              </h2>


              {/* OPTIONS placeholder until you populate options */}
              <div className="space-y-3 mb-8">

                {question?.options?.map((opt: any, index: number) => {

                  const isSelected =
                    selectedAnswers[currentQuestion] === index

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(index)}
                      className={`w-full p-4 border rounded-lg transition
        ${isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                        }`}
                    >
                      {opt.text}
                    </button>
                  )

                })}

              </div>


              <div className="flex justify-end">

                {isLastQuestion ? (

                  <Button onClick={handleSubmit}>
                    Submit Test
                  </Button>

                ) : (

                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 w-4" />
                  </Button>

                )}

              </div>

            </Card>

          </motion.div>

        </AnimatePresence>

      </div>


      {/* FULLSCREEN OVERLAY */}
      {needsFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <Card className="p-8 text-center">

            <h2 className="font-bold mb-4">
              Fullscreen Required
            </h2>

            <Button
              onClick={async () => {
                await document.documentElement.requestFullscreen()
                setNeedsFullscreen(false)
              }}
            >
              Continue Test
            </Button>

          </Card>

        </div>
      )}

    </div>
  )
}


/* ---------------- SUBMIT SCREEN ---------------- */

function SubmitConfirmation() {

  const router = useRouter()

  return (
    <div className="h-screen flex items-center justify-center">

      <Card className="p-8 text-center">

        <h1 className="text-2xl font-bold mb-4">
          Test Submitted
        </h1>

        <Button onClick={() => router.push('/')}>
          Back
        </Button>

      </Card>

    </div>
  )
}