"use client";

import TrueFocus from "@/components/TrueFocus";
import React from "react";

export type LoadingStage = "idle" | "upload" | "parse" | "create";

export const InputClasses =
  "p-3 w-full bg-white/10 text-white placeholder-white/70 rounded-lg border border-sky-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out shadow-sm backdrop-blur-md";

export const SelectClasses = `${InputClasses} text-black cursor-pointer`;
export const LabelClasses = "block font-semibold mb-2 text-white text-base";
export const CardClasses =
  "p-8 w-full max-w-3xl   mx-auto bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-400/20";
export const FileInputClasses =
  "w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-700/80 file:text-white hover:file:bg-sky-600/90";

export function InterviewLoadingScreen({
  stage,
}: {
  stage: Exclude<LoadingStage, "idle">;
}) {
  const text =
    stage === "upload"
      ? "Uploading Resume"
      : stage === "parse"
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

export function ResumeUploadField({
  label,
  resume,
  onChange,
}: {
  label: string;
  resume: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-6">
      <label className={LabelClasses}>{label}</label>
      <input
        type="file"
        onChange={onChange}
        accept="image/*,application/pdf,.pdf"
        className={FileInputClasses}
      />
      {resume && (
        <p className="mt-2 text-sm text-white/70">Selected: {resume.name}</p>
      )}
    </div>
  );
}

export function QuestionCountField({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <>
      <label className={LabelClasses}>Number of Questions</label>
      <select value={value} onChange={onChange} className={SelectClasses}>
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
    </>
  );
}
