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

    const terminateAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }, []);

    const generateSpeech = useCallback(async (text: string) => {
        if (!text) return;

        console.log("Generating speech for text:", text);
        // Stop previous audio if still playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }

        onStart?.();

        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok || !response.body) {
                throw new Error("TTS request failed");
            }
            console.log("TTS response received");

            const audio = new Audio();
            audio.src = URL.createObjectURL(await response.blob());
            audioRef.current = audio;

            audio.onended = () => {
                onEnd?.();
            };

            await audio.play();
        } catch (error) {
            console.error("❌ ElevenLabs TTS error:", error);
            onEnd?.();
        }
    }, []);

    return {
        generateSpeech,
        terminateAudio,
    };
}
