'use client'

import Header from '@/components/admin/Header'
import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Papa from 'papaparse'
import { strapi } from '@/lib/api/sdk'

export default function Page() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [batchName, setBatchName] = useState('')
  const [description, setDescription] = useState('')
const [students, setStudents] = useState<any[]>([])
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setFileName(file.name)
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const cleanedData = results.data.map((row: any) => ({
                email: row.email?.trim().toLowerCase(),
                enrollment: row.enrollment?.trim(),
            }))
            
            console.log('Batch Name:', batchName)
            console.log('Description:', description)
            console.log('Cleaned Data:', cleanedData)
            setStudents(cleanedData)
        },
        error: (error) => {
            console.error('Error parsing CSV:', error)
        },
    })
}

  const handleSubmit = async () => {
  try {
    if (!students.length) {
      alert("Upload CSV first")
      return
    }

    // 1️⃣ Create Batch
     const res = await strapi.create("batches", {
        name: batchName,
        description: description,
          });
          console.log('API Response:', res);

    

    // 2️⃣ Chunk students into groups of 20
    const chunkSize = 20
    const chunks = []

    for (let i = 0; i < students.length; i += chunkSize) {
      chunks.push(students.slice(i, i + chunkSize))
    }

    // 3️⃣ Process each chunk sequentially
   const batchDocumentId = res.data.documentId

for (const chunk of chunks) {
  await Promise.all(
    chunk.map((student) =>
      strapi.create("batch-candidates", {
        email: student.email,
        enrollment: student.enrollment,
        candidateStatus: "pending",
        batch: {
          connect: [batchDocumentId],
        },
      })
    )
  )
}
    console.log("All students created successfully 🚀")
  } catch (error) {
    console.error("Batch creation failed:", error)
  }
}

  return (
    <main className="min-h-screen text-white px-6 py-6">
      {/* <Header /> */}

      <div className="max-w-4xl mx-auto mt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create New Batch</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Upload a CSV file containing student details to create a new batch.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl p-8 space-y-6">

          {/* Batch Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Batch Name</label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g. CSE 2026 - Round 1"
              className="w-full rounded-lg bg-secondary border border-border/40 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description about this batch..."
              rows={3}
              className="w-full rounded-lg bg-secondary border border-border/40 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          {/* CSV Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File</label>

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/40 rounded-xl bg-secondary/40 hover:border-primary transition-all cursor-pointer">
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Click or drag a CSV file to upload
              </span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {fileName && (
              <div className="flex items-center gap-2 text-sm text-green-400 mt-2">
                <FileText className="w-4 h-4" />
                {fileName}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-blue-500 text-primary-foreground font-semibold py-3 rounded-lg transition-all"
            >
              Create Batch
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}