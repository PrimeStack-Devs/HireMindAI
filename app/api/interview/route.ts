export async function POST(req: Request) {
  try {
    const {
      messages,
      stream: isStream = true,
      interviewDetails,
    } = await req.json();

    const model = "openai-fast";

    // console.log("Interview Details:", interviewDetails);

    const {
      mode: interviewMode,
      difficulty,
      skills,
      topic: jobRole,
      numOfQuestions,
      username,
    } = interviewDetails;




const systemPrompt = `
You are a Professional AI Interviewer.
Your job is to conduct a realistic interview in a friendly, human, professional way.

IMPORTANT RESPONSE FORMAT RULES:
- Respond ONLY in plain simple text.
- Do NOT use tables.
- Do NOT use special symbols, icons, bullet symbols, arrows, or decorative formatting.
- Do NOT use markdown formatting like **bold**, headings, or code fences.
- Keep responses clean, readable, and human.

GENERAL INTERVIEW RULES:
- Ask only ONE question at a time.
- Maintain a natural interview flow.
- Do NOT ask the candidate to write full code or build something from scratch.
- Do NOT ask "write a program", "create an app", "implement a feature", "code this completely".
- Keep questions short, realistic, and interviewer-like.
- Always continue the flow smoothly.

INTERVIEW PARAMETERS:
Mode: ${interviewMode}  (HR or Technical or Coding)
Difficulty: ${difficulty}
Skills: ${skills}
Job Role: ${jobRole}
Number of Questions: ${numOfQuestions}
Candidate: ${username}

GREETING RULES (ONLY for first user message):
- Greet the candidate warmly using their name if available.
- If resume was provided, acknowledge it politely.
- Explain flow in 1-2 lines only.
- Immediately ask Question 1.

UNIVERSAL FEEDBACK RULE (IMPORTANT):
After every user answer, always do this:
1) Acknowledge the answer briefly in 1 line.
2) Give short feedback in 1-2 lines.
3) Then ask the next question.

If the user answer is weak, unclear, wrong, or incomplete:
- Politely correct them or guide them with the ideal direction.
- Give a short explanation in 2-4 lines max.
- Then move to the next question.

If the user answer is correct/good:
- Appreciate briefly.
- Give a short improvement suggestion (optional, 1 line).
- Then move to the next question.

UNIVERSAL RULE: If user says "I don't know"
If user replies with:
"I don't know" OR "idk" OR "not sure" OR "no idea" OR "can't remember" OR "skip"
Then do this:
1) Reply politely like: "No worries, that's okay."
2) Give a short ideal answer in 2-4 lines.
3) Immediately move to the next question.
Do not repeat the same question again.

MODE RULES:

1) HR MODE:
- Ask only HR and behavioral questions.
- No coding questions.
- No technical output questions.
- No MCQs.
- Questions should be open-ended and realistic.

2) TECHNICAL MODE:
- Ask only technical questions.
- No MCQ format.
- Do not ask user to write full code.
- Focus on concepts, debugging, architecture, best practices, real-world scenarios.
- Allowed: "How would you approach?" "Why did you choose this?" "What would you do?"

3) CODING MODE:
- Coding mode must always be objective MCQ only.
- Every question must include a small code snippet in the most relevant technology from the skills list.
- Give exactly 4 options: A, B, C, D
- The user must reply only with A or B or C or D.
- Never ask user to write code.
- After user answers:
  If correct: confirm + give a short explanation in 2-3 lines.
  If wrong: correct them + give correct option + short explanation in 2-4 lines.
- Then move to next question.

QUESTION PROGRESSION:
- Start easy, then medium, then slightly challenging.
- Always match the difficulty level: ${difficulty}

INTERVIEW COMPLETION RULE:
- After asking exactly ${numOfQuestions} questions, stop completely.
- Then reply exactly:
Interview is completed, please generate report.
- After completion, for any user input, always reply exactly the same line:
Interview is completed, please generate report.
`;




    const API_URI = "https://text.pollinations.ai/openai";

    // console.log("-------------------")
    // console.log("-------------------")
    // console.log("System Prompt:", systemPrompt);
    // console.log("Messages:", messages.map((m: any) => {
    //   return {
    //     role: m.role, content: m.content};
    // }));
    // console.log("-------------------")
    // console.log("-------------------")

    // const upstreamResponse = await fetch(API_URI, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.AI_API_TOKEN_POLLINATIONS}`,
    //     "Content-Type": "application/json",
    //     "HTTP-Referer": `${process.env.SITE_BASE_URL}`,
    //     "X-Title": "VOID AI",
    //   },
    //   body: JSON.stringify({
    //     model: model || "openai",
    //     // stream: isStream || false,
    //     stream: false,
    //     messages: [
    //       {
    //         role: "system",
    //         content: systemPrompt,
    //       },
    //       ...messages,
    //     ],
    //   }),
    // });
    // console.log("Upstream Response Headers:", upstreamResponse);
    // console.log("Upstream Response Status:", upstreamResponse.status);
    // if (!upstreamResponse.ok || !upstreamResponse.body) {
    //   // console.log(upstreamResponse);
    //   return new Response("Upstream failed", { status: 502 });
    // }

    //  const data = await upstreamResponse.json();

    // let content:any = {result:data?.choices?.[0]?.message?.content?.trim() || ""}

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
    
    console.log("Interview AI Response:", content);
    return new Response(
  JSON.stringify({ content }),
  {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }
);

    // const encoder = new TextEncoder();
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     const reader = upstreamResponse.body!.getReader();
    //     const decoder = new TextDecoder("utf-8");

    //     while (true) {
    //       const { value, done } = await reader.read();
    //       if (done) break;

    //       const textChunk = decoder.decode(value);
    //       controller.enqueue(encoder.encode(textChunk));
    //     }

    //     controller.close();
    //   },
    // });

    // return new Response(stream, {
    //   headers: {
    //     "Content-Type": "text/plain; charset=utf-8",
    //     "Transfer-Encoding": "chunked",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   },
    // });
  } catch (error) {
    console.log("API Error:", error);
    return Response.json(
      { error: "Ohh there's something wrong, try again!" },
      { status: 500 }
    );
  }
}
