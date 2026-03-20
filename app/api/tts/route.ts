import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
// const VOICE_ID = "Nj17Z4VDrfZaOdsqTaPL";
// const VOICE_ID = "Di8BzFfYtEOQXwj585cY";//vanshul - long form conversation host
// const VOICE_ID = "Di8BzFfYtEOQXwj585cY";//vanshul - long form conversation host
// const VOICE_ID = "gHu9GtaHOXcSqFTK06ux";//anjali - warm cheerful and calm
const VOICE_ID = "Uyx98Ek4uMNmWN7E28CD";//aryan akash -  calm and professional

const VOICES = {
    female: "gHu9GtaHOXcSqFTK06ux", // Anjali (HR style)
    male: "Uyx98Ek4uMNmWN7E28CD",   // Aakash Aryan (strict interviewer)
};
export async function POST(req: Request) {
    try {
        const { text, voiceType = "female" } = await req.json();


        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }


        const VOICE_ID = VOICES[voiceType as keyof typeof VOICES] || VOICES.female;

        const voiceSettings =
            voiceType === "male"
                ? {
                    stability: 0.8,
                    similarity_boost: 0.9,
                    style: 0.25,
                    use_speaker_boost: true,
                    speaking_rate: 1.1,
                }
                : {
                    stability: 0.7,
                    similarity_boost: 0.9,
                    style: 0.35,
                    use_speaker_boost: true,
                    speaking_rate: 1.15,
            };

        // const elevenRes = await fetch(
        //     `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
        //     {
        //         method: "POST",
        //         headers: {
        //             "xi-api-key": ELEVENLABS_API_KEY,
        //             "Content-Type": "application/json",
        //             Accept: "audio/mpeg",
        //         },
        //         body: JSON.stringify({
        //             text,
        //             model_id: "eleven_turbo_v2",
        //             voice_settings: {
        //                 stability: 0.6,
        //                 similarity_boost: 0.85,
        //             },
        //         }),
        //     }
        // );
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
                    model_id: "eleven_multilingual_v2",
                    voice_settings: voiceSettings,
                }),
            }
        );

        if (!elevenRes.ok || !elevenRes.body) {
            const errorText = await elevenRes.text();
            console.error("❌ ElevenLabs error:", errorText);
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
