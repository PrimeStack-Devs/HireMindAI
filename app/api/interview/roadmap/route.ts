// export async function POST(req: Request) {
//   try {



//     const body = await req.json()
//     // console.log(body)

//     let type = 'simple'
//     let formData;
//     let results;

//     if (body.type === "smart") {
//       type = "smart";
//       formData = body.formData;
//       results = body.results;
//     } else {
//       type = "simple";
//       formData = body.roadmapDetails;
//     }


//     if (formData) console.log('formData', formData, results)


//     const model = "mistral";

//   console.log(JSON.stringify(results))

// //OLD
//   //     const systemPrompt = `
//     //  You are a Professional AI Roadmap Generator.

//     // Your job is to generate a learning roadmap ONLY in strict raw JSON format.
//     // No explanations, no markdown, no comments, no extra characters.
//     // The final output must be valid JSON and must be treated as the file content of "roadmap.json".

//     // 📋 Input Parameters:
//     // - Job Role: ${roadmapDetails?.jobRole}
//     // - Required Skills: ${roadmapDetails?.skills}
//     // - Duration in Months: ${roadmapDetails?.duration || 6}

//     // ✅ Output Rules (IMPORTANT):
//     // - Output MUST be valid JSON ONLY.
//     // - Do NOT wrap response in backticks.
//     // - Do NOT add markdown.
//     // - Do NOT add any text outside the JSON object.
//     // - No trailing commas, no extra whitespace, no extra line breaks.
//     // - Follow the EXACT JSON structure shown below.
//     // - DO NOT change key names or structure.
//     // - DO NOT remove or add sections.

//     // ✅ JSON STRUCTURE YOU MUST ALWAYS FOLLOW:

//     // {
//     // "title":"Job title",
//     //   "1. Job Role Overview": "job role overview",

//     //   "2. Skills Breakdown": {
//     //     "SkillName": "skill details",
//     //     "SkillName2": "skill details"
//     //   },

//     //   "3. Month-by-Month Roadmap": {
//     //     "Month 1": {
//     //       "Topics": ["topics"],
//     //       "Resources": [
//     //        "resource name and details"
//     //       ],
//     //       "Tasks": ["tasks"]
//     //     },
//     //     "Month 2": {
//     //       "Topics": ["topics"],
//     //       "Resources": [
//     //         "resource name and details"
//     //       ],
//     //       "Tasks": ["tasks"]
//     //     },
//     //     "Month 3": {
//     //       "Topics": ["topics"],
//     //       "Resources": [
//     //         "resource name and details"
//     //       ],
//     //       "Tasks": ["tasks"]
//     //     }
//     //   },

//     //   "4. Learning Resources": {
//     //     "Books": [
//     //       "book name and details"
//     //     ],
//     //     "Online Courses": [
//     //       "course name and details"
//     //     ],
//     //     "Documentation": [
//     //       "documentation name and details"
//     //     ],
//     //     "Youtube Tutorials": [
//     //       "find tutorial or video on youtube and give name here and details"
//     //     ]
//     //   },

//     //   "5. Capstone Project": {
//     //     "Project Idea": "project idea",
//     //     "Features": ["features"],
//     //     "Technologies": ["technologies"]
//     //   },

//     //   "6. Extra Tips": {
//     //     "Community": "community details",
//     //     "Practice": "practice details",
//     //     "Networking": "networking details"
//     //   }
//     // }

//     // ✅ JSON Formatting Rules:
//     // - Use minified JSON (compact JSON — no pretty formatting).
//     // - Values must always be strings, arrays, or objects.
//     // - Handle edge cases:
//     //   - Missing skills → return empty object {} for Skills Breakdown.
//     //   - Missing duration → default to 1 month.
//     //   - Duration > 6 → generate additional months based on pattern.
//     //   - Sanitize invalid characters automatically.

//     // ✅ File Name:
//     // roadmap.json

//     // Now generate the roadmap in STRICT raw JSON:
//     // `;


//     // old
// //     const systemPromptSmart = `
// // You are a Professional AI Roadmap Generator.

// // Your job is to generate a learning roadmap ONLY in strict raw JSON format.
// // No explanations, no markdown, no comments, no extra characters.

