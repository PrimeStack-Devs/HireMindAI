import * as z from 'zod'

export const scheduleSchema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  duration: z.number().min(1),
  maxAttempts: z.number().min(1),
  graceTime: z.number().min(0),
  scheduleStatus: z.string(),
  visibility: z.string(),
  resultReleaseMode: z.string(),
  isActive: z.boolean(),
  allowReattempt: z.boolean(),
    batchDocumentId: z.string().min(1, "Batch is required"), // ✅ ADD
})

export type ScheduleFormData = z.infer<typeof scheduleSchema>