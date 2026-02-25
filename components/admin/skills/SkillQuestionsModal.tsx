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

                        {skill?.questions?.map((q: any,index:any) => (
                            <div
                                key={q.id}
                                className="p-3 rounded-md border border-blue-600/20 bg-blue-900/30 flex items-start space-x-3"
                            >
                                <span>{index+1}</span>
                                <p className="text-md text-white  ">
                                    {q?.questionText[0]?.children[0]?.text || q?.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}