// // 📋 Input Parameters:
// // - Job Role: ${formData?.jobRole}
// // - Required Skills: ${formData?.skills}
// // - Duration in Months: ${formData?.duration || 6}

// // 📊 Skill Assessment Results:
// // ${JSON.stringify(results)}

// // Skill Score Rules:
// // - Score >= 80 → Strong skill
// // - Score 50–79 → Moderate skill
// // - Score < 50 → Weak skill

// // Roadmap Intelligence Rules:
// // 1. Weak skills MUST receive the highest learning priority.
// // 2. Moderate skills should be improved with intermediate concepts and practice.
// // 3. Strong skills should only include advanced usage, projects, or optimization.
// // 4. The roadmap MUST focus on skills required for the target job role.
// // 5. Learning must follow logical dependency order (fundamentals → advanced).
// // 6. Each month must include practical tasks and hands-on projects.
// // 7. The roadmap should distribute topics evenly across ${formData?.duration || 6} months.

// // IMPORTANT:
// // - If a skill is weak, include foundational topics first.
// // - If a skill is strong, avoid repeating basic topics.
// // - Prefer project-based learning wherever possible.

// // ✅ Output Rules:
// // - Output MUST be valid JSON ONLY.
// // - No markdown, no backticks, no extra text.
// // - Follow the EXACT JSON structure below.

// // ✅ LINK RULE (MANDATORY):
// // - For every resource name inside "Resources", you MUST also include its clickable link inside "Resources-link".
// // - Both arrays MUST match in length and order.
// // - Links MUST start with "https://".
// // - If official link is unknown, use Google search link:
// // https://www.google.com/search?q=RESOURCE_NAME

// // ✅ JSON STRUCTURE YOU MUST ALWAYS FOLLOW:
// // {
// // "title":"Job title",
// // "1. Job Role Overview":"job role overview",
// // "2. Skills Breakdown":{"SkillName":"skill details"},
// // "3. Month-by-Month Roadmap":{
// // "Month 1":{"Topics":["topics"],"Resources":["resource full name"],"Resources-link":["resource full name - https://link.com"],"Tasks":["tasks"]},
// // "Month 2":{"Topics":["topics"],"Resources":["resource full name"],"Resources-link":["resource full name - https://link.com"],"Tasks":["tasks"]},
// // "Month 3":{"Topics":["topics"],"Resources":["resource full name"],"Resources-link":["resource full name - https://link.com"],"Tasks":["tasks"]}
// // },
// // "4. Learning Resources":{
// // "Books":["book full name"],
// // "Books-link":["book full name - https://link.com"],
// // "Online Courses":["course full name"],
// // "Online Courses-link":["course full name - https://link.com"],
// // "Documentation":["documentation full name"],
// // "Documentation-link":["documentation full name - https://link.com"],
// // "Youtube Tutorials":["youtube full name"],
// // "Youtube Tutorials-link":["youtube full name - https://link.com"]
// // },
// // "5. Capstone Project":{"Project Idea":"project idea","Features":["features"],"Technologies":["technologies"]},
// // "6. Extra Tips":{"Community":"community details","Practice":"practice details","Networking":"networking details"}
// // }

// // ✅ Formatting:
// // - Use minified JSON only.


// // Ensure the JSON is directly parsable with JSON.parse().

// // Return only the JSON.
// // `;

// const systemPromptSmart = `
// You are a Professional AI Roadmap Generator.

// Your job is to generate a learning roadmap ONLY in strict raw JSON format.
// No explanations, no markdown, no comments, no extra characters.

// 📋 Input Parameters:
// - Job Role: ${formData?.jobRole}
// - Required Skills: ${formData?.skills}
// - Duration in Months: ${formData?.duration || 6}

// 📊 Skill Assessment Results:
// ${JSON.stringify(results)}

// --------------------------------------------------

// SKILL SCORE RULES

// Score >= 80 → Strong skill  
// Score 50–79 → Moderate skill  
// Score < 50 → Weak skill  

// --------------------------------------------------

// SMART ROADMAP PRIORITY RULES

