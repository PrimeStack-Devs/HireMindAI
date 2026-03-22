"use client";

import { BriefcaseBusiness, MessageSquareText, Mic, X } from "lucide-react";
import { useEffect } from "react";

type StartInterviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartBasic: () => void;
  onStartAdvanced: () => void;
};

const modalStats = {
  basic: {
    difficulty: "Adaptive",
    format: "Resume + Skills",
  },
  advanced: {
    difficulty: "Company-Level",
    format: "JD Driven",
  },
};

export default function StartInterviewModal({
  isOpen,
  onClose,
  onStartBasic,
  onStartAdvanced,
}: StartInterviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition-all duration-300  ${isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="start-interview-title"
          className={`relative w-full max-w-4xl rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-950/85 p-5 text-white shadow-2xl shadow-black/50 backdrop-blur-xs transition-all duration-300 sm:p-7 ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
            }`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 rounded-md border border-white/15 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <h2 id="start-interview-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Start Your Interview
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            Pick your interview style and jump in. Fast setup, realistic flow, and feedback that helps you improve.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="rounded-xl flex flex-col justify-between border border-sky-400/25 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/60 hover:bg-sky-400/10">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sky-300">
                  <Mic className="h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Basic Interview</h3>
                </div>
                <p className="text-sm text-slate-300">
                  Start a personalized mock interview built from your resume, skills, and target role.
                </p>
                <p className="text-sm text-slate-300">Upload resume • Skill-focused prompts • Flexible difficulty</p>
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <MessageSquareText className="h-3.5 w-3.5 text-sky-300" />
                    Difficulty: {modalStats.basic.difficulty}
                  </p>
                  <p className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-sky-300" />
                    Format: {modalStats.basic.format}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onStartBasic}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Start Basic Interview
              </button>
            </section>

            <section className="rounded-xl flex flex-col justify-between border border-cyan-400/25 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-400/10">
              <div>
                <div className="mb-3 flex items-center gap-2 text-cyan-300">
                  <BriefcaseBusiness className="h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Advanced Interview (By Job Description)</h3>
                </div>
                <p className="text-sm text-slate-300">
                  Turn any job description into a role-specific interview that mirrors real company expectations.
                </p>
                <p className="text-sm text-slate-300">
                  Frontend Developer • Backend Engineer • Product Manager • Data Analyst
                </p>
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <MessageSquareText className="h-3.5 w-3.5 text-cyan-300" />
                    Difficulty: {modalStats.advanced.difficulty}
                  </p>
                  <p className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-cyan-300" />
                    Format: {modalStats.advanced.format}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onStartAdvanced}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Start Advanced Interview
              </button>
            </section>
          </div>

          {/* <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">What to expect</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>Smart prompts tailored to your profile or target role</li>
              <li>Real interview-style technical and behavioral scenarios</li>
              <li>Instant post-interview feedback with clear improvement tips</li>
              <li>Build communication, problem-solving, and interview confidence</li>
            </ul>
          </div> */}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
