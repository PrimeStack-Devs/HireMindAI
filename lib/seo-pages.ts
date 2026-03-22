import type { Metadata } from "next";

type SeoPageData = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  benefits: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

const baseUrl = "https://hiremind.io";

export const seoPages: SeoPageData[] = [
  {
    slug: "ai-mock-interview",
    title: "AI Mock Interview",
    description:
      "Practice with HireMind's AI mock interview platform to simulate real interview rounds, improve communication, and receive instant feedback reports.",
    eyebrow: "AI Mock Interview",
    benefits: [
      "Practice realistic mock interviews anytime with AI-generated questions.",
      "Review instant feedback on answers, confidence, and communication.",
      "Prepare for technical, HR, and role-specific interview rounds in one place.",
    ],
    sections: [
      {
        title: "Practice AI mock interviews that feel real",
        body:
          "HireMind helps you practice AI mock interviews with role-aware questions and a guided interview flow. Instead of reading static question lists, you answer in a realistic format and build comfort under pressure.",
      },
      {
        title: "Turn every interview into a feedback loop",
        body:
          "Each mock interview session is designed to show what you did well and where you need work. HireMind highlights clarity, structure, confidence, and answer quality so you can improve from one attempt to the next.",
      },
      {
        title: "Prepare across technical and HR interview types",
        body:
          "Use the same platform to practice frontend, backend, system design, and HR interviews. That makes HireMind useful both for early screening rounds and deeper role-specific preparation.",
      },
      {
        title: "Build consistency before the real interview",
        body:
          "Consistent practice matters more than one perfect session. HireMind makes it easy to repeat interviews, compare performance, and sharpen your delivery before the actual interview day.",
      },
    ],
    faq: [
      {
        question: "What is an AI mock interview?",
        answer:
          "An AI mock interview simulates a real interview using AI-generated questions and feedback so candidates can practice before speaking to an actual recruiter or hiring manager.",
      },
      {
        question: "Can HireMind help with technical interviews?",
        answer:
          "Yes. HireMind supports technical interview practice for roles such as frontend, backend, and full-stack development, along with broader interview preparation.",
      },
      {
        question: "Is HireMind useful for beginners?",
        answer:
          "Yes. Beginners can use HireMind to get comfortable speaking answers out loud, improve confidence, and understand the structure of common interview rounds.",
      },
    ],
  },
  {
    slug: "ai-interviewer",
    title: "AI Interviewer",
    description:
      "Use HireMind as your AI interviewer to practice interview questions, improve response quality, and get actionable feedback before real interviews.",
    eyebrow: "AI Interviewer",
    benefits: [
      "Practice with an AI interviewer whenever you want without scheduling constraints.",
      "Improve how you answer follow-up questions and explain your thinking.",
      "Get a structured review after each interview attempt.",
    ],
    sections: [
      {
        title: "Your always-available AI interviewer",
        body:
          "HireMind acts as an AI interviewer that lets you practice on demand. Whether you are preparing late at night or fitting practice into short study sessions, you can run realistic interview flows without waiting for a mock interview partner.",
      },
      {
        title: "Train for better communication under pressure",
        body:
          "A strong interview answer is not only about correctness. HireMind helps you improve how you communicate ideas, stay calm, and structure responses clearly when the pressure is on.",
      },
      {
        title: "Use AI feedback to refine your answers",
        body:
          "After practicing with the AI interviewer, you get feedback that helps identify filler, weak structure, and missing detail. That gives you concrete points to improve in the next round.",
      },
      {
        title: "Suitable for repeated interview practice",
        body:
          "Interview preparation works best when it is repeated and measurable. HireMind supports regular practice so candidates can improve steadily rather than preparing only once before a key interview.",
      },
    ],
    faq: [
      {
        question: "How does an AI interviewer help me prepare?",
        answer:
          "An AI interviewer gives you a low-pressure way to practice answering questions, hear yourself speak, and learn how to improve before a live interview.",
      },
      {
        question: "Can I use HireMind instead of practicing with a friend?",
        answer:
          "Yes. HireMind is useful when you want fast, repeatable interview practice without depending on another person, though many candidates still combine both methods.",
      },
      {
        question: "Does HireMind only ask generic questions?",
        answer:
          "No. HireMind is built for broader interview preparation, including technical and role-focused practice, not only generic HR prompts.",
      },
    ],
  },
  {
    slug: "ai-interview-practice",
    title: "AI Interview Practice",
    description:
      "HireMind gives you AI interview practice for technical and HR rounds with realistic questions, instant feedback, and detailed performance reports.",
    eyebrow: "AI Interview Practice",
    benefits: [
      "Practice interviews consistently with AI-guided sessions.",
      "Improve confidence, structure, and delivery over time.",
      "Use one platform for mock interviews, feedback, and progress tracking.",
    ],
    sections: [
      {
        title: "A better way to do AI interview practice",
        body:
          "HireMind makes AI interview practice more useful by combining interactive mock interviews with feedback you can act on. Instead of passively reading questions, you practice answering them in a structured flow.",
      },
      {
        title: "Improve the skills interviewers actually notice",
        body:
          "Strong interview outcomes usually come from clear communication, good structure, and confident delivery. HireMind helps you practice those skills repeatedly so you can improve the parts recruiters and hiring managers pay attention to.",
      },
      {
        title: "Prepare for different interview stages",
        body:
          "Candidates often face screening calls, HR rounds, technical evaluations, and final interviews. HireMind supports AI interview practice across these stages so your preparation is not limited to just one format.",
      },
      {
        title: "Keep your preparation measurable",
        body:
          "A major benefit of AI interview practice is that progress can be tracked. HireMind helps you repeat practice sessions and compare results, which makes improvement easier to see over time.",
      },
    ],
    faq: [
      {
        question: "What should I look for in AI interview practice software?",
        answer:
          "Look for realistic interview flows, useful feedback, support for your target role, and a simple way to repeat practice consistently. Those are the areas HireMind focuses on.",
      },
      {
        question: "Can AI interview practice help with confidence?",
        answer:
          "Yes. Repeated practice helps candidates feel more natural, reduce hesitation, and speak more clearly during real interviews.",
      },
      {
        question: "Is HireMind useful before campus placements or job switches?",
        answer:
          "Yes. HireMind can support both students preparing for placement interviews and professionals getting ready for a new role.",
      },
    ],
  },
  {
    slug: "technical-interview-practice",
    title: "Technical Interview Practice",
    description:
      "Use HireMind for technical interview practice with AI-guided mock interviews, structured feedback, and repeated preparation for software roles.",
    eyebrow: "Technical Interview Practice",
    benefits: [
      "Practice explaining technical decisions more clearly.",
      "Prepare for frontend, backend, and full-stack interview rounds.",
      "Turn mock interview feedback into targeted improvement.",
    ],
    sections: [
      {
        title: "Technical interview practice beyond question lists",
        body:
          "HireMind supports technical interview practice in a more interactive way than static prep notes. You can practice how you explain tradeoffs, justify decisions, and communicate your technical thinking in real time.",
      },
      {
        title: "Get better at verbalizing technical knowledge",
        body:
          "Many candidates understand the topic but struggle to explain it clearly. HireMind helps you practice verbal delivery so your technical knowledge comes across in a concise and structured way during interviews.",
      },
      {
        title: "Useful for software engineering interview prep",
        body:
          "Whether you are targeting frontend, backend, or full-stack roles, technical interview practice on HireMind can help you prepare for common interview patterns and improve response quality under pressure.",
      },
      {
        title: "Make your technical prep more consistent",
        body:
          "Good technical interview preparation usually requires repetition. HireMind helps candidates practice regularly, spot recurring issues, and tighten up explanations before important interview rounds.",
      },
    ],
    faq: [
      {
        question: "Can HireMind replace coding practice?",
        answer:
          "No. Technical interview practice works best when combined with coding and problem-solving prep. HireMind complements that work by improving explanation, delivery, and interview readiness.",
      },
      {
        question: "Is HireMind good for frontend interview practice?",
        answer:
          "Yes. HireMind can support frontend interview practice along with other software roles by helping you rehearse how you answer technical and project-based questions.",
      },
      {
        question: "Why is verbal practice important for technical interviews?",
        answer:
          "Interviewers often judge both your knowledge and how clearly you communicate it. Verbal practice helps you explain decisions, architecture, and tradeoffs more effectively.",
      },
    ],
  },
  {
    slug: "hr-interview-practice",
    title: "HR Interview Practice",
    description:
      "Practice common HR interview questions with HireMind and improve confidence, communication, and answer structure before your next interview.",
    eyebrow: "HR Interview Practice",
    benefits: [
      "Practice common HR interview questions with realistic flow.",
      "Improve confidence and reduce hesitation in personal answers.",
      "Refine how you present experience, strengths, and career goals.",
    ],
    sections: [
      {
        title: "Build confidence for common HR interview questions",
        body:
          "HireMind helps candidates practice the HR interview questions that often shape first impressions. That includes questions about strengths, weaknesses, goals, teamwork, motivation, and previous experience.",
      },
      {
        title: "Improve answer structure and clarity",
        body:
          "A good HR answer should feel natural while still being clear and focused. HireMind gives you a way to practice answer structure so you can sound more confident and organized in real interviews.",
      },
      {
        title: "Prepare for screening rounds and final conversations",
        body:
          "HR interview practice is useful both at the beginning of the hiring process and later in final rounds. HireMind helps you rehearse so you can speak clearly about your background, goals, and work style at every stage.",
      },
      {
        title: "Reduce nerves with repeated practice",
        body:
          "Many candidates know what they want to say but freeze when asked live. Repeated HR interview practice with HireMind helps reduce hesitation and makes your delivery feel more natural over time.",
      },
    ],
    faq: [
      {
        question: "What is the best way to practice HR interview questions?",
        answer:
          "The best approach is to answer questions out loud, review how you sound, and repeat until your answers are clear and confident. HireMind is designed to support that workflow.",
      },
      {
        question: "Can HireMind help with freshers' HR interviews?",
        answer:
          "Yes. Freshers can use HireMind to practice common introductory and behavioral questions before campus placements or entry-level interviews.",
      },
      {
        question: "Do HR interview answers need to be memorized?",
        answer:
          "No. It is better to understand the key points you want to communicate and practice delivering them naturally, which is exactly what repeated mock interviews help with.",
      },
    ],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function buildSeoMetadata(page: SeoPageData): Metadata {
  const url = `${baseUrl}/${page.slug}`;

  return {
    title: `${page.title} | HireMind`,
    description: page.description,
    keywords: [
      "HireMind",
      "HireMind AI",
      page.title,
      `${page.title} software`,
      "AI interview practice",
      "mock interview practice",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${page.title} | HireMind`,
      description: page.description,
      url,
      siteName: "HireMind",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${page.title} on HireMind`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | HireMind`,
      description: page.description,
      images: ["/og-image.jpg"],
    },
  };
}

export function buildSeoJsonLd(page: SeoPageData) {
  const url = `${baseUrl}/${page.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url,
      description: page.description,
      isPartOf: {
        "@type": "WebSite",
        name: "HireMind",
        url: baseUrl,
      },
      about: {
        "@type": "SoftwareApplication",
        name: "HireMind",
        alternateName: "HireMind AI",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}
