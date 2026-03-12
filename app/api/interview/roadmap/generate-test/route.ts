import { json } from "stream/consumers";

export async function POST(req: Request) {

  const body = await req.json()

  const {roadmapDetails} = body

  const jobRole = roadmapDetails?.jobRole
  const skills = roadmapDetails?.skills
  const duration = roadmapDetails?.duration


const prompt = `
You are an expert technical interviewer.

Generate a technical skill assessment test for the following candidate.

Candidate Profile:
Job Role: ${jobRole}
Skills: ${skills}
Target Learning Duration: ${duration} months

TEST RULES:

1. Generate EXACTLY 10 MCQ questions.

2. Questions must be based ONLY on the provided skills.

3. Distribute questions across the skills listed above.

Example:

If skills = "java,springboot,mysql"

Sections should be:
- Java
- Spring Boot
- MySQL

If skills = "react,nodejs,mongodb"

Sections should be:
- React
- Node.js
- MongoDB

--------------------------------------------------

TOPIC RULE (VERY IMPORTANT)

Each question MUST include a topic or category inside the skill.

Examples:

React topics:
- State Management
- React Hooks
- Component Lifecycle
- Context API
- Performance Optimization

Node.js topics:
- Event Loop
- Express Routing
- Middleware
- Authentication
- Error Handling

MongoDB topics:
- CRUD Operations
- Indexing
- Aggregation
- Schema Design

The topic field MUST describe the specific concept the question tests.

--------------------------------------------------

QUESTION STRUCTURE

Each question MUST follow this format:

{
  "section": "skill name",
  "topic": "specific topic inside the skill",
  "difficulty": "easy | medium",
  "question": "Clear technical question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0
}

--------------------------------------------------

IMPORTANT RULES

- Return ONLY a valid JSON array.
- Do NOT include markdown.
- Do NOT include explanations.
- Do NOT include backticks.
- Do NOT wrap output inside code blocks.
- Do NOT use single quotes anywhere.
- All strings must use double quotes.
- Options must be plain text.
- correctAnswerIndex must be a number between 0 and 3.

Ensure the JSON is directly parsable with JSON.parse().

Return only the JSON array.
`;

// if(prompt) return console.log(prompt)


  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.SITE_BASE_URL || "http://localhost:3000",
      "X-Title": "HireMind AI Interviewer"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    }),
  });

  const data = await res.json();
  // console.log('data',data)
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    return new Response(JSON.stringify({ error: "No content from AI" }), { status: 500 });
  }

  // Remove ```json blocks if AI still sends them
  const cleaned = rawContent
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Invalid JSON from AI",
      raw: rawContent
    }), { status: 500 });
  }
  //  return console.log('parsed',parsed)
  return new Response(JSON.stringify(parsed), { status: 200 });
} 