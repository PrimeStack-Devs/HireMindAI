'use client';

import { motion } from 'framer-motion';
import AssessmentCard from './AssessmentCard';

interface Assessment {
  id: number;
  name: string;
  totalQuestions: number;
  timeMinutes: number;
  totalMarks: number;
  createdDate: string;
}

interface AssessmentGridProps {
  assessments: Assessment[];
}

export default function AssessmentGrid({ assessments }: AssessmentGridProps) {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {assessments.map((assessment, index) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}
