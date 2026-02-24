// 






'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X, Trash2 } from 'lucide-react'
import * as z from 'zod'
import { strapi } from '@/lib/api/sdk'

/* -------------------- Schema -------------------- */
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
interface QuestionCardProps {
  question: any
  index: number
  categories: string[]
  onUpdate: (question: any) => void
  onRemove: () => void
  assessmentDocumentId: string
}

export function QuestionCard({
  question,
  index,
  categories,
  onUpdate,
  onRemove,
  assessmentDocumentId,
}: QuestionCardProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

   

const handleSaveQuestion = async () => {
  try {
    const toBlocks = (text: string) => [
      {
        type: "paragraph",
        children: [{ type: "text", text }],
      },
    ]

    if (question.documentId) {
      // 🔁 UPDATE
      await strapi.update("question-banks", question.documentId, {
        questionText: toBlocks(question.text),
        marks: question.marks,
        options: question.options,
      })
    } else {
      // ➕ CREATE
      await strapi.create("question-banks", {
        questionText: toBlocks(question.text),
        marks: question.marks,
        options: question.options,
        assessments: {
          connect: [{ documentId: assessmentDocumentId }],
        },
      })
      
    }
     

    alert("Question saved successfully!")
  } catch (error) {
    console.error(error)
    alert("Failed to save question")
  }
}
 
 
  /* -------------------- Handlers -------------------- */
  const handleTextChange = (text: string) =>
    onUpdate({ ...question, text })

  const handleCategoryChange = (category: string) =>
    onUpdate({ ...question, category })

  const handleTypeChange = (type: string) =>
    onUpdate({
      ...question,
      type: type as 'MCQ' | 'Multi-select' | 'True/False',
    })

  const handleDifficultyChange = (difficulty: string) =>
    onUpdate({
      ...question,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
    })

  const handleMarksChange = (marks: string) => {
    const num = parseInt(marks, 10)
    if (!isNaN(num) && num > 0) {
      onUpdate({ ...question, marks: num })
    }
  }

  const handleOptionTextChange = (optionIndex: number, text: string) => {
    const newOptions = [...question.options]
    newOptions[optionIndex].text = text
    onUpdate({ ...question, options: newOptions })
  }

  const handleOptionCorrectChange = (optionIndex: number) => {
    const newOptions = question?.options?.map((opt:any, idx:any) => ({
      ...opt,
      isCorrect: idx === optionIndex,
    }))
    onUpdate({ ...question, options: newOptions })
  }

  const handleAddOption = () =>
    onUpdate({
      ...question,
      options: [...question.options, { text: '', isCorrect: false }],
    })

  const handleRemoveOption = (optionIndex: number) => {
    if (question.options.length > 2) {
      onUpdate({
        ...question,
        options: question.options.filter((_:any, i:any) => i !== optionIndex),
      })
    }
  }

   
  return (
    <Card
      className="
        p-6 rounded-2xl
        border border-blue-700/60
        bg-gradient-to-br from-blue-950/70 to-blue-900/40
        shadow-xl shadow-blue-900/40
        backdrop-blur-sm
      "
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-sky-300">
          Question {index + 1}
        </h3>
        <Button
          type="button"
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Question <span className="text-sky-400">*</span>
          </Label>
          <Textarea
            value={question.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your question here"
            className="
              min-h-20
              bg-blue-950/40
              border border-blue-700/60
              text-gray-200
            "
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Category <span className="text-sky-400">*</span>
          </Label>
          <Select
            value={question.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-blue-950/40 border-blue-700/60 text-gray-200">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-blue-950 border-blue-700/60">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type, Difficulty, Marks */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Type', value: question.type, onChange: handleTypeChange },
            {
              label: 'Difficulty',
              value: question.difficulty,
              onChange: handleDifficultyChange,
            },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="space-y-2">
              <Label className="text-sm font-medium text-gray-200">
                {label} <span className="text-sky-400">*</span>
              </Label>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="bg-blue-950/40 border-blue-700/60 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-700/60">
                  {label === 'Type' ? (
                    <>
                      <SelectItem value="MCQ">MCQ</SelectItem>
                      <SelectItem value="Multi-select">Multi-select</SelectItem>
                      <SelectItem value="True/False">True / False</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Marks <span className="text-sky-400">*</span>
            </Label>
            <Input
              type="number"
              value={question.marks}
              onChange={(e) => handleMarksChange(e.target.value)}
              min="1"
              className="bg-blue-950/40 border-blue-700/60 text-gray-200"
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">
            Options <span className="text-sky-400">*</span>
          </Label>

          {question?.options?.map((option:any, optionIndex:any) => (
            <div
              key={optionIndex}
              className="flex items-center gap-3 p-3 rounded-lg border border-blue-700/40 bg-blue-950/30"
            >
              <Checkbox
                checked={option.isCorrect}
                onCheckedChange={() =>
                  handleOptionCorrectChange(optionIndex)
                }
              />

              <Input
                value={option.text}
                onChange={(e) =>
                  handleOptionTextChange(optionIndex, e.target.value)
                }
                placeholder={`Option ${optionIndex + 1}`}
                className="flex-1 bg-transparent border-none text-gray-200"
              />

              {question.options.length > 2 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveOption(optionIndex)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddOption}
            size="sm"
            variant="outline"
            className="w-full border-blue-700/60 bg-blue-950/40 text-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
          
          <Button
  type="button"
  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
  onClick={handleSaveQuestion}
>
  Save Question
</Button>
        </div>
      </div>
    </Card>
  )
}