// 1. Weak skills MUST receive the highest learning priority.
// 2. Moderate skills should include intermediate learning and practice.
// 3. Strong skills should only include advanced usage, optimization, or projects.
// 4. Avoid repeating beginner topics for strong skills.
// 5. Focus primarily on skills required for the target job role.

// --------------------------------------------------

// LEARNING SEQUENCE RULE (VERY IMPORTANT)

// The roadmap must follow a natural step-by-step progression based on difficulty and prerequisites.

// Topics must follow this order:

// Step 1 — Foundations / Basics
// Step 2 — Core Concepts
// Step 3 — Intermediate Skills
// Step 4 — Advanced Concepts
// Step 5 — Real-world Applications
// Step 6 — Professional Level Practices

// Earlier months MUST focus on foundational knowledge before moving to advanced topics.

// --------------------------------------------------

// PREREQUISITE RULE

// Topics must follow dependency order.

// Examples:

// basic concepts → before advanced concepts  
// core tools → before frameworks  
// fundamentals → before optimization  

// A topic should only appear AFTER its prerequisite knowledge is covered.

// --------------------------------------------------

// FOUNDATION RULE

// Do NOT start directly with frameworks or advanced tools.

// Always introduce:
// - basic concepts
// - fundamental knowledge
// - beginner tools

// before advanced topics.

// EXCEPTION:
// If a skill score is strong, skip beginner topics and start from intermediate or advanced usage.

// --------------------------------------------------

// CURRICULUM DESIGN RULE

// Design the roadmap like a professional course curriculum.

// Each month must build on knowledge from previous months.

// The roadmap should feel like a structured training program.

// --------------------------------------------------

// TOPIC DISTRIBUTION RULE

// Topics per month must vary depending on topic difficulty.

// Allowed range:

// Minimum topics per month: 3  
// Maximum topics per month: 7  

// Difficulty balancing:

// Beginner months → 5–7 topics  
// Intermediate months → 4–6 topics  
// Advanced months → 3–4 topics  

// IMPORTANT:

// Do NOT generate the same number of topics every month.

// Topic count must adapt based on topic complexity.

// --------------------------------------------------

// TOPIC STRUCTURE RULE

// Topics MUST follow this structure:

// "Topics":[
// {
// "title":"Topic title",
// "points":[
// "subpoint explaining concept",
// "subpoint explaining concept",
// "subpoint explaining concept",
// "subpoint explaining concept"
// ]
// }
// ]

// Each topic must contain 4–6 learning points.

// Points should explain:

// - concept understanding
// - practical usage
// - tools or technologies
// - best practices
// - real-world applications

// --------------------------------------------------

// PROJECT BASED LEARNING RULE

// Each month MUST include practical tasks.

// Tasks should include:

// - hands-on exercises
// - mini projects
// - real-world implementations
// - practice assignments

// --------------------------------------------------

// RESOURCE QUALITY RULE

// Resources must prioritize:

// - official documentation
// - trusted books
// - well-known courses
// - widely used learning platforms

// --------------------------------------------------

// LINK RULE (MANDATORY)

// For every resource name inside "Resources",
// include its clickable link inside "Resources-link".

// Both arrays MUST match in length and order.

// Links MUST start with:

// https://

// If official link is unknown, use:

// https://www.google.com/search?q=RESOURCE_NAME

// --------------------------------------------------

// OUTPUT RULES

// Output MUST be valid JSON ONLY.

// No markdown  
// No backticks  
// No explanations  
// No extra text

// --------------------------------------------------

// JSON STRUCTURE YOU MUST ALWAYS FOLLOW

// {
// "title":"Job title",

// "1. Job Role Overview":"job role overview",

// "2. Skills Breakdown":{
// "SkillName":"skill explanation"
// },

// "3. Month-by-Month Roadmap":{

// "Month 1":{
// "Topics":[
// {"title":"Topic","points":["point","point","point","point"]}
// ],
// "Resources":["resource name"],
// "Resources-link":["resource name - https://link.com"],
// "Tasks":["tasks"]
// },

// "Month 2":{
// "Topics":[
// {"title":"Topic","points":["point","point","point","point"]}
// ],
// "Resources":["resource name"],
// "Resources-link":["resource name - https://link.com"],
// "Tasks":["tasks"]
// }

