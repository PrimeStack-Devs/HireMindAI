"use client";

import { useEffect, useState } from "react";
import { QuestionBankForm } from "@/components/question-bank/question-bank-form";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useStrapi } from "@/lib/api/useStrapi";

const TEXT_GRADIENT = "from-blue-200 to-sky-400";
const ACCENT_BG =
  "bg-gradient-to-br from-blue-950/70 to-blue-900/50 border border-blue-700/60";
const ACCENT_COLOR = "text-sky-400";

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;


  
  const [assessmentData, setAssessmentData] = useState<any>(null);

  const { data, isLoading, error } = useStrapi("assessments", {
    populate:{questions:{populate:"*"}},
    where: { id: Number(id) },
  });
   
  // console.log('data',data?.data[0])
  

  useEffect(() => {
    if (data?.data?.length! > 0) {
      setAssessmentData(data?.data[0]);
     
    }
  }, [data]);

  // console.log('assesment',assessmentData)
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-300">
        Loading Assessment...
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      <section className="container mx-auto ">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1
            className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-transparent`}
          >
            Edit Assessment
          </h1>
          <p className="text-gray-300 mt-2">
            Update assessment details and questions
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className={`w-full mx-auto rounded-2xl p-8 md:p-10 shadow-2xl shadow-blue-900/40 backdrop-blur-sm ${ACCENT_BG}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${ACCENT_COLOR}`}>
              Assessment Management
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Modify existing questions or assessment settings
            </p>
          </div>


          <QuestionBankForm
            mode="edit"
            initialData={assessmentData}
            assessmentId={id}
          />
        </motion.div>
      </section>
    </main>
  );
}
