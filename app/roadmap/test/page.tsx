"use client";

import TrueFocus from "@/components/TrueFocus";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>();

  const router = useRouter();

  /* ---------------- LOAD QUESTIONS ---------------- */

  useEffect(() => {
    const stored = localStorage.getItem("smartTest");
    const storedFormData = localStorage.getItem("roadmapDetails");

    if (stored) {
      const parsed = JSON.parse(stored);
      setQuestions(parsed);
      setAnswers(new Array(parsed.length).fill(null));
    }

    if (storedFormData) {
      const parsed = JSON.parse(storedFormData);
      setFormData(parsed);
    }
  }, []);

  /* Restore selected option when question changes */

  useEffect(() => {
    if (answers[current] !== null && answers[current] !== undefined) {
      setSelected(answers[current]);
    } else {
      setSelected(null);
    }
  }, [current]);

  /* ---------------- ACTIONS ---------------- */

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleNext = () => {
    const updated = [...answers];
    updated[current] = selected as number;

    setAnswers(updated);
    setCurrent(current + 1);
  };

  const handlePrevious = () => {
    const updated = [...answers];
    updated[current] = selected as number;

    setAnswers(updated);

    const prevIndex = current - 1;

    setCurrent(prevIndex);
    setSelected(updated[prevIndex]);
  };

  /* ---------------- SUBMIT TEST ---------------- */

  const handleSubmit = async () => {
    const updated = [...answers];
    updated[current] = selected as number;

    setAnswers(updated);
    setLoading(true);

    /* ---------- SKILL + TOPIC SCORE CALCULATION ---------- */

    const skillStats: any = {};

    questions.forEach((q, index) => {
      const skill = q.section;
      const topic = q.topic;

      if (!skillStats[skill]) {
        skillStats[skill] = {
          total: 0,
          correct: 0,
          topics: {},
        };
      }

      if (!skillStats[skill].topics[topic]) {
        skillStats[skill].topics[topic] = {
          total: 0,
          correct: 0,
        };
      }

      skillStats[skill].total += 1;
      skillStats[skill].topics[topic].total += 1;

      if (updated[index] === q.correctAnswerIndex) {
        skillStats[skill].correct += 1;
        skillStats[skill].topics[topic].correct += 1;
      }
    });

    /* ---------- GENERATE FINAL RESULTS ---------- */

    const sectionResults: any = {};

    Object.keys(skillStats).forEach((skill) => {
      const skillData = skillStats[skill];

      const skillPercentage = Math.round(
        (skillData.correct / skillData.total) * 100
      );

      let skillLevel = "weak";

      if (skillPercentage > 70) skillLevel = "strong";
      else if (skillPercentage > 40) skillLevel = "moderate";

      const topicResults: any = {};

      Object.keys(skillData.topics).forEach((topic) => {
        const topicData = skillData.topics[topic];

        const topicScore = Math.round(
          (topicData.correct / topicData.total) * 100
        );

        let topicLevel = "weak";

        if (topicScore > 70) topicLevel = "strong";
        else if (topicScore > 40) topicLevel = "moderate";

        topicResults[topic] = {
          score: topicScore,
          level: topicLevel,
        };
      });

      sectionResults[skill] = {
        score: skillPercentage,
        level: skillLevel,
        topics: topicResults,
      };
    });

    // console.log("Skill + Topic Results:", sectionResults);

    /* ---------- SEND TO AI ---------- */

    try {
      const res = await fetch("/api/interview/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "smart",
          results: sectionResults,
          formData: formData,
        }),
      });

      const data = await res.json();

      if (data && data.roadmap) {
        localStorage.setItem("roadmap", JSON.stringify(data?.roadmap));

        router.push("/roadmap/smart");
      } else {
        alert("Roadmap not generated. Please try again.");
        router.push("/roadmap/smart");
      }


    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ---------------- LOADING ---------------- */

  if (!questions.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Test...
      </div>
    );
  }

  const q = questions[current];

  const progress = ((current + 1) / questions.length) * 100;


  //UI

  return (
    <div className="h-screen bg-gradient-to-br from-background to-blue-950 py-8 px-4">

      {
        !loading ? (

          <div className="max-w-4xl mx-auto">

            {/* HEADER */}

            <div className="mb-8">

              <div className="flex justify-between">

                <h1 className="text-xl font-bold text-primary">
                  Smart Skill Assessment
                </h1>

                <div className="text-right">

                  <p className="text-sm text-muted-foreground">
                    Progress
                  </p>

                  <p className="text-lg font-bold text-primary">
                    {current + 1} / {questions?.length}
                  </p>

                </div>

              </div>

            </div>

            {/* QUESTION CARD */}

            <div className="border border-border rounded-xl p-8 bg-card">

              <p className="text-primary mb-2">
                Question {current + 1} of {questions?.length}
              </p>

              {/* Skill + Topic */}

              <div className="mb-4">
                <p className="text-xs text-muted-foreground">
                  {q.section} • {q.topic}
                </p>

                <h2 className="text-lg font-bold mt-1">
                  {q.question}
                </h2>
              </div>

              {/* OPTIONS */}

              <div className="space-y-3 mb-8">

                {q.options.map((opt: string, i: number) => {

                  const isSelected = selected === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full p-4 border rounded-lg text-left transition
                  
                  ${isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                        }`}
                    >
                      {opt}
                    </button>
                  );
                })}

              </div>

              {/* NAVIGATION */}

              <div className="flex justify-between">

                {current > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 bg-primary text-black border border-border rounded-lg hover:cursor-pointer hover:bg-primary/90"
                  >
                    Previous
                  </button>
                )}

                <div className="ml-auto">

                  {current < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={selected === null}
                      className="px-6 py-2 bg-primary text-black rounded-lg hover:cursor-pointer hover:bg-primary/90"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={selected === null || loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:cursor-pointer hover:bg-green-600/90"
                    >
                      {loading
                        ? "Generating Roadmap..."
                        : "Submit Test"}
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>














        ) : (

          <div>
            <div className="flex justify-center flex-col gap-8 items-center w-full h-[80vh]">
              {/* <div style={{ width: "25%", height: "150px" }}>
                        <Orb
                          hoverIntensity={0.5}
                          rotateOnHover={true}
                          hue={0}
                          forceHoverState={false}
                        />
                      </div> */}
              <TrueFocus
                sentence="Finalizing Roadmap..."
                manualMode={false}
                blurAmount={5}
                borderColor="blue"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
          </div>

        )
      }



    </div>
  );
}