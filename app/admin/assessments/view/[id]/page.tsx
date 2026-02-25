'use client';

import { strapi } from '@/lib/api/sdk';
import { useStrapi } from '@/lib/api/useStrapi';
import { questions } from '@/lib/questions';
import { da } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ===== THEME CONSTANTS ===== */
const TEXT_GRADIENT = 'from-blue-200 to-sky-400';
const ACCENT_BG =
  'bg-gradient-to-br from-blue-950/70 to-blue-900/50 border border-blue-700/60';

/* ===== MOCK DATA ===== */


export default function AssessmentDetailPage() {
  const router = useRouter();
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const params = useParams();
  const { data, isLoading, error } = useStrapi("assessments", {
    populate: {questions:{populate:"*"}},
    where:{id:Number(params.id)},
  });
  
  // console.log('data:',data?.data[0])
   
  const [assessment, setAssessment] = useState<any>(null);
  useEffect(() => {
  if (data?.data?.length! > 0) {
    setAssessment(data?.data[0]);
  }
}, [data]);
  // console.log('assessment:',assessment)
  // console.log('assessment:',assessment?.questions[0]?.questionText[0]?.children[0]?.text)
  // console.log('assessment:',assessment?.questions[0]?.options)
const handleSave = async () => {
  try {
    // 1️⃣ Update local UI immediately
    const updatedQuestions = assessment.questions.map((q: any) =>
      q.id === editingQuestion.id ? editingQuestion : q
    );

    setAssessment({
      ...assessment,
      questions: updatedQuestions,
    });

    // 2️⃣ Send only required fields to Strapi
    await strapi.update(
  "questions",
  editingQuestion.documentId,
  {
    data: {
      questionText: editingQuestion.questionText,
      marks: editingQuestion.marks,
      options: editingQuestion.options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    },
  }
);

    console.log("Question updated successfully");

    setEditingQuestion(null);
  } catch (error) {
    console.error("Update failed:", error);
  }
};

  console.log(assessment)
  return (
    <main className="min-h-screen text-white   relative">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1
          className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-transparent`}
        >
          Assessment Details
        </h1>
        <p className="text-gray-300 mt-2">
          Review and manage assessment questions and answers
        </p>
      </motion.div>

      {/* SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-10 ${ACCENT_BG}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Assessment Name</p>
            <p className="font-semibold">{assessment?.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Questions</p>
            <p className="font-semibold">{assessment?.questions?.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Marks</p>
            <p className="font-semibold">{assessment?.totalMarks}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Time</p>
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/40">
              {assessment?.durationMinutes} minutes
            </span>
          </div>
          <div>
             <Link
          href={`/admin/assessments/schedule/${params.id}`}
          className="flex-1 hover:opacity-80 transition-opacity"
        >

            <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-600/50 cursor-pointer text-blue-300 border border-blue-600/40">
              schedule Now
            </span>
        </Link>
          </div>
        </div>
      </motion.div>

      {/* QUESTIONS */}
      <div className="space-y-8">
        {assessment?.questions?.map((question:any, index:number) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
            className={`rounded-2xl p-6 ${ACCENT_BG}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Q{index + 1}. {question?.questionText[0]?.children[0]?.text}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Marks: {question.marks}
                </p>
              </div>

              <button
                onClick={() => setEditingQuestion(question)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question?.options?.map((option:any, idx:any) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    option.isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-blue-700/40 bg-blue-950/40'
                  }`}
                >
                  {option.isCorrect && (
                    <CheckCircle className="text-green-400" size={18} />
                  )}
                  <span
                    className={`text-sm ${
                      option.isCorrect ? 'text-green-300' : 'text-gray-300'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>


{/* EDIT QUESTION MODAL */}
 
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl p-8
                       bg-gradient-to-br from-blue-950/80 to-blue-900/60
                       border border-blue-700/60
                       shadow-2xl shadow-blue-900/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-sky-400 bg-clip-text text-transparent">
                Edit Question
              </h2>

              <button
                onClick={() => setEditingQuestion(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Question</label>
                <textarea
  value={
    editingQuestion?.questionText?.[0]?.children?.[0]?.text || ''
  }
  onChange={(e) => {
    const updatedQuestionText = [
      {
        ...editingQuestion.questionText[0],
        children: [
          {
            ...editingQuestion.questionText[0].children[0],
            text: e.target.value,
          },
        ],
      },
    ];

    setEditingQuestion({
      ...editingQuestion,
      questionText: updatedQuestionText,
    });
  }}
  className="mt-2 w-full rounded-xl p-4
             bg-blue-950/40 border border-blue-700/60
             text-gray-200 focus:ring-2 focus:ring-blue-500"
/>
              </div>

              <div>
                <label className="text-sm text-gray-400">Marks</label>
                <input
                  type="number"
                  value={editingQuestion.marks}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      marks: Number(e.target.value),
                    })
                  }
                  className="mt-2 w-32 rounded-lg px-4 py-2
                             bg-blue-950/40 border border-blue-700/60
                             text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm text-gray-400">Options</label>
{/* {console.log('editingQuestion.options:',editingQuestion)} */}
                {editingQuestion.options.map((option: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl
                               border border-blue-700/40 bg-blue-950/40"
                  >
                    <input
                      type="radio"
                      checked={option.isCorrect}
                      onChange={() => {
                        const updated = editingQuestion.options.map(
                          (opt: any, i: number) => ({
                            ...opt,
                            isCorrect: i === idx,
                          })
                        );

                        setEditingQuestion({
                          ...editingQuestion,
                          options: updated,
                        });
                      }}
                      className="accent-blue-600"
                    />

                    <input
                      value={option.text}
                      onChange={(e) => {
                        const updated = [...editingQuestion.options];
                        updated[idx].text = e.target.value;

                        setEditingQuestion({
                          ...editingQuestion,
                          options: updated,
                        });
                      }}
                      className="flex-1 bg-transparent text-gray-200 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-5 py-2 rounded-lg border border-blue-700/60
                             text-gray-300 hover:bg-blue-900/40"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg
                             bg-blue-600 hover:bg-blue-700
                             text-white shadow-lg shadow-blue-500/30"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
