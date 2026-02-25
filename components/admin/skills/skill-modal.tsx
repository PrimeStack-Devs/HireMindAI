'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { strapi } from '@/lib/api/sdk'

interface SkillModalProps {
    open: boolean
    onClose: () => void
    onCreated: () => void
    skill?: any
}

const generateValue = (name?: string) => {
    if (!name) return ''
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

export function SkillModal({ open, onClose, onCreated, skill }: SkillModalProps) {
    const { toast } = useToast()

    const [name, setName] = useState('')
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [isValueEdited, setIsValueEdited] = useState(false)

    useEffect(() => {
        if (skill) {
            setName(skill.name)
            setValue(skill.value)
        } else {
            setName('')
            setValue('')
        }
    }, [skill])

    useEffect(() => {
        if (!name || isValueEdited) return
        setValue(generateValue(name))
    }, [name, isValueEdited])

    const handleSubmit = async () => {
        try {
            setLoading(true)

            if (skill) {
                await strapi.update('skills', skill.documentId, {
                    name, value 
                })

                toast({ title: 'Skill updated' })
            } else {
                await strapi.create('skills', {
                    name, value 
                })

                toast({ title: 'Skill created' })
            }

            setIsValueEdited(false)
            onCreated()
            onClose()

        } catch (error: any) {
            toast({
                title: 'Error',
                description:
                    error?.response?.data?.error?.message || 'Operation failed',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {skill ? 'Edit Skill' : 'Create Skill'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Skill Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        placeholder="Skill Value"
                        value={value}
                        onChange={(e) => {
                            setIsValueEdited(true)
                            setValue(e.target.value)
                        }}
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading
                            ? skill
                                ? 'Updating...'
                                : 'Creating...'
                            : skill
                                ? 'Update Skill'
                                : 'Create Skill'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}