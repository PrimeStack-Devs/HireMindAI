'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
 
export const formSchema = z.object({
  name: z.string().min(1, 'Question Bank name is required'),
  description: z.string().optional(),

  durationMinutes: z.number().min(1, 'Duration is required'),
  tabSwitchLimit: z.number().min(0).optional(),

  autoSubmitOnTimeout: z.boolean().default(false),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(false),

  totalMarks: z.number().min(1, 'Total marks is required'),
  attempts: z.number().min(1, 'Attempts is required'),

  instructions: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

/* -------------------- Props -------------------- */
interface BankDetailsSectionProps {
  form: UseFormReturn<FormData>
}

/* -------------------- Boolean Toggle -------------------- */
function BooleanToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-200">{label}</Label>

      <div
        onClick={() => onChange(!value)}
        className="
          relative w-32 h-9 cursor-pointer select-none
          rounded-lg border border-blue-700/60
          bg-blue-950/40 overflow-hidden
        "
      >
        {/* Sliding Active Box */}
        <div
          className={`
            absolute top-0 bottom-0 w-1/2 rounded-md
            shadow-md shadow-blue-500/40
            transition-transform duration-300 ease-out
            ${value ? 'translate-x-full bg-blue-600' : 'translate-x-0 bg-gray-400'}
          `}
        />

        {/* Labels */}
        <div className="relative z-10 flex h-full text-sm font-semibold">
          <div
            className={`flex-1 flex items-center justify-center transition-colors
              ${!value ? 'text-white' : 'text-gray-400'}
            `}
          >
            NO
          </div>
          <div
            className={`flex-1 flex items-center justify-center transition-colors
              ${value ? 'text-white' : 'text-gray-400'}
            `}
          >
            YES
          </div>
        </div>
      </div>
    </div>
  )
}

 
export function BankDetailsSection({ form }: BankDetailsSectionProps) {
  return (
    <Card className="rounded-2xl p-8 border border-blue-700/60 bg-gradient-to-br from-blue-950/70 to-blue-900/40 shadow-2xl shadow-blue-900/40 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-sky-300 mb-6">
        Assessments Details
      </h2>

      <div className="space-y-8">
        {/* ---------------- Name ---------------- */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Assessments Name <span className="text-sky-400">*</span>
          </Label>
          <Input
            placeholder="e.g., Senior React Developer Assessment"
            className="bg-blue-950/50 border border-blue-700/60 text-white placeholder:text-gray-500"
            {...form.register('name')}
          />
        </div>

        {/* ---------------- Description ---------------- */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Description
          </Label>
          <Textarea
            className="min-h-24 bg-blue-950/50 border border-blue-700/60 text-white"
            {...form.register('description')}
          />
        </div>

        {/* ---------------- Duration & Tab Switch ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Duration (Minutes) <span className="text-sky-400">*</span>
            </Label>
            <Input
              type="number"
              className="bg-blue-950/50 border border-blue-700/60 text-white"
              {...form.register('durationMinutes', {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Tab Switch Limit
            </Label>
            <Input
              type="number"
              className="bg-blue-950/50 border border-blue-700/60 text-white"
              {...form.register('tabSwitchLimit', {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        {/* ---------------- Toggles ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BooleanToggle
            label="Auto Submit On Timeout"
            value={form.watch('autoSubmitOnTimeout')}
            onChange={(v) => form.setValue('autoSubmitOnTimeout', v)}
          />

          <BooleanToggle
            label="Shuffle Questions"
            value={form.watch('shuffleQuestions')}
            onChange={(v) => form.setValue('shuffleQuestions', v)}
          />

          <BooleanToggle
            label="Shuffle Answers"
            value={form.watch('shuffleOptions')}
            onChange={(v) => form.setValue('shuffleOptions', v)}
          />
        </div>

        {/* ---------------- Total Marks & Attempts ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Total Marks <span className="text-sky-400">*</span>
            </Label>
            <Input
              type="number"
              className="bg-blue-950/50 border border-blue-700/60 text-white"
              {...form.register('totalMarks', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Attempts <span className="text-sky-400">*</span>
            </Label>
            <Input
              type="number"
              className="bg-blue-950/50 border border-blue-700/60 text-white"
              {...form.register('attempts', { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* ---------------- Instructions ---------------- */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-200">
            Instructions
          </Label>
          <Textarea
            className="min-h-[220px] bg-blue-950/50 border border-blue-700/60 text-white"
            {...form.register('instructions')}
          />
        </div>
      </div>
    </Card>
  )
}
