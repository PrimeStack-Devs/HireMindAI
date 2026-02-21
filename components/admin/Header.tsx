'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  showCreateButton?: boolean;
}

const TEXT_GRADIENT = "from-blue-200 to-sky-400";
const ACCENT_BG =
  "bg-gradient-to-br from-blue-950/70 to-blue-900/50 border border-blue-700/60";
const ACCENT_COLOR = "text-sky-400";

export default function Header() {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

    
      <section className='w-full flex h-fit items-center justify-between'>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1
            className={`text-2xl md:text-4xl font-extrabold bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-transparent`}
          >
            Assessment Details
          </h1>
          <p className="text-gray-300 mt-2 ">
            Review and manage assessment questions and answers
          </p>
        </motion.div>
        <motion.button
          onClick={() => router.push('/admin/create-assessment')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 h-fit"
        >
          <Plus size={20} />
          Create Assessment
        </motion.button>
      </section>
    </>
  );
}
