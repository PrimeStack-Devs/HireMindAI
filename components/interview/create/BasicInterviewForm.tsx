"use client";

import Stepper, { Step } from "@/components/ui/stepper";
import { strapi } from "@/lib/api/sdk";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadAndExtractResume } from "./resume-utils";
import {
  CardClasses,
  InputClasses,
  InterviewLoadingScreen,
  LabelClasses,
  LoadingStage,
  QuestionCountField,
  ResumeUploadField,
  SelectClasses,
} from "./shared";

function normalizeSkills(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",");
}

export default function BasicInterviewForm() {
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [mode, setMode] = useState("Technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [skills, setSkills] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState("10");
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("idle");

  const { data } = useSession<any>();
  const session = useSession();
  const username = session?.data?.user?.username?.slice(0, -4);
  const router = useRouter();

  useEffect(() => {
    if (username) {
      setCandidateName(username);
    }
  }, [username]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResume(file);
    setLoadingStage("upload");

    try {
      const { aiData, resumeUrl: uploadedResumeUrl, uploadedType } =
        await uploadAndExtractResume(file);

      setResumeUrl(uploadedResumeUrl);
      toast.success(
        uploadedType === "pdf"
          ? "PDF uploaded and converted to image"
          : "Resume uploaded successfully"
      );

      setLoadingStage("parse");
      setCandidateName(aiData.candidateName || candidateName);
      setSkills(aiData.skills || "");
      setTopic(aiData.topic || "");
      setDifficulty(aiData.difficulty || "medium");
      setMode(aiData.mode || "Technical");

      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Error uploading or parsing resume"
      );
    } finally {
      setLoadingStage("idle");
    }
  };

  const validateStep = (step: number) => {
    if (step === 2) {
      if (!candidateName.trim()) {
        toast.error("Please provide candidate name");
        return false;
      }
      if (!mode) {
        toast.error("Please select interview mode");
        return false;
      }
      if (!difficulty) {
        toast.error("Please select interview difficulty");
        return false;
      }
    }

    if (step === 3) {
      if (!skills.trim()) {
        toast.error("Please provide key skills");
        return false;
      }
      if (!topic.trim()) {
        toast.error("Please provide job role");
        return false;
      }
    }

    if (step === 4 && (!questions || Number(questions) <= 0)) {
      toast.error("Please select number of questions");
      return false;
    }

    return true;
  };

  const handleSubmitFinal = async () => {
    try {
      setLoadingStage("create");
      const normalizedSkills = normalizeSkills(skills);

      if (!candidateName.trim()) {
        toast.error("Please provide candidate name");
        return;
      }
      if (!data?.user) {
        toast.error("You must be logged in");
        return;
      }
      if (!normalizedSkills) {
        toast.error("Please provide key skills");
        return;
      }
      if (!topic.trim()) {
        toast.error("Please provide job role");
        return;
      }

      const res = await strapi.create("interviews", {
        resume: resumeUrl || null,
        mode,
        difficulty,
        skills: normalizedSkills,
        details: topic,
        numberOfQuestions: parseInt(questions, 10),
        user: data?.user?.id,
        candidateName,
      });

      toast.success("Interview Created Successfully");
      setLoading(true);
      router.push(`/interview/${res.data.documentId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingStage("idle");
    }
  };

  if (loadingStage !== "idle") {
    return <InterviewLoadingScreen stage={loadingStage} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 bg-transparent text-white">
      {loading ? (
        <div className="w-4 h-4 border-r-2 border-r-white rounded-full animate-spin" />
      ) : (
        <Stepper
          onFinalStepCompleted={handleSubmitFinal}
          canProceed={validateStep}
          disableStepIndicators
          backButtonText="Back"
          nextButtonText="Continue"
          className="w-full max-w-3xl mx-auto"
        >
          <Step>
            <div className={CardClasses}>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Welcome to Your AI Interview <Sparkles className="inline-block" />
              </h2>
              <p className="text-white/80 text-center leading-relaxed">
                This is the basic setup flow. Configure resume, mode, skills, and
                target role for a standard personalized interview.
              </p>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 2: Core Setup
              </h2>

              <ResumeUploadField
                label="Upload Resume (Optional, AI Autofill)"
                resume={resume}
                onChange={handleFileChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LabelClasses}>Interview Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="HR">
                      HR / Behavioral
                    </option>
                    <option className="text-black" value="Technical">
                      Technical
                    </option>
                    <option className="text-black" value="Coding">
                      Coding
                    </option>
                  </select>
                </div>

                <div>
                  <label className={LabelClasses}>Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="easy">
                      Easy
                    </option>
                    <option className="text-black" value="medium">
                      Medium
                    </option>
                    <option className="text-black" value="hard">
                      Hard
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 3: Focus Area
              </h2>

              <div className="mb-6">
                <label className={LabelClasses}>Key Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Next.js, Tailwind CSS"
                  className={InputClasses}
                />
              </div>

              <div>
                <label className={LabelClasses}>Job Role / Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Frontend Web Developer"
                  className={InputClasses}
                />
              </div>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 4: Interview Length
              </h2>
              <QuestionCountField
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
          </Step>

          <Step>
            <div className={`${CardClasses} text-center`}>
              <h2 className="text-2xl font-bold text-white mb-4">Final Step</h2>
              <p className="text-white/80">
                You are all set. Click <strong>Complete</strong> to start your AI
                interview.
              </p>
            </div>
          </Step>
        </Stepper>
      )}
    </div>
  );
}
