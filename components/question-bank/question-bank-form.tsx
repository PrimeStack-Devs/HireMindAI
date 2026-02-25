// 'use client'

// import { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { Plus } from 'lucide-react'
// import { motion } from 'framer-motion'

// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// import { QuestionCard } from './question-card'
// import { CSVUploadCard } from './csv-upload-card'
// import {
//   BankDetailsSection,
//   formSchema,
//   FormData,
// } from './bank-details-section'
// import { strapi } from '@/lib/api/sdk'
// import { diff } from 'util'


// export const categoryOptions = [
//   'JavaScript',
//   'TypeScript',
//   'React',
//   'Node.js',
//   'Python',
//   'AWS',
//   'Database Design',
//   'System Design',
//   'Problem Solving',
// ]


// const questionSchema = z.object({
//   text: z.string().min(1, 'Question text is required'),
//   category: z.string().min(1, 'Category is required'),
//   type: z.enum(['MCQ', 'Multi-select', 'True/False']),
//   difficulty: z.enum(['Easy', 'Medium', 'Hard']),
//   marks: z.number().min(1),
//   options: z.array(
//     z.object({
//       text: z.string().min(1),
//       isCorrect: z.boolean(),
//     })
//   ),
// })

// export type QuestionData = z.infer<typeof questionSchema>


// interface QuestionBankFormProps {
//   mode?: 'create' | 'edit'
//   initialData?: any
//   assessmentId?: string
// }

// export function QuestionBankForm({
//   mode = 'create',
//   initialData,
//   assessmentId,
// }: any) {

//   // console.log('initialdata',initialData)

// const [questions, setQuestions] = useState<any[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     shouldUnregister: false,
//     defaultValues: initialData || {
//       name: '',
//       description: '',
//       durationMinutes: 60,
//       tabSwitchLimit: 0,
//       autoSubmitOnTimeout: false,
//       shuffleQuestions: false,
//       shuffleOptions: false,
//       totalMarks: 100,
//       attempts: 1,
//       instructions: '',
//     },
//   })

// useEffect(() => {
//   if (mode === 'edit' && initialData) {
//     form.reset(initialData)

//     const mappedQuestions =
//       initialData.questions?.map((q: any) => ({
//         documentId: q.documentId, // VERY IMPORTANT
//         text: q.questionText?.[0]?.children?.[0]?.text || '',
//         category: q.category || '',
//         type: q.type || 'MCQ',
//         difficulty: q.difficulty || 'Medium',
//         marks: q.marks,
//         options: q.options?.map((opt: any) => ({
//           documentId: opt.documentId,
//           text: opt.text,
//           isCorrect: opt.isCorrect,
//         })),
//       })) || []

//     setQuestions(mappedQuestions)
//   }
// }, [initialData, mode, form])

//   const handleAddQuestion = () => {
//     setQuestions((prev) => [
//       ...prev,
//       {
//         text: '',
//         category: '',
//         type: 'MCQ',
//         difficulty: 'Medium',
//         marks: 1,
//         options: [
//           { text: '', isCorrect: true },
//           { text: '', isCorrect: false },
//         ],
//       },
//     ])
//   }

//   const handleRemoveQuestion = (index: number) => {
//     setQuestions((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleUpdateQuestion = (
//     index: number,
//     updatedQuestion: QuestionData
//   ) => {
//     setQuestions((prev) => {
//       const updated = [...prev]
//       updated[index] = updatedQuestion
//       return updated
//     })
//   }


//   const onSubmit = async (data: FormData) => {
//   if (!questions.length) {
//     alert('Please add at least one question')
//     return
//   } 

//   try {
//     setIsSubmitting(true)

//     /* ---------------- UPDATE ASSESSMENT ---------------- */
//     let assessmentDocumentId = initialData?.documentId

//     if (mode === "edit") {
//       await strapi.update("assessments", assessmentDocumentId, {
//         name: data.name,
//         description: data.description,
//         durationMinutes: data.durationMinutes,
//         tabSwitchLimit: data.tabSwitchLimit,
//         instructions: data.instructions,
//         totalMarks: data.totalMarks,
//       })
//     } else {
//       const res = await strapi.create("assessments", {
//         name: data.name,
//         description: data.description,
//         durationMinutes: data.durationMinutes,
//         tabSwitchLimit: data.tabSwitchLimit,
//         instructions: data.instructions,
//         totalMarks: data.totalMarks,
//       })

//       assessmentDocumentId = res.data?.documentId
//     }

//     /* ---------------- HANDLE QUESTIONS ---------------- */

//     const toBlocks = (text: string) => [
//       {
//         type: "paragraph",
//         children: [{ type: "text", text }],
//       },
//     ]

//     for (const q of questions) {
//       if (q.documentId) {
//         // 🔁 UPDATE EXISTING QUESTION
//         await strapi.update("question-banks", q.documentId, {
//           questionText: toBlocks(q.text),
//           marks: q.marks,
//           options: q.options.map((opt: any) => ({
//             text: opt.text,
//             isCorrect: opt.isCorrect,
//           })),
//         })
//       } else {
//         // ➕ CREATE NEW QUESTION
//         await strapi.create("question-banks", {
//           questionText: toBlocks(q.text),
//           marks: q.marks,
//           options: q.options,
//           assessments: {
//             connect: [{ documentId: assessmentDocumentId }],
//           },
//         })
//       }
//     }

