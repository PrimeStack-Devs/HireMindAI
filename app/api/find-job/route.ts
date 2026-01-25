import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { candidateDetails } = await req.json();
        const { jobRole, skills = [] } = candidateDetails;

        if (!jobRole) {
            return NextResponse.json(
                { error: "Job role is required" },
                { status: 400 }
            );
        }

        const keywords = skills.length
            ? `${jobRole} ${skills.join(" ")}`
            : jobRole;

        const joobleResponse = await fetch(
            `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    keywords,
                    location: "India",
                    days: 7,
                }),
            }
        );

        if (!joobleResponse.ok) {
            const text = await joobleResponse.text();
            console.error("Jooble error:", joobleResponse.status, text);
            return NextResponse.json(
                { error: "Failed to fetch jobs from Jooble" },
                { status: 502 }
            );
        }

        const data = await joobleResponse.json();
        console.log("Jooble API Response:", data);

  
        return NextResponse.json({
            totalCount: data.totalCount,
            jobs: data.jobs,
        });
          
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