// },

// "4. Learning Resources":{
// "Books":["book name"],
// "Books-link":["book name - https://link.com"],

// "Online Courses":["course name"],
// "Online Courses-link":["course name - https://link.com"],

// "Documentation":["documentation name"],
// "Documentation-link":["documentation name - https://link.com"],

// "Youtube Tutorials":["youtube tutorial name"],
// "Youtube Tutorials-link":["youtube tutorial name - https://link.com"]
// },

// "5. Capstone Project":{
// "Project Idea":"project idea",
// "Features":["feature","feature","feature"],
// "Technologies":["technology","technology"]
// },

// "6. Extra Tips":{
// "Community":"community details",
// "Practice":"practice tips",
// "Networking":"networking tips"
// }

// }

// Formatting:
// Return minified JSON only.

// Ensure the JSON is directly parsable with JSON.parse().

// Return only the JSON.
// `;







// const systemPromptSimple = `
// You are a Professional AI Roadmap Generator.

// Your job is to generate a learning roadmap ONLY in strict raw JSON format.
// No explanations, no markdown, no comments, no extra characters.

// 📋 Input Parameters:
// - Job Role: ${formData?.jobRole}
// - Required Skills: ${formData?.skills}
// - Duration in Months: ${formData?.duration || 6}

// --------------------------------------------------

// LEARNING SEQUENCE RULE (VERY IMPORTANT):

// The roadmap must follow a natural step-by-step learning progression based on prerequisites and topic difficulty.

// Do NOT randomly generate topics.

// Topics must follow this structured learning order:

// Step 1 — Foundations / Basics
// - fundamental concepts
// - terminology
// - basic tools
// - beginner understanding

// Step 2 — Core Concepts
// - essential skills required for the domain
// - key techniques
// - basic workflows

// Step 3 — Intermediate Skills
// - deeper understanding of the concepts
// - practical implementations
// - real-world usage

// Step 4 — Advanced Topics
// - optimization
// - performance
// - architecture
// - complex systems

// Step 5 — Real-world Applications
// - real-world projects
// - integrations
// - production-level practices

// Step 6 — Professional Level
// - deployment
// - scaling
// - best practices
// - industry workflows

// IMPORTANT:
// Earlier months must focus on foundational topics before moving to advanced topics.

// --------------------------------------------------

// PREREQUISITE RULE:

// Topics must follow dependency order.

// A topic should only appear AFTER its prerequisite topics are covered.

// Examples:
// Basic concepts → before advanced techniques  
// Core tools → before frameworks  
// Programming basics → before libraries/frameworks  
// Foundations → before optimization  

// Do NOT skip foundational knowledge.

// --------------------------------------------------

// FOUNDATION RULE:

// Do NOT start directly with frameworks, advanced tools, or complex systems.

// Always introduce:
// - basic concepts
// - fundamental knowledge
// - beginner tools

// before moving to advanced topics.

// --------------------------------------------------

// CURRICULUM DESIGN RULE:

// Design the roadmap like a structured professional course syllabus.

// Each month must build on knowledge from previous months.

// The roadmap should feel like a professional training program.

// --------------------------------------------------

// TOPIC DISTRIBUTION RULE:

// Topics per month must vary depending on topic difficulty.

// Allowed range:
// Minimum topics per month: 3
// Maximum topics per month: 7

// Difficulty balancing:

// Beginner months
// 5–7 topics (simpler concepts)

// Intermediate months
// 4–6 topics

// Advanced months
// 3–4 topics (topics are deeper and require more time)

// IMPORTANT:
// Do NOT generate the same number of topics every month.

// Topic count must adapt based on complexity.

// --------------------------------------------------

// SUBPOINT RULE:

// Each topic must contain 4–6 bullet points explaining what to study.

// Subpoints should include:
// - concept explanation
// - practical usage
// - tools or technologies
// - best practices
// - real-world applications

// --------------------------------------------------

// PROJECT BASED LEARNING RULE:

// Each month must include practical tasks.

// Tasks should include:
// - mini projects
// - exercises
// - real-world implementations
// - practice assignments

