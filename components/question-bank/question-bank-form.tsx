'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { QuestionCard } from './question-card'
import { CSVUploadCard } from './csv-upload-card'
import {
  BankDetailsSection,
  formSchema,
  FormData,
} from './bank-details-section'

/* -------------------- Categories -------------------- */
export const categoryOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'AWS',
  'Database Design',
  'System Design',
  'Problem Solving',
]

/* -------------------- Question Schema -------------------- */
const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['MCQ', 'Multi-select', 'True/False']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  marks: z.number().min(1),
  options: z.array(
    z.object({
      text: z.string().min(1),
      isCorrect: z.boolean(),
    })
  ),
})

export type QuestionData = z.infer<typeof questionSchema>

/* -------------------- Props -------------------- */
interface QuestionBankFormProps {
  mode?: 'create' | 'edit'
  initialData?: any
  assessmentId?: string
}

/* -------------------- Component -------------------- */
export function QuestionBankForm({
  mode = 'create',
  initialData,
  assessmentId,
}: QuestionBankFormProps) {
  const [questions, setQuestions] = useState<QuestionData[]>(
    initialData?.questions || []
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      durationMinutes: 60,
      tabSwitchLimit: 0,
      autoSubmitOnTimeout: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      totalMarks: 100,
      attempts: 1,
      instructions: '',
    },
  })

  /* -------------------- Reset When Editing -------------------- */
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset(initialData)
      setQuestions(initialData.questions || [])
    }
  }, [initialData, mode, form])

  /* -------------------- Question Handlers -------------------- */
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        category: '',
        type: 'MCQ',
        difficulty: 'Medium',
        marks: 1,
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ],
      },
    ])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateQuestion = (
    index: number,
    updatedQuestion: QuestionData
  ) => {
    setQuestions((prev) => {
      const updated = [...prev]
      updated[index] = updatedQuestion
      return updated
    })
  }

  /* -------------------- Submit -------------------- */
  const onSubmit = async (data: FormData) => {
    if (!questions.length) {
      alert('Please add at least one question')
      return
    }

    const payload = {
      ...data,
      questions,
    }

    try {
      setIsSubmitting(true)

      if (mode === 'edit') {
        await fetch(`/api/assessments/${assessmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`/api/assessments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      alert(
        mode === 'edit'
          ? 'Assessment updated successfully!'
          : 'Assessment created successfully!'
      )
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* ---------------- Bank Details ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BankDetailsSection form={form} />
      </motion.div>

      {/* ---------------- Question Upload ---------------- */}
      <Card className="rounded-2xl p-8 border border-blue-700/60 bg-blue-950/60">
        <h2 className="text-xl font-semibold text-sky-300 mb-6">
          Questions
        </h2>

        <Tabs defaultValue="manual">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                index={index}
                categories={categoryOptions}
                onUpdate={(q) => handleUpdateQuestion(index, q)}
                onRemove={() => handleRemoveQuestion(index)}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </TabsContent>

          <TabsContent value="csv">
            <CSVUploadCard onQuestionsImport={setQuestions} />
          </TabsContent>
        </Tabs>
      </Card>

      {/* ---------------- Footer ---------------- */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === 'edit'
              ? 'Updating...'
              : 'Creating...'
            : mode === 'edit'
            ? 'Update Assessment'
            : 'Create Question Bank'}
        </Button>
      </div>
    </form>
  )
}
