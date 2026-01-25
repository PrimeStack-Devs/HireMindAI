"use client";

import { useState, useEffect, useRef } from "react";
import VideoPreview from "@/components/video-preview";
import InterviewChatPane from "@/components/interview-chat-pane";
import InterviewControls from "@/components/interview-controls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStrapi } from "@/lib/api/useStrapi";
import { useChat } from "./useChat";
import { useMurfTTS } from "./useMurfTTS";
import toast from "react-hot-toast";
import { strapi } from "@/lib/api/sdk";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { useElevenLabsTTS } from "./useElevenLabsTTS";

type Message = { role: "assistant" | "user"; content: string };

export default function InterviewPage({ params }: { params: { id: string } }) {
  const tabViolationCountRef = useRef(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [startAnalyticts, setStartAnalyticts] = useState<any>(null);
  const [stopAnalyticts, setStopAnalyticts] = useState<any>(null);

  const [showStartModal, setShowStartModal] = useState(true);

  // ✅ mute state
  // const [isChatLoading, setIsChatLoading] = useState(false);
  const [muted, setMuted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();


  const { generateSpeech, terminateAudio } = useElevenLabsTTS({
    onStart: () => setAiSpeaking(true),
    onEnd: () => setAiSpeaking(false),
  });

  const {
    // generateSpeech,
    stop,
    unlockPlayback,
    isPlaying,
    setIsLoading: setIsSpeechLoading,
    isLoading: isSpeechLoading,
  } = useMurfTTS({ voiceId: "en-US-natalie" });

  // ✅ FIX: stop audio on route change
  useEffect(() => {
    stop();
    setAiSpeaking(false);
    setIsSpeechLoading(false);
  }, [pathname]);

  // ✅ FIX: stop audio when page unmounts
  useEffect(() => {
    return () => {
      stop();
      setAiSpeaking(false);
      setIsSpeechLoading(false);
    };
  }, []);

  // ✅ Toggle mute handler
  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (next) {
       terminateAudio();
        stop();
        setAiSpeaking(false);
        setIsSpeechLoading(false);
      } else {
        // Unmuting => unlock playback again
        unlockPlayback();
      }

      return next;
    });
  };

