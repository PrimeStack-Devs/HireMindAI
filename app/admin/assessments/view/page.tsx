'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Edit, CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/* ===== THEME CONSTANTS ===== */
const TEXT_GRADIENT = 'from-blue-200 to-sky-400';
const ACCENT_BG =
  'bg-gradient-to-br from-blue-950/70 to-blue-900/50 border border-blue-700/60';

/* ===== MOCK DATA ===== */
const initialAssessment = {
  name: 'Frontend Developer Assessment',
  totalQuestions: 3,
  totalMarks: 30,
  status: 'Draft',
  questions: [
    {
      id: 1,
      text: 'What is React?',
      marks: 10,
      options: [
        { text: 'A JavaScript library for building UI', correct: true },
        { text: 'A database', correct: false },
        { text: 'A backend framework', correct: false },
        { text: 'A CSS library', correct: false },
      ],
    },
    {
      id: 2,
      text: 'Which hook is used for state management?',
      marks: 10,
      options: [
        { text: 'useEffect', correct: false },
        { text: 'useState', correct: true },
        { text: 'useMemo', correct: false },
        { text: 'useRef', correct: false },
      ],
    },
    {
      id: 3,
      text: 'What does JSX stand for?',
      marks: 10,
      options: [
        { text: 'Java Syntax Extension', correct: false },
        { text: 'JavaScript XML', correct: true },
        { text: 'JSON XML', correct: false },
        { text: 'Java Source X', correct: false },
      ],
    },
  ],
};

export default function AssessmentDetailPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState(initialAssessment);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  const handleSave = () => {
    const updatedQuestions = assessment.questions.map((q) =>
      q.id === editingQuestion.id ? editingQuestion : q
    );

    setAssessment({
      ...assessment,
      questions: updatedQuestions,
    });

    setEditingQuestion(null);
  };

  return (
    <main className="min-h-screen text-white px-6 py-10 relative">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Assessment Name</p>
            <p className="font-semibold">{assessment.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Questions</p>
            <p className="font-semibold">{assessment.questions.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Marks</p>
            <p className="font-semibold">{assessment.totalMarks}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/40">
              {assessment.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* QUESTIONS */}
      <div className="space-y-8">
        {assessment.questions.map((question, index) => (
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
                  Q{index + 1}. {question.text}
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
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    option.correct
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-blue-700/40 bg-blue-950/40'
                  }`}
                >
                  {option.correct && (
                    <CheckCircle className="text-green-400" size={18} />
                  )}
                  <span
                    className={`text-sm ${
                      option.correct ? 'text-green-300' : 'text-gray-300'
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
                  value={editingQuestion.text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      text: e.target.value,
                    })
                  }
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

                {editingQuestion.options.map((option: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl
                               border border-blue-700/40 bg-blue-950/40"
                  >
                    <input
                      type="radio"
                      checked={option.correct}
                      onChange={() => {
                        const updated = editingQuestion.options.map(
                          (opt: any, i: number) => ({
                            ...opt,
                            correct: i === idx,
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
