"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/hero";
import AnimatedSection from "@/components/animated-section";
import NumberTicker from "@/components/number-ticker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StartInterviewModal from "@/components/modals/startInterview";
import { useRouter } from "next/navigation";

const PRIMARY_BUTTON_BG = "bg-blue-600";
const PRIMARY_BUTTON_TEXT = "text-white";
const PRIMARY_BUTTON_HOVER_BG = "hover:bg-blue-700";

const TEXT_GRADIENT = "from-blue-200 to-sky-400";
const ACCENT_COLOR = "text-sky-400";
const ACCENT_BG = "bg-gradient-to-br from-blue-950/70 to-blue-900/50";

export default function HomePageClient() {
  const router = useRouter();
  const [isStartInterviewModalOpen, setIsStartInterviewModalOpen] =
    useState(false);

  return (
    <main className="min-h-screen text-white">
      <div className="h-10" aria-hidden />

      <section className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <Hero />
        <motion.div
          className="mt-10 flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              onClick={() => setIsStartInterviewModalOpen(true)}
              className={`rounded-lg ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_TEXT} px-8 py-3 text-sm font-bold shadow-lg shadow-blue-500/30 ${PRIMARY_BUTTON_HOVER_BG} transition-all duration-300 transform hover:-translate-y-1`}
            >
              Start Practicing {"->"}
            </Button>
            <Link
              href="/roadmap-chat"
              className="rounded-lg border border-sky-500/70 bg-transparent px-8 py-3 text-sm font-medium text-sky-300 transition-all duration-300 hover:bg-blue-800/30 hover:text-white hover:shadow-sky-500/20"
            >
              Explore Features
            </Link>
          </div>
        </motion.div>
      </section>

      <AnimatedSection>
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { value: 1200, suffix: "+", label: "Interviews Practiced" },
              { value: 97, suffix: "%", label: "Improvement Rate" },
              { value: 24, suffix: "/7", label: "AI Availability" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-sky-700/60 bg-gradient-to-br from-blue-900/40 to-blue-950/30 p-6 shadow-xl shadow-sky-900/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className={`mb-2 text-5xl font-bold ${ACCENT_COLOR}`}>
                  <NumberTicker value={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection  className="border-t border-sky-800/40">
        <section className="container mx-auto px-4 py-24 text-center">
          <h2
            className={`mb-4 bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-4xl font-extrabold text-transparent`}
          >
            Why HireMind?
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-300">
            Practice smarter with HireMind, the AI interview platform built to
            help candidates prepare for technical, HR, and role-specific
            interviews with realistic simulations and actionable feedback.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Mock Interviews",
                desc: "Simulate real interviews with adaptive AI that responds to your tone and expressions.",
                icon: "🤖",
              },
              {
                title: "Facial Expression Tracking",
                desc: "Track confidence, focus, and engagement through real-time video analytics.",
                icon: "🎥",
              },
              {
                title: "Personalized Reports",
                desc: "Receive instant, detailed insights and improvement recommendations.",
                icon: "📊",
              },
              {
                title: "Custom Interview Creation",
                desc: "Build interviews tailored to your resume, field, and experience level.",
                icon: "🧠",
              },
              {
                title: "Performance Dashboard",
                desc: "Track your growth with weekly analytics and comparison charts.",
                icon: "📈",
              },
              {
                title: "Seamless Experience",
                desc: "Enjoy smooth interaction, built for speed and precision using Next.js and AI APIs.",
                icon: "⚡",
              },
              {
                title: "AI Roadmap Generation",
                desc: "Get a personalized learning roadmap based on your role, skill level, and career goals — step-by-step.",
                icon: "🗺️",
              },
              {
                title: "Resume Analysis",
                desc: "Upload your resume and get AI-powered feedback, ATS optimization tips, and improvements to stand out.",
                icon: "📄",
              },
              {
                title: "Find Jobs Instantly",
                desc: "Discover fresh job openings matched to your skills and target role — updated regularly for faster applications.",
                icon: "💼",
              },

            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`rounded-xl border border-blue-700/60 ${ACCENT_BG} p-8 shadow-2xl shadow-blue-800/30 hover:shadow-sky-500/40 transition-all duration-500 backdrop-blur-sm transform hover:-translate-y-2`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.7 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection className="border-t border-sky-800/40">
        <section className="container mx-auto px-4 py-24">
          <h2
            className={`mb-4 bg-gradient-to-r ${TEXT_GRADIENT} bg-clip-text text-center text-4xl font-extrabold text-transparent`}
          >
            How HireMind Works
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-300">
            HireMind turns interview preparation into measurable growth, from
            interview setup to AI-driven feedback and progress tracking.
          </p>

          <div className="grid gap-10 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Create Interview",
                desc: "Head to the create interview page and set your goals.",
                link: "/create-interview",
              },
              {
                step: "2",
                title: "Face the AI",
                desc: "Respond to AI-generated questions with live camera feedback.",
              },
              {
                step: "3",
                title: "Analyze Results",
                desc: "Review insights on confidence, clarity, and consistency.",
              },
              {
                step: "4",
                title: "Track Progress",
                desc: "Compare past reports and unlock personalized coaching.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-blue-700/60 bg-gradient-to-br from-blue-900/30 to-blue-950/20 p-6 text-center shadow-lg shadow-blue-900/20 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:from-blue-800/40 hover:to-blue-900/30"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <div className={`mb-3 text-2xl font-bold ${ACCENT_COLOR}`}>
                  Step {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="mb-2 text-sm text-gray-400">{item.desc}</p>
                {item.link && (
                  <Link
                    href={item.link}
                    className={`${ACCENT_COLOR} text-sm hover:underline`}
                  >
                    Try Now {"->"}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection className="border-t border-sky-800/40 bg-gradient-to-b from-blue-900/20 to-transparent">
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to face your next interview with confidence?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Start practicing with HireMind today and turn interview preparation
            into stronger performance.
          </p>
          <Link
            href="/create-interview"
            className={`inline-flex items-center gap-2 rounded-lg ${PRIMARY_BUTTON_BG} ${PRIMARY_BUTTON_TEXT} px-8 py-3 text-sm font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 ${PRIMARY_BUTTON_HOVER_BG}`}
          >
            Start Interview Practice {"->"}
          </Link>
        </section>
      </AnimatedSection>

      <AnimatedSection className="px-4 py-20">
        <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-sky-800/40 bg-gradient-to-br from-slate-950 via-blue-950/70 to-slate-900 shadow-[0_30px_120px_rgba(2,132,199,0.12)]">
          <div className="grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.25fr_0.95fr] lg:gap-14">
            <div className="text-left text-gray-300">
              <div className="mb-5 inline-flex rounded-full border border-sky-500/30 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
                Built for interview growth
              </div>

              <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
                HireMind turns AI mock interview practice into clear,
                repeatable progress.
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                HireMind, also searched as HireMind AI, helps students,
                developers, and job seekers prepare for real technical and HR
                interviews with an AI interviewer, instant performance feedback,
                and detailed practice reports.
              </p>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
                Use HireMind to practice frontend, backend, system design, and
                behavioral interviews anytime, improve how you communicate under
                pressure, and build confidence before your next real interview.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Realistic practice",
                    description:
                      "Prepare with AI-generated interview flows that feel closer to actual rounds.",
                  },
                  {
                    title: "Actionable feedback",
                    description:
                      "Review answer quality, confidence, and communication after each session.",
                  },
                  {
                    title: "Role-based prep",
                    description:
                      "Practice for technical, HR, and career-focused interview scenarios.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-sky-800/40 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[1.75rem] border border-sky-700/30 bg-gradient-to-br from-sky-500/10 via-blue-900/30 to-slate-950/80 p-6 shadow-inner shadow-sky-900/20">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Explore interview prep
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Choose the kind of interview practice you need most
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Jump into focused interview practice experiences for mock
                  interviews, AI-guided sessions, technical rounds, and HR
                  preparation.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                {[
                  { href: "/ai-mock-interview", label: "AI Mock Interview" },
                  { href: "/ai-interviewer", label: "AI Interviewer" },
                  {
                    href: "/ai-interview-practice",
                    label: "AI Interview Practice",
                  },
                  {
                    href: "/technical-interview-practice",
                    label: "Technical Interview Practice",
                  },
                  { href: "/hr-interview-practice", label: "HR Interview Practice" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-sky-600/50 bg-slate-950/50 px-4 py-2 text-sky-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-400/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-sky-800/40 bg-slate-950/50 p-5">
                <p className="text-sm font-medium text-sky-200">
                  Start where you want to improve
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Whether you want better mock interview practice, stronger
                  technical answers, or more confident HR responses, HireMind
                  gives you a focused place to begin.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <StartInterviewModal
        isOpen={isStartInterviewModalOpen}
        onClose={() => setIsStartInterviewModalOpen(false)}
        onStartBasic={() => {
          setIsStartInterviewModalOpen(false);
          router.push("/create-interview?type=basic");
        }}
        onStartAdvanced={() => {
          setIsStartInterviewModalOpen(false);
          router.push("/create-interview?type=advanced");
        }}
      />
    </main>
  );
}
