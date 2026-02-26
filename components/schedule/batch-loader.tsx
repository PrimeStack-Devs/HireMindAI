'use client'

import { UseFormReturn } from 'react-hook-form'
import { ScheduleFormData } from '@/types/schedule-schema'
import { useStrapi } from '@/lib/api/useStrapi'

interface Props {
  form: UseFormReturn<ScheduleFormData>
}

export function BatchLoader({ form }: Props) {

  const { data, isLoading, error } = useStrapi('batches', {
    fields: ['name', 'documentId'],
  })

  const batches =
    data?.data?.map((batch: any) => ({
      documentId: batch.documentId,
      name: batch.name,
    })) ?? []

  return (
    <div>
      <label className="block cursor-pointer">
        <span className="text-sm text-gray-400">Select Batch</span>

        <select
          {...form.register('batchDocumentId')}
          className="mt-2 w-full rounded-xl p-3
                     bg-blue-950/40 border border-blue-700/60
                     text-gray-200 cursor-pointer
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {isLoading ? 'Loading batches...' : 'Select a batch'}
          </option>

          {batches.map((batch: any) => (
            <option key={batch.documentId} value={batch.documentId}>
              {batch.name}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="text-red-400 text-sm mt-2">
          Failed to load batches
        </p>
      )}
    </div>
  )
}