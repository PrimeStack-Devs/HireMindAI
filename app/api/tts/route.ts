import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "Nj17Z4VDrfZaOdsqTaPL";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }
        
        const elevenRes = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "audio/mpeg",
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_turbo_v2",
                    voice_settings: {
                        stability: 0.6,
                        similarity_boost: 0.85,
                    },
                }),
            }
        );

        if (!elevenRes.ok || !elevenRes.body) {
            const errorText = await elevenRes.text();
            // console.error("❌ ElevenLabs error:", errorText);
            return NextResponse.json(
                { error: "Failed to generate speech: " + errorText },
                { status: 500 }
            );
        }

        // 🔥 STREAM AUDIO DIRECTLY TO BROWSER
        return new Response(elevenRes.body, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("❌ TTS API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
