export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    const model = "mistral";
    const systemPrompt = `
You are a highly accurate resume parsing model. You receive a resume image and must extract key data fields needed to configure an AI interview.

Return ONLY valid JSON. No markdown. No extra text.

{
  "candidateName": "",
  "skills": "",
  "topic": "",
  "difficulty": "medium",
  "mode": "Technical",
  "experience": "",
  "education": "",
  "projects": []
}
`;

    const API_URI = "https://text.pollinations.ai/openai";


//     const response = await fetch(API_URI, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.AI_API_TOKEN_POLLINATIONS}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model,
//         messages: [{ role: "system", content: systemPrompt }, ...messages],
//       }),
//     });

//     const data = await response.json();
// // console.log("Pollinations Raw Response:", data);
//     let content = data?.choices?.[0]?.message?.content?.trim() || "";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_BASE_URL || "http://localhost:3000",
        "X-Title": "HireMind AI Interviewer"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();

    // ✅ Must be JSON always
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({
          error: "AI did not return valid JSON",
          raw: cleaned,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsedJson), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Resume extractor error:", error);
    return new Response(JSON.stringify({ error: "Failed to Extract Data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
