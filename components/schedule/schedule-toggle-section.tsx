import { UseFormReturn } from 'react-hook-form'
import { ScheduleFormData } from '@/types/schedule-schema'
import { BatchLoader } from './batch-loader'

interface Props {
  form: UseFormReturn<ScheduleFormData>
}

export function ScheduleToggleSection({ form }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        
        <span className="text-sm text-gray-400 invisible">is Active</span>
      <label className="flex justify-between items-center  p-3 rounded-xl
                        border border-blue-700/40 bg-blue-950/40
                        cursor-pointer hover:bg-blue-900/40">
        <span className="text-gray-300">Is Active</span>

        <input
          type="checkbox"
          {...form.register('isActive')}
          className="accent-blue-600 cursor-pointer"
        />
      </label>
</div>
<div>
   <span className="text-sm text-gray-400 invisible">Allow Reattempt</span>

      <label className="flex justify-between items-center  p-3 rounded-xl
                        border border-blue-700/40 bg-blue-950/40
                        cursor-pointer hover:bg-blue-900/40">
        <span className="text-gray-300">Allow Reattempt</span>

        <input
          type="checkbox"
          {...form.register('allowReattempt')}
          className="accent-blue-600 cursor-pointer"
        />
      </label></div>
  <BatchLoader form={form}/>
    </div>
  )
}