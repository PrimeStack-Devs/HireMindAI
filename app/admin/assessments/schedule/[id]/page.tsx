'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { strapi } from '@/lib/api/sdk'

import { scheduleSchema, ScheduleFormData } from '@/types/schedule-schema'
import { ScheduleTimeSection } from '@/components/schedule/schedule-time-section'
import { ScheduleLimitsSection } from '@/components/schedule/schedule-limits-section'
import { ScheduleStatusSection } from '@/components/schedule/schedule-status-section'
import { ScheduleToggleSection } from '@/components/schedule/schedule-toggle-section'
import { BatchLoader } from '@/components/schedule/batch-loader'
import { useParams ,useRouter} from 'next/navigation'


 function page() {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  })
const router=useRouter();
   const params = useParams();

 const onSubmit = async (data: ScheduleFormData) => {
console.log("assessment",params.id)
console.log("batchDocumentId",data.batchDocumentId)

  const res =await strapi.create('assessment-schedules', {
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    maxAttempts: data.maxAttempts,
    graceTime: data.graceTime,
    scheduleStatus: data.scheduleStatus,
    visibility: data.visibility,
    resultReleaseMode: data.resultReleaseMode,
    isActive: data.isActive,
    allowReattempt: data.allowReattempt,

    assessment: {
      connect: [{ documentId: params.id }],
    },

    batch: {
      connect: [{ documentId: data.batchDocumentId }],
    },
  })

  console.log("res",res)
router.push(`/assessment/${res.data.documentId}`)
}

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl p-8 border border-blue-700/60 bg-blue-950/60 space-y-8">
          <h2 className="text-2xl font-semibold text-sky-300">
            Schedule Assessment
          </h2>

          <ScheduleTimeSection form={form} />
          <ScheduleLimitsSection form={form} />
          <ScheduleStatusSection form={form} />
       
          <ScheduleToggleSection form={form} />
          
        </Card>
      </motion.div>

      <Button type="submit" className="w-full">
        Create Schedule
      </Button>
    </form>
  )
}


export default page;