'use client'

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileText, X } from 'lucide-react'
import * as z from 'zod'
 


const questionSchema = z.object({
  text: z.string().min(1),
  category: z.string(), // ✅ REQUIRED
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

interface CSVUploadCardProps {
  onQuestionsImport: (questions: QuestionData[]) => void
}

/* -------------------- Component -------------------- */
export function CSVUploadCard({ onQuestionsImport }: CSVUploadCardProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setError('')

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file')
      return
    }

    setUploadedFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownloadSample = () => {
    const sampleCSV = `question,optionA,optionB,optionC,optionD,correctOptions,difficulty,marks
What is React?,A library,A framework,A language,A tool,1,Easy,1
What is the virtual DOM?,A real DOM,An abstraction,A browser API,A library,2,Medium,2`

    const blob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-questions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCSV = async () => {
    if (!uploadedFile) {
      setError('Please select a file')
      return
    }

    try {
      const text = await uploadedFile.text()
      const lines = text.split('\n').filter(Boolean)

      if (lines.length < 2) {
        setError('CSV must contain at least one question')
        return
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      const questions: QuestionData[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim())

        const questionText = values[headers.indexOf('question')]
        const difficulty = values[headers.indexOf('difficulty')]
        const marks = Number(values[headers.indexOf('marks')])
        const correctStr = values[headers.indexOf('correctoptions')]

        if (!questionText || !difficulty || !marks) continue

        const options = ['optiona', 'optionb', 'optionc', 'optiond']
          .map((key, idx) => {
            const value = values[headers.indexOf(key)]
            if (!value) return null
            return {
              text: value,
              isCorrect: correctStr === String(idx + 1),
            }
          })
          .filter(Boolean) as { text: string; isCorrect: boolean }[]

        if (!options.some((o) => o.isCorrect)) {
          options[0].isCorrect = true
        }

        questions.push({
          text: questionText,
          category: 'Uncategorized',  
          type: 'MCQ',
          difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
          marks,
          options,
        })
      }

      if (!questions.length) {
        setError('No valid questions found')
        return
      }

      onQuestionsImport(questions)
      setUploadedFile(null)
    } catch {
      setError('Failed to read CSV file')
    }
  }

  return (
    <Card className="rounded-2xl p-8 border border-blue-700/60 bg-blue-950/60">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="space-y-4 text-center">
        <Upload className="mx-auto h-10 w-10 text-sky-400" />

        <Button onClick={() => fileInputRef.current?.click()}>
          Select CSV File
        </Button>

        {uploadedFile && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>{uploadedFile.name}</span>
            <X
              className="cursor-pointer text-red-400"
              onClick={handleClearFile}
            />
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadSample}>
            <Download className="mr-2 h-4 w-4" />
            Sample CSV
          </Button>

          <Button onClick={handleImportCSV} disabled={!uploadedFile}>
            Import
          </Button>
        </div>
      </div>
    </Card>
  )
}