// --------------------------------------------------

// TOPIC STRUCTURE RULE:

// Topics MUST be objects with this format:

// "Topics":[
// {
// "title":"Topic title",
// "points":[
// "subpoint explaining concept",
// "subpoint explaining concept",
// "subpoint explaining concept",
// "subpoint explaining concept"
// ]
// }
// ]

// --------------------------------------------------

// RESOURCE QUALITY RULE:

// Resources must prioritize:

// - official documentation
// - well-known books
// - trusted online courses
// - widely used platforms

// --------------------------------------------------

// LINK RULE (MANDATORY):

// For every resource name inside "Resources",
// you MUST include its clickable link inside "Resources-link".

// Both arrays must match in length and order.

// Links must start with "https://".

// If the official link is unknown, use:

// https://www.google.com/search?q=RESOURCE_NAME

// --------------------------------------------------

// OUTPUT RULES:

// Output MUST be valid JSON ONLY.

// No markdown  
// No backticks  
// No explanations  
// No extra text

// --------------------------------------------------

// JSON STRUCTURE YOU MUST FOLLOW:

// {
// "title":"Job title",

// "1. Job Role Overview":"job role overview",

// "2. Skills Breakdown":{
// "SkillName":"skill explanation"
// },

// "3. Month-by-Month Roadmap":{

// "Month 1":{
// "Topics":[
// {"title":"Topic","points":["point","point","point","point"]}
// ],
// "Resources":["resource name"],
// "Resources-link":["resource name - https://link.com"],
// "Tasks":["tasks"]
// },

// "Month 2":{
// "Topics":[
// {"title":"Topic","points":["point","point","point","point"]}
// ],
// "Resources":["resource name"],
// "Resources-link":["resource name - https://link.com"],
// "Tasks":["tasks"]
// }

// },

// "4. Learning Resources":{
// "Books":["book name"],
// "Books-link":["book name - https://link.com"],

// "Online Courses":["course name"],
// "Online Courses-link":["course name - https://link.com"],

// "Documentation":["documentation name"],
// "Documentation-link":["documentation name - https://link.com"],

// "Youtube Tutorials":["youtube tutorial name"],
// "Youtube Tutorials-link":["youtube tutorial name - https://link.com"]
// },

// "5. Capstone Project":{
// "Project Idea":"project idea",
// "Features":["feature","feature","feature"],
// "Technologies":["technology","technology"]
// },

// "6. Extra Tips":{
// "Community":"community details",
// "Practice":"practice tips",
// "Networking":"networking tips"
// }

// }

// Formatting:
// Return minified JSON only.

// Now generate the roadmap in STRICT JSON.
// `;

//     const API_URI = "https://text.pollinations.ai/openai";

