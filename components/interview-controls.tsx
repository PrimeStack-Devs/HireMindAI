"use client";

import { useEffect, useRef } from "react";
import AISpeakingBars from "./ai-speaking-bars";
import MicVisualizer from "./mic-visualizer";
import SegmentedToggle from "./segmented-toggle";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
      let interimTranscript = "";

      // ✅ process only changed results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const spokenText = result[0]?.transcript || "";

        if (result.isFinal) {
          // ✅ add ONLY new final transcripts (prevents loop repeating)
          if (i > lastFinalIndexRef.current) {
            finalTranscriptRef.current += spokenText.trim() + " ";
            lastFinalIndexRef.current = i;
          }
        } else {
          interimTranscript += spokenText;
        }
      }

      setText((finalTranscriptRef.current + interimTranscript).trim());
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

      // ✅ reset everything when starting
      finalTranscriptRef.current = "";
      lastFinalIndexRef.current = -1;
      setText("");

      try {
        recognition.start();
      } catch {}
    } else {
      manuallyStoppedRef.current = true;

      try {
        recognition.stop();
      } catch {}
    }
  }, [listening, setText]);

  // ✅ stop listening when AI starts speaking
  useEffect(() => {
    if (!aiSpeaking) return;
    setListening(false);
  }, [aiSpeaking, setListening]);

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
          <SegmentedToggle
            value={mode}
            onChange={(v) => setMode(v as "voice" | "text")}
            options={[
              { label: "Voice", value: "voice" },
              { label: "Text", value: "text" },
            ]}
            className="w-full"
          />

          {/* Voice */}
          {mode === "voice" && (
            <div className="flex flex-col items-center gap-2">
              <MicVisualizer active={listening} />

              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground"
              >
                {listening ? "Listening..." : "Tap mic to speak"}
              </motion.div>

              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setListening((s) => !s)}
                  className="flex-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow hover:opacity-90"
                >
                  {listening ? "Stop" : "Start"} Mic
                </button>

                {text?.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setListening(false);
                      handleSend(text.trim());

                      // ✅ clear after sending
                      setText("");
                      finalTranscriptRef.current = "";
                      lastFinalIndexRef.current = -1;
                    }}
                    className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-muted"
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Text */}
          {mode === "text" && (
            <div className="flex gap-2">
              <Input
                placeholder="Type your answer..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    handleSend(text.trim());
                    setText("");
                  }
                }}
                className="flex-1 text-sm"
              />

              <button
                type="button"
                onClick={() => {
                  if (text.trim()) {
                    handleSend(text.trim());
                    setText("");
                  }
                }}
                className="rounded-md bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
