"use client";

import { useEffect, useRef } from "react";
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
}: {
  aiSpeaking: boolean;
  mode: "voice" | "text";
  listening: boolean;
  text: string;
  setMode: (mode: "voice" | "text") => void;
  setListening: (listening: boolean | ((prev: boolean) => boolean)) => void;
  setText: (text: string) => void;
  handleSend: (text: string) => void;
}) {
  const recognitionRef = useRef<any>(null);

  // ✅ store final confirmed transcript
  const finalTranscriptRef = useRef<string>("");

  // ✅ track last final index to avoid repeating same sentence
  const lastFinalIndexRef = useRef<number>(-1);

  // ✅ prevent infinite restart loop after stop()
  const manuallyStoppedRef = useRef<boolean>(false);

  // ✅ textarea ref for autosize
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ✅ autosize textarea whenever text changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
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

    recognition.lang = "en-IN"; // change to "en-US" if you want
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

 recognition.onresult = (event: any) => {
  let finalText = "";
  let interimText = "";

  // ✅ rebuild complete transcript from scratch every time
  for (let i = 0; i < event.results.length; i++) {
    const result = event.results[i];
    const spokenText = result[0]?.transcript || "";

    if (result.isFinal) {
      finalText += spokenText + " ";
    } else {
      interimText += spokenText + " ";
    }
  }

  const merged = (finalText + interimText).replace(/\s+/g, " ").trim();

  // ✅ keep refs updated
  finalTranscriptRef.current = finalText.replace(/\s+/g, " ").trim() + " ";
  lastFinalIndexRef.current = event.results.length - 1;

  setText(merged);
};



    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      // ✅ ignore aborted error (comes from manual stop)
      if (event.error === "aborted") return;

      setListening(false);
    };

    recognition.onend = () => {
      // ✅ restart only if it ended naturally (not manually stopped)
      if (listening && !manuallyStoppedRef.current) {
        try {
          recognition.start();
        } catch {}
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

  // ✅ Start/Stop mic based on listening state
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      manuallyStoppedRef.current = false;

      // ✅ IMPORTANT FIX:
      // Don't clear existing text when mic starts.
      // Just continue from current text.
      finalTranscriptRef.current = text?.trim() ? text.trim() + " " : "";
      lastFinalIndexRef.current = -1;

      try {
        recognition.start();
      } catch {}
    } else {
      manuallyStoppedRef.current = true;

      try {
        recognition.stop();
      } catch {}
    }
  }, [listening, text]);

  // ✅ stop listening when AI starts speaking
  useEffect(() => {
    if (!aiSpeaking) return;
    setListening(false);
  }, [aiSpeaking, setListening]);

  const handleClear = () => {
    setText("");
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
              ? "Listening... (you can edit text too)"
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
                  finalTranscriptRef.current = value ? value.trim() + " " : "";
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
                ${
                  listening
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              title={listening ? "Stop Mic" : "Start Mic"}
              aria-label={listening ? "Stop Mic" : "Start Mic"}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Send button */}
            <button
              type="button"
              disabled={!text?.trim()}
              onClick={() => {
                if (!text.trim()) return;

                setListening(false);
                handleSend(text.trim());

                handleClear();
              }}
              className={`h-10 w-10 flex items-center justify-center rounded-md border transition
                ${
                  text?.trim()
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
