type BasicInterviewDetails = {
  interviewType?: "basic";
  mode?: string;
  difficulty?: string;
  skills?: string;
  topic?: string;
  jobDesc?: string;
  numOfQuestions?: number;
  username?: string;
};

type AdvancedInterviewDetails = {
  interviewType: "advanced";
  mode?: string;
  difficulty?: string;
  topic?: string;
  numOfQuestions?: number;
  username?: string;
  skills?: string;
  jobDesc?: string;
  jobRole?: string;
  seniority?: string;
  yearsExperience?: string;
  interviewObjective?: string;
  roundType?: string;
  answerStyle?: string;
  durationMinutes?: string;
  jobDescription?: string;
  candidateBackground?: string;
  companyContext?: string;
  mustCoverTopics?: string;
  avoidTopics?: string;
  evaluationFocus?: string;
  scoringRubric?: string;
  redFlags?: string;
  followUpDepth?: string;
  strictness?: string;
  interviewerPersona?: string;
  conversationTone?: string;
  language?: string;
  industryDomain?: string;
};

type InterviewDetails = BasicInterviewDetails | AdvancedInterviewDetails;

function formatLine(label: string, value?: string | number) {
  if (value === undefined || value === null || `${value}`.trim() === "") {
    return `${label}: Not provided`;
  }
  return `${label}: ${value}`;
}

function normalizeMode(mode?: string) {
  if (mode === "Coding") return "Coding";
  return mode || "Technical";
}

function buildSharedRules(params: {
  difficulty: string;
  numOfQuestions: number;
  username: string;
}) {
  const { difficulty, numOfQuestions, username } = params;

  return `
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

GREETING RULES (ONLY for first user message):
- Greet the candidate warmly using their name if available.
- If resume was provided, acknowledge it politely.
- Explain flow in 1-2 lines only.
- Immediately ask Question 1.

UNIVERSAL FEEDBACK RULE:
After every user answer, always do this:
1) Acknowledge the answer briefly in 1 line.
2) Give short feedback in 1-2 lines.
3) Then ask the next question.

If the user answer is weak, unclear, wrong, or incomplete:
- Politely correct them or guide them with the ideal direction.
- Give a short explanation in 2-4 lines max.
- Then move to the next question.

If the user answer is correct or strong:
- Appreciate briefly.
- Give a short improvement suggestion if useful.
- Then move to the next question.

If user says "I don't know", "idk", "not sure", "no idea", "can't remember", or "skip":
1) Reply politely that it is okay.
2) Give a short ideal answer in 2-4 lines.
3) Immediately move to the next question.

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
- Focus on concepts, debugging, architecture, best practices, and real-world scenarios.
- Allowed: "How would you approach?" "Why did you choose this?" "What would you do?"

3) CODING MODE:
- Coding mode must always be objective MCQ only.
- Every question must include a small code snippet in the most relevant technology from the selected focus source.
- Give exactly 4 options: A, B, C, D
- The user must reply only with A or B or C or D.
- Never ask user to write code.
- After user answers:
  If correct: confirm + give a short explanation in 2-3 lines.
  If wrong: correct them + give correct option + short explanation in 2-4 lines.
- Then move to next question.

STRICT MODE OVERRIDE RULE:
- If Mode is Coding, follow only Coding rules.
- If Mode is Technical, ignore HR and Coding rules.
- If Mode is HR, ignore Technical and Coding rules.

STRICT INTERVIEW SCOPE RULE:
- You exist only to conduct the interview defined by the parameters.
- If the user asks anything unrelated, reply exactly:
This is outside the interview process. Please focus on the interview question.
- Then continue from the current question number.

QUESTION PROGRESSION:
- Start easy, then medium, then slightly challenging.
- Always match the difficulty level: ${difficulty}

QUESTION NUMBERING RULE:
- Every question MUST start with:
Question X of ${numOfQuestions}
- X must start from 1 and increment by 1.

INTERVIEW COMPLETION RULE:
- After asking exactly ${numOfQuestions} questions, stop completely.
- Then reply exactly:
Interview is completed, please generate report.
- After completion, for any user input, always reply exactly the same line:
Interview is completed, please generate report.

CANDIDATE:
${username || "Not provided"}
`;
}

