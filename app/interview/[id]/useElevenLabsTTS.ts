"use client";

import { useRef, useCallback } from "react";

export function useElevenLabsTTS({
    onStart,
    onEnd,
}: {
    onStart?: () => void;
    onEnd?: () => void;
} = {}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaSourceRef = useRef<MediaSource | null>(null);

    // Logical cancellation (prevents race conditions)
    const requestIdRef = useRef(0);

    // Stream-level cancellation
    const isCancelledRef = useRef(false);

    const terminateAudio = useCallback(() => {
        // Invalidate all previous requests
        requestIdRef.current += 1;
        isCancelledRef.current = true;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = "";
            audioRef.current.load();
            audioRef.current = null;
        }

        if (mediaSourceRef.current) {
            try {
                if (mediaSourceRef.current.readyState === "open") {
                    mediaSourceRef.current.endOfStream();
                }
            } catch { }
            mediaSourceRef.current = null;
        }

        onEnd?.();
    }, [onEnd]);

    const generateSpeech = useCallback(
        async (text: string) => {
            if (!text) return;

            // Stop any existing audio FIRST
            terminateAudio();

            // Allow new stream
            isCancelledRef.current = false;
            const myReqId = ++requestIdRef.current;

            onStart?.();

            const mediaSource = new MediaSource();
            mediaSourceRef.current = mediaSource;

            const audio = new Audio();
            audioRef.current = audio;
            audio.src = URL.createObjectURL(mediaSource);

            audio.onended = () => {
                if (myReqId === requestIdRef.current) {
                    onEnd?.();
                }
            };

            mediaSource.addEventListener("sourceopen", async () => {
                try {
                    if (!MediaSource.isTypeSupported("audio/mpeg")) {
                        throw new Error("audio/mpeg not supported");
                    }

                    const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
                    sourceBuffer.mode = "sequence";

                    const response = await fetch("/api/tts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            text,
                            voiceType:"female",
                        }),
                    });

                    if (!response.ok || !response.body) {
                        throw new Error("TTS stream failed");
                    }

                    // If another request started, abort
                    if (myReqId !== requestIdRef.current) return;

                    const reader = response.body.getReader();
                    let hasStartedPlaying = false;

                    while (!isCancelledRef.current) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        // If another request started, stop immediately
                        if (myReqId !== requestIdRef.current) {
                            reader.cancel();
                            break;
                        }

                        await new Promise<void>((resolve) => {
                            sourceBuffer.appendBuffer(value);

                            const onUpdateEnd = () => {
                                sourceBuffer.removeEventListener("updateend", onUpdateEnd);
                                resolve();
                            };

                            sourceBuffer.addEventListener("updateend", onUpdateEnd);
                        });

                        // 🔥 Start audio ASAP after first chunk
                        if (!hasStartedPlaying) {
                            hasStartedPlaying = true;
                            await audio.play(); // must be user-initiated upstream
                        }
                    }

                    if (
                        !isCancelledRef.current &&
                        myReqId === requestIdRef.current &&
                        mediaSource.readyState === "open"
                    ) {
                        mediaSource.endOfStream();
                    }
                } catch (err) {
                    console.error("TTS streaming error:", err);
                    if (myReqId === requestIdRef.current) {
                        onEnd?.();
                    }
                }
            });
        },
        [onStart, onEnd, terminateAudio]
    );

    return {
        generateSpeech,
        terminateAudio,
    };
}