//     alert(
//       mode === "edit"
//         ? "Assessment updated successfully!"
//         : "Assessment created successfully!"
//     )
//   } catch (error) {
//     console.error(error)
//     alert("Something went wrong")
//   } finally {
//     setIsSubmitting(false)
//   }
// }

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit, e => console.log(e))} className="space-y-8">
//       {/* ---------------- Bank Details ---------------- */}
//       <motion.div
//         initial={{ opacity: 0, y: 24 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <BankDetailsSection form={form} />
//       </motion.div>

//       {/* ---------------- Question Upload ---------------- */}
//       <Card className="rounded-2xl p-8 border border-blue-700/60 bg-blue-950/60">
//         <h2 className="text-xl font-semibold text-sky-300 mb-6">
//           Questions
//         </h2>

//         <Tabs defaultValue="manual">
//           <TabsList className="grid grid-cols-2 mb-6">
//             <TabsTrigger value="manual">Manual Entry</TabsTrigger>
//             <TabsTrigger value="csv">CSV Upload</TabsTrigger>
//           </TabsList>

//           <TabsContent value="manual" className="space-y-4">
//             {questions.map((question, index) => (
//               <QuestionCard
//                 key={index}
//                 question={question}
//                 index={index}
//                 categories={categoryOptions}
//                 onUpdate={(q) => handleUpdateQuestion(index, q)}
//                 onRemove={() => handleRemoveQuestion(index)}
//               />
//             ))}

//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleAddQuestion}
//               className="w-full"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add Question
//             </Button>
//           </TabsContent>

//           <TabsContent value="csv">
//             <CSVUploadCard onQuestionsImport={setQuestions} />
//           </TabsContent>
//         </Tabs>
//       </Card>


//       <div className="flex gap-3">
//         <Button
//           type="submit"
//           className="flex-1"
//           disabled={isSubmitting}
//         >
//           {isSubmitting
//             ? mode === 'edit'
//               ? 'Updating...'
//               : 'Creating...'
//             : mode === 'edit'
//               ? 'Update Assessment'
//               : 'Create Assessment'}
//         </Button>
//       </div>
//     </form>
//   )
// }





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
import { strapi } from '@/lib/api/sdk'
import { diff } from 'util'
import toast from 'react-hot-toast'


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


interface QuestionBankFormProps {
  mode?: 'create' | 'edit'
  initialData?: any
  assessmentId?: string
}

export function QuestionBankForm({
  mode = 'create',
  initialData,
  assessmentId,
}: any) {

  // console.log('initialdata',initialData)

  const [questions, setQuestions] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: initialData || {
      name: '',
      description: '',
      durationMinutes: 0,
      tabSwitchLimit: 0,
      autoSubmitOnTimeout: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      totalMarks: 100,
      attempts: 1,
      instructions: '',
    },
  })
// console.log("Updating Assessment ID:", initialData?.documentId)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset(initialData)

      const mappedQuestions =
        initialData.questions?.map((q: any) => ({
          documentId: q.documentId, // VERY IMPORTANT
          text: q.questionText?.[0]?.children?.[0]?.text || '',
          category: q.category || '',
          type: q.type || 'MCQ',
          difficulty: q.difficulty || 'Medium',
          marks: q.marks,
          options: q.options?.map((opt: any) => ({
            documentId: opt.documentId,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })) || []

      setQuestions(mappedQuestions)
    }
  }, [initialData, mode, form])

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
const handleAssessmentCreate = async (data: FormData) => {
  if (!questions.length) {
    alert("Please add at least one question")
    return
  }

  try {
    setIsSubmitting(true)

    /* ---------------- CREATE ASSESSMENT ---------------- */

    const res = await strapi.create("assessments", {
      
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
        tabSwitchLimit: data.tabSwitchLimit,
        instructions: data.instructions,
        totalMarks: data.totalMarks,
      
    })

    const assessmentDocumentId = res.data.documentId

    /* ---------------- BULK CREATE QUESTIONS ---------------- */

    const toBlocks = (text: string) => [
      {
        type: "paragraph",
        children: [{ type: "text", text }],
      },
    ]

    await Promise.all(
      questions.map((q) =>
        strapi.create("question-banks", {
 
            questionText: toBlocks(q.text),
            marks: q.marks,
            options: q.options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
            assessments: {
              connect: [{ documentId: assessmentDocumentId }],
            },
          
        })
      )
    )

    toast.success("Assessment created successfully!")
    // alert("Assessment created successfully!")
  } catch (error) {
    console.error(error)
    // alert("Failed to create assessment")
    toast.error("Failed to create assessment")
  } finally {
    setIsSubmitting(false)
  }
}

  const handleAssessmentUpdate = async (data: FormData) => {
    try {
      setIsSubmitting(true)
// console.log("Updating Assessment ID:", initialData?.documentId)
      await strapi.update("assessments", initialData.documentId, {
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
        tabSwitchLimit: data.tabSwitchLimit,
        instructions: data.instructions,
        totalMarks: data.totalMarks,
      })
      toast.success("Assessment updated successfully!")
      // alert("Assessment updated successfully!")
    } catch (error) {
      console.error(error)
      // alert("Failed to update assessment")
      toast.error("Failed to update assessment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
  onSubmit={form.handleSubmit((data) =>
    mode === "edit"
      ? handleAssessmentUpdate(data)
      : handleAssessmentCreate(data)
  )}
 className="space-y-8">
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
                assessmentDocumentId={initialData?.documentId}
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
              : 'Create Assessment'}
        </Button>
      </div>
    </form>
  )
}