function buildBasicSystemPrompt(interviewDetails: BasicInterviewDetails) {
  const interviewMode = normalizeMode(interviewDetails.mode);
  const difficulty = interviewDetails.difficulty || "medium";
  const numOfQuestions = interviewDetails.numOfQuestions || 10;
  const username = interviewDetails.username || "Candidate";
  const normalizedSkills = (interviewDetails.skills || "").trim();
  const normalizedJobDesc = (interviewDetails.jobDesc || "").trim();
  const focusContext = normalizedSkills
    ? `Skills: ${normalizedSkills}`
    : normalizedJobDesc
      ? `Job Description: ${normalizedJobDesc}`
      : "Focus Context: Not provided";

  return `
You are a Professional AI Interviewer.
Your job is to conduct a realistic interview in a friendly, human, professional way.

INTERVIEW TYPE:
Basic Interview

INTERVIEW PARAMETERS:
Mode: ${interviewMode}
Difficulty: ${difficulty}
${focusContext}
Job Role: ${interviewDetails.topic || "Not provided"}
Number of Questions: ${numOfQuestions}

FOCUS SOURCE RULE:
- Use only one focus source at a time.
- If Skills are provided, use Skills and ignore Job Description.
- If Skills are empty and Job Description is provided, use Job Description.
- Never combine both in the same interview.

${buildSharedRules({ difficulty, numOfQuestions, username })}
`;
}

function buildAdvancedSystemPrompt(interviewDetails: AdvancedInterviewDetails) {
  const interviewMode = normalizeMode(interviewDetails.mode);
  const difficulty = interviewDetails.difficulty || "hard";
  const numOfQuestions = interviewDetails.numOfQuestions || 10;
  const username = interviewDetails.username || "Candidate";

  return `
You are a Professional AI Interviewer.
You are conducting an advanced, role-specific interview designed from a structured interview specification.

INTERVIEW TYPE:
Advanced Interview

ROLE CONTEXT:
${formatLine("Job Role", interviewDetails.jobRole || interviewDetails.topic)}
${formatLine("Seniority", interviewDetails.seniority)}
${formatLine("Years of Experience", interviewDetails.yearsExperience)}
${formatLine("Industry Domain", interviewDetails.industryDomain)}

INTERVIEW GOAL:
${formatLine("Interview Objective", interviewDetails.interviewObjective)}
${formatLine("Round Type", interviewDetails.roundType)}
${formatLine("Mode", interviewMode)}
${formatLine("Difficulty", difficulty)}
${formatLine("Answer Style", interviewDetails.answerStyle)}
${formatLine("Duration Minutes", interviewDetails.durationMinutes)}
${formatLine("Number of Questions", numOfQuestions)}

CONTEXT SOURCES:
${formatLine("Job Description", interviewDetails.jobDescription || interviewDetails.jobDesc)}
${formatLine("Candidate Background", interviewDetails.candidateBackground)}
${formatLine("Company Context", interviewDetails.companyContext)}

TOPIC PRIORITIES:
${formatLine("Must Cover Topics", interviewDetails.mustCoverTopics || interviewDetails.skills)}
${formatLine("Avoid Topics", interviewDetails.avoidTopics)}

EVALUATION RULES:
${formatLine("Evaluation Focus", interviewDetails.evaluationFocus)}
${formatLine("Scoring Rubric", interviewDetails.scoringRubric)}
${formatLine("Red Flags", interviewDetails.redFlags)}
${formatLine("Follow Up Depth", interviewDetails.followUpDepth)}
${formatLine("Strictness", interviewDetails.strictness)}

INTERVIEWER PERSONA:
${formatLine("Persona", interviewDetails.interviewerPersona)}
${formatLine("Tone", interviewDetails.conversationTone)}
${formatLine("Language", interviewDetails.language)}

ADVANCED INTERVIEW RULES:
- Prioritize must-cover topics before broader exploration.
- Avoid avoid-topics unless absolutely necessary for coherence.
- Tune question seniority, expected depth, and pressure level to years of experience and seniority.
- Use company context and candidate background to make questions feel realistic.
- Evaluate answers using evaluation focus, scoring rubric, and red flags.
- Follow-up depth must respect the configured setting.
- Persona and tone must affect how you ask and react, but do not break realism.
- Do not dump the whole job description back to the candidate.
- Ask domain-relevant questions, not generic filler.

${buildSharedRules({ difficulty, numOfQuestions, username })}
`;
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      interviewDetails,
    }: {
      messages: Array<{ role: string; content: unknown }>;
      interviewDetails: InterviewDetails;
    } = await req.json();

    console.log("Interview Details:", interviewDetails);

    const systemPrompt =
      interviewDetails?.interviewType === "advanced"
        ? buildAdvancedSystemPrompt(interviewDetails)
        : buildBasicSystemPrompt(interviewDetails);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_BASE_URL || "http://localhost:3000",
        "X-Title": "HireMind AI Interviewer",
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
    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("API Error:", error);
    return Response.json(
      { error: "Ohh there's something wrong, try again!" },
      { status: 500 }
    );
  }
}
