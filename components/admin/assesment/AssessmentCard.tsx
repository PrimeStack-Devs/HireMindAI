'use client';

import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Assessment {
  id: number;
  documentId: string;

  name: string;
  description: string | null;
  instructions: string | null;

  durationMinutes: number;
  totalMarks: number;

  questions: any[];  
  attempts: any[];  
  
  autoSubmitOnTimeout: boolean;
  shuffleOptions: boolean;
  shuffleQuestions: boolean;
  tabSwitchLimit: number;

  publicLinkEnabled: boolean | null;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  createdByUser: any | null;
  organization: any | null;
}

interface AssessmentCardProps {
  assessment: Assessment;
  index: number;
}

export default function AssessmentCard({ assessment, index }: any) {

  const formattedDate = new Date(assessment.createdAt)
  .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log('assesment',assessment)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.05, delay: index * 0.01 }}
      whileHover={{ y: -8, transition: { duration: 0.02 } }}
      className="group relative bg-blue-950/20 backdrop-blur border border-blue-700/50 rounded-xl p-6 hover:border-blue-600/70 hover:shadow-xl hover:shadow-blue-600/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <Link
          href={`/dashboard/assessments/${assessment.id}`}
          className="flex-1 hover:opacity-80 transition-opacity"
        >
          <h3 className="text-lg font-semibold text-gray-50 group-hover:text-blue-300 transition-colors">
            {assessment.name}
          </h3>
        </Link>

        {/* Three Dot Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-blue-600/10 transition-all"
            >
              <MoreVertical size={18} />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-900 border-blue-700/50 text-gray-200"
          >
            <Link href={`/admin/assessments/view/${assessment.id}`}>
              <DropdownMenuItem className="hover:bg-blue-600/20 cursor-pointer" >
                View

              </DropdownMenuItem>
            </Link>
            <Link href={`/admin/assessments/edit/${assessment.id}`}>
              <DropdownMenuItem className="hover:bg-blue-600/20 cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="hover:bg-red-600/20 text-red-400 cursor-pointer">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Questions</span>
          <span className="text-gray-200 font-semibold">
            {assessment.questions?.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Time</span>
          <span className="text-gray-200 font-semibold">
            {assessment?.durationMinutes} min
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Marks</span>
          <span className="text-gray-200 font-semibold">
            {assessment?.totalMarks}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-700/30">
        <p className="text-xs text-gray-500">
          Created: {formattedDate}
        </p>
      </div>
    </motion.div>
  );
}
