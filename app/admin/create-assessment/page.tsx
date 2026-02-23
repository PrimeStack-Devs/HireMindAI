"use client";

import { QuestionBankForm } from "@/components/question-bank/question-bank-form";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const TEXT_GRADIENT = "from-blue-200 to-sky-400";
const ACCENT_BG =
  "bg-gradient-to-br from-blue-950/70 to-blue-900/50 border border-blue-700/60";
const ACCENT_COLOR = "text-sky-400";

export default function Page() {
    const router = useRouter();
  return (
    <main className="min-h-screen text-white">
      

      <section className="container mx-auto ">
        {/* Header */}
          <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-4"
      >
        <ArrowLeft size={18} />
        Back
      </button>

       
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1
          className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-transparent`}
        >
          Create Assessment
        </h1>
        <p className="text-gray-300 mt-2">
          Create a new assessment and add questions
        </p>
      </motion.div>

        {/* Form Card */}
        <motion.div
          className={`max-w-5xl--- mx-auto rounded-2xl p-8 md:p-10 shadow-2xl shadow-blue-900/40 backdrop-blur-sm ${ACCENT_BG}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${ACCENT_COLOR}`}>
              Question Management
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Add questions manually or upload them in bulk using CSV
            </p>
          </div>

          <QuestionBankForm />
        </motion.div>
      </section>
    </main>
  );
}
