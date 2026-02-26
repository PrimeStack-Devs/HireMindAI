import { UseFormReturn } from 'react-hook-form'
import { ScheduleFormData } from '@/types/schedule-schema'

interface Props {
  form: UseFormReturn<ScheduleFormData>
}

export function ScheduleLimitsSection({ form }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="text-sm text-gray-400">Duration</label>
        <input
          type="number"
          {...form.register('duration', { valueAsNumber: true })}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">Max Attempts</label>
        <input
          type="number"
          {...form.register('maxAttempts', { valueAsNumber: true })}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">Grace Time</label>
        <input
          type="number"
          {...form.register('graceTime', { valueAsNumber: true })}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        />
      </div>
    </div>
  )
}