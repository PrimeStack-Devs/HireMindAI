'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { strapi } from '@/lib/api/sdk'
import { SkillModal } from '@/components/admin/skills/skill-modal'
import { SkillQuestionsModal } from '@/components/admin/skills/SkillQuestionsModal'
import { Skeleton } from '@/components/ui/skeleton'

const fetcher = async ([collection, query]: [string, any]) => {
    const res = await strapi.find(collection, query)
    return res.data
}

export default function SkillsPage() {
    const { data: skills, isLoading, mutate } = useSWR(
        [
            'skills',
            {
                sort: ['createdAt:desc'],
                populate: {
                    questions: true
                }
            }
        ],
        fetcher
    )
    const { toast } = useToast()

    const [viewSkill, setViewSkill] = useState<any>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const [open, setOpen] = useState(false)
    const [editingSkill, setEditingSkill] = useState<any>(null)

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this skill?')) return

        try {
          await strapi.delete('skills', String(id))
           

            toast({
                title: 'Skill deleted',
            })

            mutate()
        } catch (err: any) {
            toast({
                title: 'Error',
                description:
                    err?.response?.data?.error?.message || 'Delete failed',
                variant: 'destructive',
            })
        }
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-sky-300">
                    Skills Management
                </h1>

                <Button onClick={() => {
                    setEditingSkill(null)
                    setOpen(true)
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                </Button>
            </div>

            {/* Skills List */}
            <Card className="p-6 rounded-2xl border border-blue-700/50 bg-blue-950/40">
                {isLoading && (
                    <div className="grid md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-lg border border-blue-600/30 bg-blue-900/40 space-y-3"
                            >
                                <Skeleton className="h-5 w-2/3 bg-blue-800/50 animate-pulse" />
                                <Skeleton className="h-4 w-1/2 bg-blue-800/50 animate-pulse" />
                                <Skeleton className="h-3 w-1/3 bg-blue-800/50 animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}


                {!isLoading && skills?.length === 0 && (
                    <p className="text-gray-400 text-center py-10">
                        No skills yet. Create your first skill.
                    </p>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                    {skills?.map((skill: any) => (
                        <motion.div
                            key={skill.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                                setViewSkill(skill)
                                setViewOpen(true)
                            }}
                            className="cursor-pointer group relative p-4 rounded-lg border border-blue-600/30 bg-blue-900/40 transition hover:border-blue-500"
                        >
                            <h3 className="font-medium text-white">
                                {skill.name}
                            </h3>

                            <p className="text-sm text-gray-400">
                                {skill.value}
                            </p>

                            <span className="text-xs text-sky-300 mt-1 block">
                                {skill?.questions?.length || 0} Questions
                            </span>

                            {/* Actions */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2"
                            >
                                <button
                                    onClick={() => {
                                        setEditingSkill(skill)
                                        setOpen(true)
                                    }}
                                    className="p-1 hover:text-blue-400"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(skill.documentId)}
                                    className="p-1 hover:text-red-400"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Modal */}
            <SkillModal
                open={open}
                skill={editingSkill}
                onClose={() => setOpen(false)}
                onCreated={() => {
                    mutate()
                    setOpen(false)
                }}
            />
            <SkillQuestionsModal
                open={viewOpen}
                skill={viewSkill}
                onClose={() => setViewOpen(false)}
            />
        </div>
    )
}