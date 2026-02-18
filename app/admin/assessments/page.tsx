'use client';

import AssessmentGrid from '@/components/admin/assesment/AssessmentGrid';
import Header from '@/components/admin/Header';
import { useState } from 'react';


const mockAssessments = [
  {
    id: 1,
    name: 'JavaScript Fundamentals',
    totalQuestions: 25,
    timeMinutes: 45,
    totalMarks: 100,
    createdDate: '2024-02-01',
  },
  {
    id: 2,
    name: 'React Advanced Patterns',
    totalQuestions: 30,
    timeMinutes: 60,
    totalMarks: 150,
    createdDate: '2024-02-02',
  },
  {
    id: 3,
    name: 'System Design Interview',
    totalQuestions: 5,
    timeMinutes: 90,
    totalMarks: 200,
    createdDate: '2024-02-03',
  },
  {
    id: 4,
    name: 'Python Data Structures',
    totalQuestions: 20,
    timeMinutes: 40,
    totalMarks: 80,
    createdDate: '2024-02-04',
  },
  {
    id: 5,
    name: 'Full Stack Development',
    totalQuestions: 35,
    timeMinutes: 75,
    totalMarks: 175,
    createdDate: '2024-02-05',
  },
  {
    id: 6,
    name: 'Database Design Basics',
    totalQuestions: 18,
    timeMinutes: 50,
    totalMarks: 90,
    createdDate: '2024-02-06',
  },
];

export default function AssessmentsPage() {
  const [assessments] = useState(mockAssessments);

  return (
    <main className="min-h-screen text-white px-6 py-10">
      <Header />
      <AssessmentGrid assessments={assessments} />
    </main>


  );
}
