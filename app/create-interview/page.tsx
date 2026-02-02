"use client";

import TrueFocus from "@/components/TrueFocus";
import Stepper, { Step } from "@/components/ui/stepper";
import { strapi } from "@/lib/api/sdk";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Page() {
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [mode, setMode] = useState("Technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [skills, setSkills] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState("10");
  const [loadingStage, setLoadingStage] = useState<
    "idle" | "upload" | "parse" | "create"
  >("idle");

  const [initialStep, setInitialStep] = useState(1);

  const { data } = useSession<any>();
  const session = useSession();
  const username = session?.data?.user?.username.slice(0, -4);
  const router = useRouter();

  React.useEffect(() => {
    if (username) {
      setCandidateName(username);
    }
  }, [username]);

  // 🔹 Upload + AI extraction
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  if (!isImage && !isPdf) {
    toast.error("Only Image or PDF resume is allowed");
    return;
  }

  setResume(file);
  setLoadingStage("upload");

  try {
    const formData = new FormData();
    formData.append("image", file); // ✅ keep same key

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

  const json = await res.json();
const uploadedUrl = json.previewImageUrl || json.result;

if (!uploadedUrl) throw new Error("Upload failed");

setResumeUrl(json.previewImageUrl || json.result);// ✅ keep original stored url (pdf or image)

toast.success(
  json.type === "pdf"
    ? "PDF uploaded & converted to image ✅"
    : "Resume uploaded successfully ✅"
);

    // 🧠 AI parsing
    setLoadingStage("parse");

    const AI_RES = await fetch("/api/resume-extractor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: uploadedUrl },
              },
            ],
          },
        ],
      }),
    });

    // ✅ SAFETY: do not directly do AI_RES.json()
    const raw = await AI_RES.text();

    let aiData: any;
    try {
      aiData = JSON.parse(raw);
    } catch (e) {
      // console.log("Resume extractor raw response:", raw);
      toast.error("Resume analysis failed (invalid JSON response)");
      return;
    }

    if (aiData?.error) {
      // console.log("Resume extractor error:", aiData);
      toast.error(aiData.error);
      return;
    }

    // console.log("AI Resume Extraction:", aiData);

    setCandidateName(aiData.candidateName || "");
    setSkills(aiData.skills || "");
    setTopic(aiData.topic || "");
    setDifficulty(aiData.difficulty || "medium");
    setMode(aiData.mode || "Technical");
    setInitialStep(2);

    toast.success("Resume analyzed successfully");
  } catch (err) {
    console.error(err);
    toast.error("Error uploading or parsing resume");
  } finally {
    setLoadingStage("idle");
  }
};



  const handleSubmitFinal = async () => {
    try {
      setLoadingStage("create");

      if (!candidateName) return toast.error("Please provide candidate name");
      if (!data?.user) return toast.error("You must be logged in");
      if (!skills) return toast.error("Please provide skills");
      if (!topic) return toast.error("Please provide job role");

      const res = await strapi.create("interviews", {
        resume: resumeUrl || null,
        mode,
        difficulty,
        skills: skills.split(" ").join(","),
        details: topic,
        numberOfQuestions: parseInt(questions),
        user: data?.user?.id,
        candidateName,
      });

      toast.success("Interview Created Successfully");
      setLoading(true)
      router.push(`/interview/${res.data.documentId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingStage("idle");
    }
  };

  // --- STYLES ---
  const InputClasses = `p-3 w-full bg-white/10 text-white placeholder-white/70 rounded-lg border border-sky-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out shadow-sm backdrop-blur-md`;
  const SelectClasses = `${InputClasses} text-black cursor-pointer`;
  const LabelClasses = "block font-semibold mb-2 text-white text-base";
  const CardClasses =
    "p-8 w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-400/20";
  const FileInputClasses = `w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-700/80 file:text-white hover:file:bg-sky-600/90`;

  // --- LOADING STATES ---
  if (
    loadingStage === "upload" ||
    loadingStage === "parse" ||
    loadingStage === "create"
  ) {
    const text =
      loadingStage === "upload"
        ? "Uploading Resume"
        : loadingStage === "parse"
          ? "Analyzing Resume"
          : "Creating Interview";
    return (
      <div className="flex justify-center flex-col gap-8 items-center w-full h-[80vh]">
        <TrueFocus
          sentence={text}
          manualMode={false}
          blurAmount={5}
          borderColor="cyan"
          animationDuration={1}
          pauseBetweenAnimations={1}
        />
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 bg-transparent text-white">
     {loading?<div className="w-4 h-4 border-r-2 border-r-white rounded-full animate-spin"></div>:
      <Stepper
        initialStep={initialStep}
        onFinalStepCompleted={handleSubmitFinal}
        backButtonText="Back"
        nextButtonText="Continue"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1 */}
        <Step>
          <div className={CardClasses}>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Welcome to Your AI Interview <Sparkles className="inline-block" />
            </h2>
            <p className="text-white/80 text-center leading-relaxed">
              Let’s set up your personalized interview experience. Follow the
              steps to configure your skills, difficulty, and role for the best
              AI-generated mock interview.
            </p>
          </div>
        </Step>

        {/* Step 2 */}
        <Step>
          <div className={CardClasses}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Step 2: Core Setup 🛠️
            </h2>

            <div className="mb-6">
              <label className={LabelClasses}>
                Upload Resume ( Autofill with AI )
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf,.pdf"
                className={FileInputClasses}
              />
              {resume && (
                <p className="mt-2 text-sm text-white/70">
                  Selected: {resume.name}
                </p>
              )}
            </div>

            {/* <div className="mb-6">
              <label className={LabelClasses}>Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter candidate name"
                className={InputClasses}
              />
            </div> */}

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

        {/* Step 3 */}
        <Step>
          <div className={CardClasses}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Step 3: Focus Area 🎯
            </h2>

            <div className="mb-6">
              <label className={LabelClasses}>
                Key Skills (comma separated)
              </label>
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

        {/* Step 4 */}
        <Step>
          <div className={CardClasses}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Step 4: Interview Length ⏱️
            </h2>
            <label className={LabelClasses}>Number of Questions</label>
            <select
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className={SelectClasses}
            >
              <option className="text-black" value="2">
                2 Questions (Quick)
              </option>
              <option className="text-black" value="5">
                5 Questions
              </option>
              <option className="text-black" value="10">
                10 Questions (Standard)
              </option>
              <option className="text-black" value="15">
                15 Questions (Deep Dive)
              </option>
              <option className="text-black" value="20">
                20 Questions (Comprehensive)
              </option>
            </select>
          </div>
        </Step>

        {/* Final */}
        <Step>
          <div className={CardClasses + " text-center"}>
            <h2 className="text-2xl font-bold text-white mb-4">
              Final Step 🎉
            </h2>
            <p className="text-white/80">
              You’re all set! Click <strong>Complete</strong> to start your
              AI-powered interview simulation.
            </p>
          </div>
        </Step>
      </Stepper>}
    </div>
  );
}

export default Page;
