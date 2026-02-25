import { UseFormReturn } from 'react-hook-form'
import { ScheduleFormData } from '@/types/schedule-schema'

interface Props {
  form: UseFormReturn<ScheduleFormData>
}

export function ScheduleStatusSection({ form }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="text-sm text-gray-400">Status</label>
        <select
          {...form.register('scheduleStatus')}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        >
          

          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400">Visibility</label>
        <select
          {...form.register('visibility')}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        >
           
          <option value="batch-only">Batch Only</option>
          <option value="Public">Public</option>
          <option value="invite-only">Invite Only</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400">Result Release</label>
        <select
          {...form.register('resultReleaseMode')}
          className="mt-2 w-full rounded-xl p-3 bg-blue-950/40 border border-blue-700/60 text-gray-200"
        >
         
          <option value="instant">Instant</option>
          <option value="afterEnd">After End Time</option>
          <option value="manual">Manual</option>
        </select>
      </div>
    </div>
  )
}