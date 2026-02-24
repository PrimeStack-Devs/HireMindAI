'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
    open: boolean
    onClose: () => void
    skill: any
}

export function SkillQuestionsModal({ open, onClose, skill }: Props) {
    console.log("skill viewww ",skill)
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {skill?.name} Questions
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] mt-4">
                    <div className="space-y-3">
                        {skill?.questions?.length === 0 && (
                            <p className="text-gray-400 text-center">
                                No questions linked
                            </p>
                        )}

                        {skill?.questions?.map((q: any) => (
                            <div
                                key={q.id}
                                className="p-3 rounded-md border border-blue-600/20 bg-blue-900/30"
                            >
                                <p className="text-sm text-white">
                                    {q.question || q.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}