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

function toCommaList(raw: string) {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function buildAdvancedConfig(payload: {
  jobRole: string;
  seniority: string;
  yearsExperience: string;
  interviewObjective: string;
  roundType: string;
  answerStyle: string;
  durationMinutes: string;
  jobDescription: string;
  candidateBackground: string;
  companyContext: string;
  mustCoverTopics: string;
  avoidTopics: string;
  evaluationFocus: string;
  scoringRubric: string;
  redFlags: string;
  followUpDepth: string;
  strictness: string;
  interviewerPersona: string;
  conversationTone: string;
  language: string;
  industryDomain: string;
}) {
  return `__ADVANCED_CONFIG__${JSON.stringify(payload)}`;
}

export default function AdvancedInterviewForm() {
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [seniority, setSeniority] = useState("Senior");
  const [yearsExperience, setYearsExperience] = useState("");
  const [interviewObjective, setInterviewObjective] = useState("Screening");
  const [jobDescription, setJobDescription] = useState("");
  const [candidateBackground, setCandidateBackground] = useState("");
  const [companyContext, setCompanyContext] = useState("");
  const [mustCoverTopics, setMustCoverTopics] = useState("");
  const [avoidTopics, setAvoidTopics] = useState("");
  const [interviewMode, setInterviewMode] = useState("Technical");
  const [roundType, setRoundType] = useState("Technical Screening");
  const [difficulty, setDifficulty] = useState("hard");
  const [questions, setQuestions] = useState("10");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [answerStyle, setAnswerStyle] = useState("Deep Dive");
  const [evaluationFocus, setEvaluationFocus] = useState("");
  const [scoringRubric, setScoringRubric] = useState("");
  const [redFlags, setRedFlags] = useState("");
  const [followUpDepth, setFollowUpDepth] = useState("high");
  const [strictness, setStrictness] = useState("balanced");
  const [interviewerPersona, setInterviewerPersona] = useState(
    "Senior Engineering Manager"
  );
  const [conversationTone, setConversationTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [industryDomain, setIndustryDomain] = useState("");
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
      if (aiData.candidateName) {
        setCandidateName(aiData.candidateName);
      }
      if (aiData.topic && !jobRole) {
        setJobRole(aiData.topic);
      }
      if (aiData.skills && !mustCoverTopics) {
        setMustCoverTopics(aiData.skills);
      }

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
      if (!jobRole.trim()) {
        toast.error("Please provide job role");
        return false;
      }
      if (!yearsExperience.trim()) {
        toast.error("Please provide years of experience");
        return false;
      }
      if (!interviewObjective.trim()) {
        toast.error("Please provide interview objective");
        return false;
      }
    }

    if (step === 3) {
      if (!jobDescription.trim()) {
        toast.error("Please provide job description");
        return false;
      }
      if (!mustCoverTopics.trim()) {
        toast.error("Please provide must-cover topics");
        return false;
      }
    }

    if (step === 4) {
      if (!interviewMode) {
        toast.error("Please select interview mode");
        return false;
      }
      if (!roundType.trim()) {
        toast.error("Please provide round type");
        return false;
      }
      if (!difficulty) {
        toast.error("Please select difficulty");
        return false;
      }
      if (!questions || Number(questions) <= 0) {
        toast.error("Please select number of questions");
        return false;
      }
    }

    if (step === 5) {
      if (!evaluationFocus.trim()) {
        toast.error("Please provide evaluation focus");
        return false;
      }
      if (!interviewerPersona.trim()) {
        toast.error("Please provide interviewer persona");
        return false;
      }
    }

    return true;
  };

  const handleSubmitFinal = async () => {
    try {
      setLoadingStage("create");

      if (!candidateName.trim()) {
        toast.error("Please provide candidate name");
        return;
      }
      if (!data?.user) {
        toast.error("You must be logged in");
        return;
      }
      if (!jobRole.trim()) {
        toast.error("Please provide job role");
        return;
      }
      if (!jobDescription.trim()) {
        toast.error("Please provide job description");
        return;
      }

      const advancedPayload = {
        jobRole,
        seniority,
        yearsExperience,
        interviewObjective,
        roundType,
        answerStyle,
        durationMinutes,
        jobDescription,
        candidateBackground,
        companyContext,
        mustCoverTopics,
        avoidTopics,
        evaluationFocus,
        scoringRubric,
        redFlags,
        followUpDepth,
        strictness,
        interviewerPersona,
        conversationTone,
        language,
        industryDomain,
      };

      const advancedConfig = buildAdvancedConfig(advancedPayload);

      const res = await strapi.create("interviews", {
        resume: resumeUrl || null,
        mode: interviewMode,
        difficulty,
        skills: toCommaList(mustCoverTopics),
        jobDesc: advancedConfig,
        details: jobRole,
        numberOfQuestions: parseInt(questions, 10),
        user: data?.user?.id,
        candidateName,
      });

      toast.success("Advanced interview created");
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
            className="w-full max-w-4xl mx-auto border-white"
        >
          <Step>
            <div className={CardClasses}>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Advanced Interview Setup <Sparkles className="inline-block" />
              </h2>
              <p className="text-white/80 text-center leading-relaxed">
                This flow is for role-specific interviews driven by job description,
                interview intent, evaluation criteria, and interviewer persona.
              </p>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 2: Interview Goal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Candidate Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate name"
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Job Role</label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Senior Backend Developer"
                    className={InputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Seniority</label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="Junior">
                      Junior
                    </option>
                    <option className="text-black" value="Mid">
                      Mid
                    </option>
                    <option className="text-black" value="Senior">
                      Senior
                    </option>
                    <option className="text-black" value="Lead">
                      Lead
                    </option>
                  </select>
                </div>
                <div>
                  <label className={LabelClasses}>Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="5"
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Interview Objective</label>
                  <select
                    value={interviewObjective}
                    onChange={(e) => setInterviewObjective(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="Screening">
                      Screening
                    </option>
                    <option className="text-black" value="Final Round">
                      Final Round
                    </option>
                    <option className="text-black" value="Leadership">
                      Leadership
                    </option>
                    <option className="text-black" value="System Design">
                      System Design
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className={LabelClasses}>Industry Domain (Optional)</label>
                <input
                  type="text"
                  value={industryDomain}
                  onChange={(e) => setIndustryDomain(e.target.value)}
                  placeholder="SaaS, Fintech, E-commerce"
                  className={InputClasses}
                />
              </div>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 3: Context Source
              </h2>

              <ResumeUploadField
                label="Upload Resume (Optional, AI Autofill)"
                resume={resume}
                onChange={handleFileChange}
              />

              <div className="mb-6">
                <label className={LabelClasses}>Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className={InputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Must Cover Topics</label>
                  <textarea
                    value={mustCoverTopics}
                    onChange={(e) => setMustCoverTopics(e.target.value)}
                    placeholder="System design, microservices, PostgreSQL, AWS"
                    rows={4}
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Avoid Topics (Optional)</label>
                  <textarea
                    value={avoidTopics}
                    onChange={(e) => setAvoidTopics(e.target.value)}
                    placeholder="DSA heavy questions, culture fit"
                    rows={4}
                    className={InputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={LabelClasses}>Candidate Background (Optional)</label>
                  <textarea
                    value={candidateBackground}
                    onChange={(e) => setCandidateBackground(e.target.value)}
                    placeholder="Short candidate summary, past stack, project scope"
                    rows={4}
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Company Context (Optional)</label>
                  <textarea
                    value={companyContext}
                    onChange={(e) => setCompanyContext(e.target.value)}
                    placeholder="Startup stage, product area, traffic scale, team size"
                    rows={4}
                    className={InputClasses}
                  />
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 4: Interview Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Interview Mode</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="Technical">
                      Technical
                    </option>
                    <option className="text-black" value="HR">
                      HR / Behavioral
                    </option>
                    <option className="text-black" value="Coding">
                      Coding
                    </option>
                  </select>
                </div>
                <div>
                  <label className={LabelClasses}>Round Type</label>
                  <input
                    type="text"
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    placeholder="Technical Screening"
                    className={InputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
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
                <div>
                  <label className={LabelClasses}>Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="30"
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Answer Style</label>
                  <select
                    value={answerStyle}
                    onChange={(e) => setAnswerStyle(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="Concise">
                      Concise
                    </option>
                    <option className="text-black" value="Open Ended">
                      Open Ended
                    </option>
                    <option className="text-black" value="Deep Dive">
                      Deep Dive
                    </option>
                    <option className="text-black" value="MCQ">
                      MCQ
                    </option>
                  </select>
                </div>
              </div>

              <QuestionCountField
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
          </Step>

          <Step>
            <div className={CardClasses}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Step 5: Evaluation And Persona
              </h2>

              <div className="mb-6">
                <label className={LabelClasses}>Evaluation Focus</label>
                <textarea
                  value={evaluationFocus}
                  onChange={(e) => setEvaluationFocus(e.target.value)}
                  placeholder="Problem solving, architecture, debugging, communication"
                  rows={3}
                  className={InputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Scoring Rubric (Optional)</label>
                  <textarea
                    value={scoringRubric}
                    onChange={(e) => setScoringRubric(e.target.value)}
                    placeholder="What defines a strong answer?"
                    rows={3}
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Red Flags (Optional)</label>
                  <textarea
                    value={redFlags}
                    onChange={(e) => setRedFlags(e.target.value)}
                    placeholder="Weak reasoning, shallow tradeoffs, vague debugging"
                    rows={3}
                    className={InputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={LabelClasses}>Follow Up Depth</label>
                  <select
                    value={followUpDepth}
                    onChange={(e) => setFollowUpDepth(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="low">
                      Low
                    </option>
                    <option className="text-black" value="medium">
                      Medium
                    </option>
                    <option className="text-black" value="high">
                      High
                    </option>
                  </select>
                </div>
                <div>
                  <label className={LabelClasses}>Strictness</label>
                  <select
                    value={strictness}
                    onChange={(e) => setStrictness(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="lenient">
                      Lenient
                    </option>
                    <option className="text-black" value="balanced">
                      Balanced
                    </option>
                    <option className="text-black" value="strict">
                      Strict
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className={LabelClasses}>Interviewer Persona</label>
                  <input
                    type="text"
                    value={interviewerPersona}
                    onChange={(e) => setInterviewerPersona(e.target.value)}
                    placeholder="Senior Engineering Manager"
                    className={InputClasses}
                  />
                </div>
                <div>
                  <label className={LabelClasses}>Conversation Tone</label>
                  <select
                    value={conversationTone}
                    onChange={(e) => setConversationTone(e.target.value)}
                    className={SelectClasses}
                  >
                    <option className="text-black" value="Professional">
                      Professional
                    </option>
                    <option className="text-black" value="Friendly">
                      Friendly
                    </option>
                    <option className="text-black" value="Strict">
                      Strict
                    </option>
                  </select>
                </div>
                <div>
                  <label className={LabelClasses}>Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English"
                    className={InputClasses}
                  />
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <div className={`${CardClasses} text-center`}>
              <h2 className="text-2xl font-bold text-white mb-4">Final Step</h2>
              <p className="text-white/80">
                This advanced flow uses a dedicated form model. Click{" "}
                <strong>Complete</strong> to create an interview with the richer
                context you configured.
              </p>
            </div>
          </Step>
        </Stepper>
      )}
    </div>
  );
}
