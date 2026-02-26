import { UseFormReturn } from 'react-hook-form'
import { ScheduleFormData } from '@/types/schedule-schema'

interface Props {
  form: UseFormReturn<ScheduleFormData>
}

export function ScheduleTimeSection({ form }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <label className="block cursor-pointer">
        <span className="text-sm text-gray-400">Start Time</span>

        <input
          type="datetime-local"
          {...form.register('startTime')}
          className="mt-2 w-full rounded-xl p-3
                     bg-blue-950/40 border border-blue-700/60
                     text-gray-200 cursor-pointer
                     focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label className="block cursor-pointer">
        <span className="text-sm text-gray-400">End Time</span>

        <input
          type="datetime-local"
          {...form.register('endTime')}
          className="mt-2 w-full rounded-xl p-3
                     bg-blue-950/40 border border-blue-700/60
                     text-gray-200 cursor-pointer
                     focus:ring-2 focus:ring-blue-500"
        />
      </label>

    </div>
  )
}