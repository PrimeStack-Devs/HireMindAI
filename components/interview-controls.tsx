"use client";

import { useEffect, useRef, useState } from "react";
import AISpeakingBars from "./ai-speaking-bars";
import MicVisualizer from "./mic-visualizer";
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
  terminateAudio
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

  // store final confirmed transcript
  const finalTranscriptRef = useRef<string>("");

  //  track last final index to avoid repeating same sentence
  const lastFinalIndexRef = useRef<number>(-1);

  //  prevent infinite restart loop after stop()
  const manuallyStoppedRef = useRef<boolean>(false);
  const startingRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>("");
  const restartAttemptsRef = useRef<number>(0);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //  textarea ref for autosize
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  //  autosize textarea whenever text changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

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

    recognition.lang = navigator.language || "en-US";
    // recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let newFinalText = "";
      let interimText = "";

      //  consume only new result range to avoid replacing/duplicating text
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const spokenText = (result[0]?.transcript || "").trim();
        if (!spokenText) continue;

        if (result.isFinal) {
          newFinalText += spokenText + " ";
        } else {
          interimText += spokenText + " ";
        }
      }

      if (newFinalText) {
        finalTranscriptRef.current += newFinalText;
      }

      const baseText = baseTextRef.current;
      const merged = `${baseText} ${finalTranscriptRef.current} ${interimText}`
        .replace(/\s+/g, " ")
        .trim();

      lastFinalIndexRef.current = event.results.length - 1;

      setText(merged);
    };



    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      startingRef.current = false;
      setIsRecognizing(false);

      // ✅ ignore aborted error (comes from manual stop)
      if (event.error === "aborted") return;

      // Fatal errors: stop mic and reflect status immediately
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        manuallyStoppedRef.current = true;
        setListening(false);
        return;
      }
      // Non-fatal errors (no-speech/network) let onend trigger retry
    };

    recognition.onstart = () => {
      startingRef.current = false;
      restartAttemptsRef.current = 0;
      setIsRecognizing(true);
    };

    recognition.onend = () => {
      setIsRecognizing(false);

      // ✅ restart only if it ended naturally (not manually stopped)
      if (listeningRef.current && !manuallyStoppedRef.current) {
        const maxRetries = 5;
        if (restartAttemptsRef.current >= maxRetries) {
          setListening(false);
          return;
        }

        const delay = Math.min(1000 * 2 ** restartAttemptsRef.current, 8000);
        restartAttemptsRef.current += 1;

        try {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            try {
              startingRef.current = true;
              recognition.start();
            } catch {
              startingRef.current = false;
              setListening(false);
            }
          }, delay);
        } catch {
          setListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      try {
        recognition.stop();
      } catch { }
      recognitionRef.current = null;
    };
  }, [setListening, setText]);

  // ✅ Start/Stop mic based on listening state
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      manuallyStoppedRef.current = false;
      if (startingRef.current) return;

      // ✅ IMPORTANT FIX:
      // Don't clear existing text when mic starts.
      // Just continue from current text.
      baseTextRef.current = textRef.current?.trim() || "";
      finalTranscriptRef.current = "";
      lastFinalIndexRef.current = -1;

      try {
        startingRef.current = true;
        recognition.start();
      } catch {
        startingRef.current = false;
        setListening(false);
      }
    } else {
      manuallyStoppedRef.current = true;
      restartAttemptsRef.current = 0;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      setIsRecognizing(false);

      try {
        recognition.stop();
      } catch { }
    }
  }, [listening]);

  // Periodically refresh recognition session to reduce long-running degradation.
  useEffect(() => {
    if (!listening) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const refreshTimer = setInterval(() => {
      if (!listeningRef.current || manuallyStoppedRef.current) return;
      try {
        recognition.stop();
      } catch { }
    }, 60000);

    return () => clearInterval(refreshTimer);
  }, [listening]);

  // ✅ stop listening when AI starts speaking
  useEffect(() => {
    if (!aiSpeaking) return;
    setListening(false);
  }, [aiSpeaking, setListening]);

  const handleClear = () => {
    setText("");
    baseTextRef.current = "";
    finalTranscriptRef.current = "";
    lastFinalIndexRef.current = -1;
  };

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
            {listening
              ? isRecognizing
                  ? <div className="w-full flex justify-baseline items-center">
                    <div className="mx-auto">
                      <div className="jarvis-container">
                        <div className="jarvis-ring"></div>
                        <div className="jarvis-core"></div>
                      </div>
                      <p className="text-xs text-cyan-400 tracking-widest mt-2">LISTENING</p>
                    </div>
                </div>
                : "Mic reconnecting..."
              : "Type or use mic"}

          </motion.div>

          {/* ✅ Unified textarea + mic + clear + send */}
          <div className="flex gap-2 items-end">
            {/* Left: Auto-growing textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                placeholder="Type your answer... or speak"
                value={text}
                rows={1}
                onChange={(e) => {
                  const value = e.target.value;
                  setText(value);

                  // ✅ editing allowed while mic is ON
                  if (listeningRef.current) {
                    baseTextRef.current = value ? value.trim() : "";
                    finalTranscriptRef.current = "";
                  } else {
                    baseTextRef.current = "";
                  }
                  lastFinalIndexRef.current = -1;
                }}
                onKeyDown={(e) => {
                  // Enter = send, Shift+Enter = new line
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!text.trim()) return;

                    setListening(false);
                    handleSend(text.trim());

                    handleClear();
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

              {/* ✅ Clear button (only when text exists) */}
              {text?.trim() && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  aria-label="Clear"
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
              onClick={() => setListening((s) => !s)}
              className={`h-10 w-10 flex items-center justify-center rounded-md border transition
                ${listening && isRecognizing
                  ? "bg-red-500 text-white border-red-500"
                  : listening && !isRecognizing
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              title={listening ? (isRecognizing ? "Stop Mic" : "Mic reconnecting") : "Start Mic"}
              aria-label={listening ? (isRecognizing ? "Stop Mic" : "Mic reconnecting") : "Start Mic"}
            >
              {listening && isRecognizing ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Send button */}
            <button
              type="button"
              disabled={!text?.trim()}
              onClick={() => {
                if (!text.trim()) return;
                terminateAudio();
                setListening(false);
                handleSend(text.trim());
                handleClear();
              }}
              className={`h-10 w-10 flex items-center justify-center rounded-md border transition
                ${text?.trim()
                  ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                  : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-border"
                }`}
              title="Send"
              aria-label="Send"
            >
              <SendHorizonal size={18} />
            </button>
          </div>


        </div>
      )}
    </div>
  );
}
