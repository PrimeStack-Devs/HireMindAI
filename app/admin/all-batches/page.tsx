'use client'

import Header from '@/components/admin/Header'
import { useStrapi } from '@/lib/api/useStrapi'
import { LoaderCircle, Users, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function page() {
  const { data, isLoading, error } = useStrapi("batches", {
  populate: { candidates: true }  
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 flex-col gap-6">
        <LoaderCircle className="w-10 h-10 animate-spin" />
        Loading batches...
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-400">
        Failed to load batches. Please refresh.
      </div>
    )
console.log("Fetched Batches:", data?.data)
  return (
    <main className="min-h-screen text-white px-6 py-6">
      {/* <Header /> */}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {data?.data?.length === 0 && (
          <div className="text-center text-muted-foreground col-span-full mt-20">
            No batches created yet.
          </div>
        )}

        {data?.data?.map((batch: any) => {
          const { name, description, createdAt, candidates } = batch

          return (
            <Card
              key={batch.id}
              className="border-border/50 bg-card/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 rounded-xl"
            >
              <h2 className="text-lg font-bold mb-2">{name}</h2>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {description || "No description provided."}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {candidates?.length || 0} Students
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          )
        })}

      </div>
    </main>
  )
}