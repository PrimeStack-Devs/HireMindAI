'use client';

import { motion } from 'framer-motion';
import AssessmentCard from './AssessmentCard';

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

// interface AssessmentGridProps {
//   assessments: Assessment[];
// }

export default function AssessmentGrid({ assessments,mutate }: any) {
  // console.log('nreifneoi',assessments);
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {assessments?.map((assessment:any, index:any) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            index={index}
            mutate={mutate}
          />
        ))}
      </motion.div>
    </div>
  );
}