const { sendMessage, isLoading: isChatLoading } = useChat({
  messages,
  setMessages,
  setAiSpeaking,
  setIsInterviewCompleted,
  generateSpeech: muted ? async () => { } : generateSpeech,
  terminateAudio, // ✅ ADD THIS
});



  const { data, isLoading } = useStrapi("interviews", {
    populate: "*",
    filters: { documentId: params.id },
  });

  const interviewData: any = data?.data;

  const interviewDetails = {
    topic: interviewData?.[0]?.details || "",
    difficulty: interviewData?.[0]?.difficulty || "medium",
    mode: interviewData?.[0]?.mode || "text",
    numOfQuestions: interviewData?.[0]?.numberOfQuestions,
    skills: interviewData?.[0]?.skills || "",
    username: interviewData?.[0]?.candidateName || "",
  };

  const resumeUrl = interviewData?.[0]?.resume || "";

  // Initial greeting
  const initialGreetings = async () => {
    try {
      const content = [
        ...(resumeUrl
          ? [{ type: "image_url", image_url: { url: resumeUrl } }]
          : []),
        {
          type: "text",
          text: interviewDetails.username
            ? "Hello I am " + interviewDetails.username
            : "",
        },
      ];

      await sendMessage({ content, interviewDetails });
    } catch (error) {
      console.log("Initial greeting failed", error);
    }
  };

  // ✅ Tab switch detection
  useEffect(() => {
    if (showStartModal || isInterviewCompleted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabViolationCountRef.current += 1;

        if (tabViolationCountRef.current === 1) {
          toast.error("Do not switch tabs during the interview.");
        } else {
          handleInterviewTermination(
            "Interview terminated due to tab switching."
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showStartModal, isInterviewCompleted]);

  const startInterview = () => {
    unlockPlayback();
    initialGreetings();
    setShowStartModal(false);

    if (startAnalyticts) startAnalyticts();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col gap-8 items-center w-full h-[80vh]">
        <div>Loading interview...</div>
      </div>
    );
  }

  const handleInterviewTermination = async (reason?: string) => {
    terminateAudio();
    if (isInterviewCompleted) return;
    if (reason) toast.error(reason);

    setIsInterviewCompleted(true);
    setShowStartModal(false);

    stop();
    setAiSpeaking(false);
    setIsSpeechLoading(false);

    if (stopAnalyticts && typeof stopAnalyticts === "function") {
      try {
        stopAnalyticts();
      } catch { }
    }

    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      let feed = "";
      if (stopAnalyticts) {
        feed = stopAnalyticts();
      }

      await strapi.update("interviews", params.id, {
        conversation: messages,
      });

      const res = await fetch("/api/interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          interviewDetails,
          faceMeshFeedback: feed,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate report");

      const report = await res.json();

      if (report) {
        await strapi.update("interviews", params.id, {
          report: JSON.stringify(report),
        });
      }

      toast.success("Report generated!");
      router.push("/reports");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <main className="grid min-h-[80vh] grid-rows-[auto_1fr] relative">
      {/* Start Modal */}
      {showStartModal && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-2xl text-white">
          <h1 className="text-4xl font-bold animate-pulse mb-4">
            Start Interview
          </h1>
          <Button onClick={startInterview} className="px-6 py-3">
            Click to Start
          </Button>
        </div>
      )}

      <div className="h-10" aria-hidden />

      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Interview Session</h1>
          <div className="text-sm text-muted-foreground">ID: {params.id}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-15">
        {/* Left Video */}
        <section className="order-2 md:order-1 md:col-span-8">
          <Card className="m-4 h-[calc(100vh-120px)] overflow-hidden p-0 md:m-6">
            {!isInterviewCompleted ? (
              <VideoPreview
                startFn={setStartAnalyticts}
                stopFn={setStopAnalyticts}
                onTerminate={handleInterviewTermination}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <h2 className="mb-4 text-2xl font-bold">Interview Terminated</h2>
              </div>
            )}
          </Card>
        </section>

        {/* Right Chat */}
        <aside className="order-1 md:order-2 md:col-span-7">
          <div className="m-4 flex h-[calc(100vh-120px)] flex-col gap-4 md:m-6">
            <Card className="flex-1 overflow-hidden relative">
              {/* ✅ Custom Mute Button */}

              {!showStartModal &&
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute AI" : "Mute AI"}
                  title={muted ? "Unmute AI" : "Mute AI"}
                  disabled={isInterviewCompleted}
                  className={`absolute right-3 top-3 z-10 flex items-center justify-center rounded-full transition
                w-9 h-9
                ${isInterviewCompleted
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-80 hover:opacity-100"
                    }
                  ${muted
                      ? "bg-red-500 text-white"
                      : "bg-black/40 text-white border border-white/20"
                    }
                    `}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              }

              <InterviewChatPane
                messages={messages}
               isSpeechLoading={isChatLoading}

                setMessages={setMessages}
                mode={interviewData?.[0]?.mode }
              />
            </Card>

            <Card className="p-4 flex items-center justify-center">
              {!isInterviewCompleted ? (
                <InterviewControls
                  aiSpeaking={ aiSpeaking}
                  mode={mode}
                  listening={listening}
                  text={text}
                  setMode={setMode}
                  setListening={setListening}
                  setText={setText}
                  terminateAudio={terminateAudio}
                  handleSend={async (c) => {
                    await sendMessage({ content: c, interviewDetails });

                    // if (!muted) setIsSpeechLoading(true);

                    setText("");
                  }}
                />
              ) : (
                <Button
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    "Generate Interview Report"
                  )}
                </Button>
              )}
            </Card>
          </div>
        </aside>
      </div>
    </main>
  );
}