//     // const response = await fetch(API_URI, {
//     //   method: "POST",
//     //   headers: {
//     //     Authorization: `Bearer ${process.env.AI_API_TOKEN_POLLINATIONS}`,
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify({
//     //     model,
//     //     messages: [{ role: "system", content: systemPrompt }],
//     //   }),
//     // });

//     // const data = await response.json();
//     // // console.log(data);
//     // const roadmap =

//     //   data?.choices?.[0]?.message?.content || "No roadmap generated.";


//     const systemPrompt =
//       type === "smart" ? systemPromptSmart : systemPromptSimple;
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.SITE_BASE_URL || "http://localhost:3000",
//         "X-Title": "HireMind AI Interviewer"

//       },
//       body: JSON.stringify({
//         model: "openai/gpt-4o-mini",
//         temperature: 0.7,
//         messages: [
//           {
//             role: "system",
//             content: systemPrompt,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const err = await response.text();
//       throw new Error(`OpenRouter error: ${response.status} ${err}`);
//     }

//     const data = await response.json();
//     const rawContent = data.choices[0].message.content || "No roadmap generated.";
//     const cleaned = rawContent
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let parsed;

//     try {
//       parsed = JSON.parse(cleaned);
//     } catch (error) {
//       return new Response(JSON.stringify({
//         error: "Invalid JSON from AI",
//         raw: rawContent
//       }), { status: 500 });
//     }

//     console.log('parsed',parsed)
//     return new Response(JSON.stringify({ roadmap: parsed }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.log("Report generation error:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to generate roadmap" }),
//       {
//         status: 500,
//       }
//     );
//   }
// }






async function generateRoadmapWithRetry(systemPrompt: string, retries = 3) {

  try {

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
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error: ${response.status} ${err}`);
    }

    const data = await response.json();

    const rawContent =
      data?.choices?.[0]?.message?.content || "No roadmap generated.";

    const cleaned = rawContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return parsed;

  } catch (error) {

    if (retries > 0) {

      console.log("AI retry attempt:", retries);

      await new Promise((r) => setTimeout(r, 2000));

      return generateRoadmapWithRetry(systemPrompt, retries - 1);
    }

    throw error;
  }
}



export async function POST(req: Request) {
  try {

    const body = await req.json()

    let type = 'simple'
    let formData;
    let results;

    if (body.type === "smart") {
      type = "smart";
      formData = body.formData;
      results = body.results;
    } else {
      type = "simple";
      formData = body.roadmapDetails;
    }

    if (formData) console.log('formData', formData, results)

    const model = "mistral";

    console.log(JSON.stringify(results))


    /* ------------------- YOUR PROMPTS (UNCHANGED) ------------------- */

    const systemPromptSmart = `
You are a Professional AI Roadmap Generator.

Your job is to generate a learning roadmap ONLY in strict raw JSON format.
No explanations, no markdown, no comments, no extra characters.

📋 Input Parameters:
- Job Role: ${formData?.jobRole}
- Required Skills: ${formData?.skills}
- Duration in Months: ${formData?.duration || 6}

📊 Skill Assessment Results:
${JSON.stringify(results)}

--------------------------------------------------

SKILL SCORE RULES

Score >= 80 → Strong skill  
Score 50–79 → Moderate skill  
Score < 50 → Weak skill  

--------------------------------------------------

SMART ROADMAP PRIORITY RULES

1. Weak skills MUST receive the highest learning priority.
2. Moderate skills should include intermediate learning and practice.
3. Strong skills should only include advanced usage, optimization, or projects.
4. Avoid repeating beginner topics for strong skills.
5. Focus primarily on skills required for the target job role.

--------------------------------------------------

LEARNING SEQUENCE RULE (VERY IMPORTANT)

The roadmap must follow a natural step-by-step progression based on difficulty and prerequisites.

Topics must follow this order:

Step 1 — Foundations / Basics
Step 2 — Core Concepts
Step 3 — Intermediate Skills
Step 4 — Advanced Concepts
Step 5 — Real-world Applications
Step 6 — Professional Level Practices

Earlier months MUST focus on foundational knowledge before moving to advanced topics.

--------------------------------------------------

PREREQUISITE RULE

Topics must follow dependency order.

Examples:

basic concepts → before advanced concepts  
core tools → before frameworks  
fundamentals → before optimization  

A topic should only appear AFTER its prerequisite knowledge is covered.

--------------------------------------------------

FOUNDATION RULE

Do NOT start directly with frameworks or advanced tools.

Always introduce:
- basic concepts
- fundamental knowledge
- beginner tools

before advanced topics.

EXCEPTION:
If a skill score is strong, skip beginner topics and start from intermediate or advanced usage.

--------------------------------------------------

CURRICULUM DESIGN RULE

Design the roadmap like a professional course curriculum.

Each month must build on knowledge from previous months.

The roadmap should feel like a structured training program.

--------------------------------------------------

TOPIC DISTRIBUTION RULE

Topics per month must vary depending on topic difficulty.

Allowed range:

Minimum topics per month: 3  
Maximum topics per month: 7  

Difficulty balancing:

Beginner months → 5–7 topics  
Intermediate months → 4–6 topics  
Advanced months → 3–4 topics  

IMPORTANT:

Do NOT generate the same number of topics every month.

Topic count must adapt based on topic complexity.

--------------------------------------------------

TOPIC STRUCTURE RULE

Topics MUST follow this structure:

"Topics":[
{
"title":"Topic title",
"points":[
"subpoint explaining concept",
"subpoint explaining concept",
"subpoint explaining concept",
"subpoint explaining concept"
]
}
]

Each topic must contain 4–6 learning points.

Points should explain:

- concept understanding
- practical usage
- tools or technologies
- best practices
- real-world applications

--------------------------------------------------

PROJECT BASED LEARNING RULE

Each month MUST include practical tasks.

Tasks should include:

- hands-on exercises
- mini projects
- real-world implementations
- practice assignments

--------------------------------------------------

RESOURCE QUALITY RULE

Resources must prioritize:

- official documentation
- trusted books
- well-known courses
- widely used learning platforms

--------------------------------------------------

LINK RULE (MANDATORY)

For every resource name inside "Resources",
include its clickable link inside "Resources-link".

Both arrays MUST match in length and order.

Links MUST start with:

https://

If official link is unknown, use:

https://www.google.com/search?q=RESOURCE_NAME

--------------------------------------------------

OUTPUT RULES

Output MUST be valid JSON ONLY.

No markdown  
No backticks  
No explanations  
No extra text

--------------------------------------------------

JSON STRUCTURE YOU MUST ALWAYS FOLLOW

{
"title":"Job title",

"1. Job Role Overview":"job role overview",

"2. Skills Breakdown":{
"SkillName":"skill explanation"
},

"3. Month-by-Month Roadmap":{

"Month 1":{
"Topics":[
{"title":"Topic","points":["point","point","point","point"]}
],
"Resources":["resource name"],
"Resources-link":["resource name - https://link.com"],
"Tasks":["tasks"]
},

"Month 2":{
"Topics":[
{"title":"Topic","points":["point","point","point","point"]}
],
"Resources":["resource name"],
"Resources-link":["resource name - https://link.com"],
"Tasks":["tasks"]
}

},

"4. Learning Resources":{
"Books":["book name"],
"Books-link":["book name - https://link.com"],

"Online Courses":["course name"],
"Online Courses-link":["course name - https://link.com"],

"Documentation":["documentation name"],
"Documentation-link":["documentation name - https://link.com"],

"Youtube Tutorials":["youtube tutorial name"],
"Youtube Tutorials-link":["youtube tutorial name - https://link.com"]
},

"5. Capstone Project":{
"Project Idea":"project idea",
"Features":["feature","feature","feature"],
"Technologies":["technology","technology"]
},

"6. Extra Tips":{
"Community":"community details",
"Practice":"practice tips",
"Networking":"networking tips"
}

}

Formatting:
Return minified JSON only.

Ensure the JSON is directly parsable with JSON.parse().

Return only the JSON.
`;



    const systemPromptSimple = `
You are a Professional AI Roadmap Generator.

Your job is to generate a learning roadmap ONLY in strict raw JSON format.
No explanations, no markdown, no comments, no extra characters.

📋 Input Parameters:
- Job Role: ${formData?.jobRole}
- Required Skills: ${formData?.skills}
- Duration in Months: ${formData?.duration || 6}

--------------------------------------------------

LEARNING SEQUENCE RULE (VERY IMPORTANT):

The roadmap must follow a natural step-by-step learning progression based on prerequisites and topic difficulty.

Do NOT randomly generate topics.

Topics must follow this structured learning order:

Step 1 — Foundations / Basics
- fundamental concepts
- terminology
- basic tools
- beginner understanding

Step 2 — Core Concepts
- essential skills required for the domain
- key techniques
- basic workflows

Step 3 — Intermediate Skills
- deeper understanding of the concepts
- practical implementations
- real-world usage

Step 4 — Advanced Topics
- optimization
- performance
- architecture
- complex systems

Step 5 — Real-world Applications
- real-world projects
- integrations
- production-level practices

Step 6 — Professional Level
- deployment
- scaling
- best practices
- industry workflows

IMPORTANT:
Earlier months must focus on foundational topics before moving to advanced topics.

--------------------------------------------------

PREREQUISITE RULE:

Topics must follow dependency order.

A topic should only appear AFTER its prerequisite topics are covered.

Examples:
Basic concepts → before advanced techniques  
Core tools → before frameworks  
Programming basics → before libraries/frameworks  
Foundations → before optimization  

Do NOT skip foundational knowledge.

--------------------------------------------------

FOUNDATION RULE:

Do NOT start directly with frameworks, advanced tools, or complex systems.

Always introduce:
- basic concepts
- fundamental knowledge
- beginner tools

before moving to advanced topics.

--------------------------------------------------

CURRICULUM DESIGN RULE:

Design the roadmap like a structured professional course syllabus.

Each month must build on knowledge from previous months.

The roadmap should feel like a professional training program.

--------------------------------------------------

TOPIC DISTRIBUTION RULE:

Topics per month must vary depending on topic difficulty.

Allowed range:
Minimum topics per month: 3
Maximum topics per month: 7

Difficulty balancing:

Beginner months
5–7 topics (simpler concepts)

Intermediate months
4–6 topics

Advanced months
3–4 topics (topics are deeper and require more time)

IMPORTANT:
Do NOT generate the same number of topics every month.

Topic count must adapt based on complexity.

--------------------------------------------------

SUBPOINT RULE:

Each topic must contain 4–6 bullet points explaining what to study.

Subpoints should include:
- concept explanation
- practical usage
- tools or technologies
- best practices
- real-world applications

--------------------------------------------------

PROJECT BASED LEARNING RULE:

Each month must include practical tasks.

Tasks should include:
- mini projects
- exercises
- real-world implementations
- practice assignments

--------------------------------------------------

TOPIC STRUCTURE RULE:

Topics MUST be objects with this format:

"Topics":[
{
"title":"Topic title",
"points":[
"subpoint explaining concept",
"subpoint explaining concept",
"subpoint explaining concept",
"subpoint explaining concept"
]
}
]

--------------------------------------------------

RESOURCE QUALITY RULE:

Resources must prioritize:

- official documentation
- well-known books
- trusted online courses
- widely used platforms

--------------------------------------------------

LINK RULE (MANDATORY):

For every resource name inside "Resources",
you MUST include its clickable link inside "Resources-link".

Both arrays must match in length and order.

Links must start with "https://".

If the official link is unknown, use:

https://www.google.com/search?q=RESOURCE_NAME

--------------------------------------------------

OUTPUT RULES:

Output MUST be valid JSON ONLY.

No markdown  
No backticks  
No explanations  
No extra text

--------------------------------------------------

JSON STRUCTURE YOU MUST FOLLOW:

{
"title":"Job title",

"1. Job Role Overview":"job role overview",

"2. Skills Breakdown":{
"SkillName":"skill explanation"
},

"3. Month-by-Month Roadmap":{

"Month 1":{
"Topics":[
{"title":"Topic","points":["point","point","point","point"]}
],
"Resources":["resource name"],
"Resources-link":["resource name - https://link.com"],
"Tasks":["tasks"]
},

"Month 2":{
"Topics":[
{"title":"Topic","points":["point","point","point","point"]}
],
"Resources":["resource name"],
"Resources-link":["resource name - https://link.com"],
"Tasks":["tasks"]
}

},

"4. Learning Resources":{
"Books":["book name"],
"Books-link":["book name - https://link.com"],

"Online Courses":["course name"],
"Online Courses-link":["course name - https://link.com"],

"Documentation":["documentation name"],
"Documentation-link":["documentation name - https://link.com"],

"Youtube Tutorials":["youtube tutorial name"],
"Youtube Tutorials-link":["youtube tutorial name - https://link.com"]
},

"5. Capstone Project":{
"Project Idea":"project idea",
"Features":["feature","feature","feature"],
"Technologies":["technology","technology"]
},

"6. Extra Tips":{
"Community":"community details",
"Practice":"practice tips",
"Networking":"networking tips"
}

}

Formatting:
Return minified JSON only.

Now generate the roadmap in STRICT JSON.
`;



    const systemPrompt =
      type === "smart" ? systemPromptSmart : systemPromptSimple;


    // AI CALL WITH RETRY 

    const parsed = await generateRoadmapWithRetry(systemPrompt);

    // console.log('parsed', parsed)

    return new Response(JSON.stringify({ roadmap: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.log("Report generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate roadmap" }),
      {
        status: 500,
      }
    );
  }
}