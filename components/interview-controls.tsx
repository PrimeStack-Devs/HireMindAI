"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AISpeakingBars from "./ai-speaking-bars";
import { motion } from "framer-motion";
import { Mic, MicOff, SendHorizonal, X } from "lucide-react";

export default function InterviewControls({
  aiSpeaking,
  mode,
  listening,
  text,
  setMode,
  setListening,
  setText,
  handleSend,
  terminateAudio,
}: {
  aiSpeaking: boolean;
  mode: "voice" | "text";
  listening: boolean;
  text: string;
  setMode: (mode: "voice" | "text") => void;
  setListening: (listening: boolean | ((prev: boolean) => boolean)) => void;
  setText: (text: string) => void;
  handleSend: (text: string) => void;
  terminateAudio: () => void;
}) {
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef<boolean>(false);
  const textRef = useRef<string>("");
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Base text typed or finalized prior to the active recognition burst
  const baseTextRef = useRef<string>("");
  // Accumulated finalized speech in current recognition session
  const sessionFinalRef = useRef<string>("");
  const manuallyStoppedRef = useRef<boolean>(true);
  const isStartingRef = useRef<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Autosize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // When in voice mode, automatically turn on mic once AI finishes speaking
  useEffect(() => {
    if (aiSpeaking) {
      setListening(false);
    } else if (mode === "voice") {
      const timer = setTimeout(() => {
        setListening(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [aiSpeaking, mode, setListening]);

  // Initialize SpeechRecognition once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language?.startsWith("en") ? "en-IN" : (navigator.language || "en-US");
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isStartingRef.current = false;
      setIsRecognizing(true);
    };

    recognition.onresult = (event: any) => {
      let currentSessionFinal = "";
      let currentSessionInterim = "";

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        const transcript = item[0]?.transcript || "";
        if (item.isFinal) {
          currentSessionFinal += transcript + " ";
        } else {
          currentSessionInterim += transcript + " ";
        }
      }

      sessionFinalRef.current = currentSessionFinal;

      const base = baseTextRef.current ? baseTextRef.current.trim() : "";
      const finalPart = currentSessionFinal.trim();
      const interimPart = currentSessionInterim.trim();

      const combined = [base, finalPart, interimPart]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ");

      setText(combined);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition notice:", event.error);
      isStartingRef.current = false;

      // Fatal permission or device errors
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        manuallyStoppedRef.current = true;
        setListening(false);
        setIsRecognizing(false);
      }
      // "no-speech" or "aborted" are normal pauses; onend will seamlessly restart if still listening
    };

    recognition.onend = () => {
      setIsRecognizing(false);
      isStartingRef.current = false;

      // Commit finalized text from this session to baseTextRef
      if (sessionFinalRef.current.trim()) {
        const base = baseTextRef.current ? baseTextRef.current.trim() : "";
        baseTextRef.current = [base, sessionFinalRef.current.trim()].filter(Boolean).join(" ");
        sessionFinalRef.current = "";
      }

      // Seamlessly keep listening if user didn't manually stop it
      if (listeningRef.current && !manuallyStoppedRef.current) {
        setTimeout(() => {
          if (listeningRef.current && !manuallyStoppedRef.current && !isStartingRef.current) {
            try {
              isStartingRef.current = true;
              recognition.start();
            } catch (err) {
              isStartingRef.current = false;
            }
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, [setListening, setText]);

  // Handle listening state toggle
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      manuallyStoppedRef.current = false;
      baseTextRef.current = textRef.current?.trim() || "";
      sessionFinalRef.current = "";

      if (!isStartingRef.current) {
        try {
          isStartingRef.current = true;
          recognition.start();
        } catch (e) {
          isStartingRef.current = false;
        }
      }
    } else {
      manuallyStoppedRef.current = true;
      setIsRecognizing(false);
      try {
        recognition.stop();
      } catch {}
    }
  }, [listening]);

  const handleClear = () => {
    setText("");
    baseTextRef.current = "";
    sessionFinalRef.current = "";
  };

  const submitAnswer = useCallback(() => {
    const trimmed = textRef.current.trim();
    if (!trimmed) return;
    terminateAudio();
    setListening(false);
    handleSend(trimmed);
    handleClear();
  }, [handleSend, setListening, terminateAudio]);

  return (
    <div className="w-full p-2">
      {aiSpeaking ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-muted">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              AI is responding...
            </span>
          </div>
          <AISpeakingBars />
        </div>
      ) : (
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            {listening ? (
              isRecognizing ? (
                <div className="w-full flex justify-baseline items-center">
                  <div className="mx-auto">
                    <div className="jarvis-container">
                      <div className="jarvis-ring"></div>
                      <div className="jarvis-core"></div>
                    </div>
                    <p className="text-xs text-cyan-400 tracking-widest mt-2">
                      LISTENING... (SPEAK FREELY)
                    </p>
                  </div>
                </div>
              ) : (
                "Connecting mic..."
              )
            ) : (
              "Type or click mic to speak"
            )}
          </motion.div>

          {/* Unified textarea + mic + clear + send */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                placeholder="Type your answer or speak with the mic..."
                value={text}
                rows={1}
                onChange={(e) => {
                  const value = e.target.value;
                  setText(value);
                  baseTextRef.current = value ? value.trim() : "";
                  sessionFinalRef.current = "";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                className="
                  w-full resize-none overflow-hidden
                  rounded-md border border-border bg-background
                  px-3 py-2 text-sm outline-none
                  focus:ring-1 focus:ring-primary
                "
                style={{ minHeight: "40px", maxHeight: "140px" }}
              />

              {/* Clear button */}
              {text?.trim() && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear text"
                  aria-label="Clear text"
                  className="
                    absolute right-2 top-2
                    h-7 w-7 rounded-md
                    flex items-center justify-center
                    border border-border bg-background
                    hover:bg-muted transition
                  "
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mic Button */}
            <button
              type="button"
              onClick={() => setListening((s: any) => !s)}
              className={`h-10 w-10 flex items-center justify-center rounded-md border transition ${
                listening && isRecognizing
                  ? "bg-red-500 text-white border-red-500 animate-pulse"
                  : listening && !isRecognizing
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
              title={
                listening
                  ? isRecognizing
                    ? "Stop Mic"
                    : "Connecting Mic"
                  : "Start Mic"
              }
              aria-label={
                listening
                  ? isRecognizing
                    ? "Stop Mic"
                    : "Connecting Mic"
                  : "Start Mic"
              }
            >
              {listening && isRecognizing ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Send button */}
            <button
              type="button"
              disabled={!text?.trim()}
              onClick={submitAnswer}
              className={`h-10 w-10 flex items-center justify-center rounded-md border transition ${
                text?.trim()
                  ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                  : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-border"
              }`}
              title="Send Answer"
              aria-label="Send Answer"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
