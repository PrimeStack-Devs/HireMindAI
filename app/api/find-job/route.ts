// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const { candidateDetails } = await req.json();
//         const { jobRole, skills = [] } = candidateDetails;

//         if (!jobRole) {
//             return NextResponse.json(
//                 { error: "Job role is required" },
//                 { status: 400 }
//             );
//         }

//         const keywords = skills.length
//             ? `${jobRole} ${skills.join(" ")}`
//             : jobRole;

//         const joobleResponse = await fetch(
//             `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     keywords,
//                     location: "India",
//                     days: 7,
//                 }),
//             }
//         );

//         if (!joobleResponse.ok) {
//             const text = await joobleResponse.text();
//             console.error("Jooble error:", joobleResponse.status, text);
//             return NextResponse.json(
//                 { error: "Failed to fetch jobs from Jooble" },
//                 { status: 502 }
//             );
//         }

//         const data = await joobleResponse.json();
//         console.log("Jooble API Response:", data);

  
//         return NextResponse.json({
//             totalCount: data.totalCount,
//             jobs: data.jobs,
//         });
          
//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json(
//             { error: "Something went wrong. Please try again." },
//             { status: 500 }
//         );
//     }
// }
import { NextRequest, NextResponse } from "next/server";
 

const SUPPORTED_COUNTRIES: Record<string, string> = {
  in: "in",
  gb: "gb",
  us: "us",
  ca: "ca",
  au: "au",
};

function resolveCountry(country?: string) {
  if (!country) return "in";
  const key = country.toLowerCase();
  return SUPPORTED_COUNTRIES[key] ?? "in";
}

 

export async function POST(req: NextRequest) {
  try {
    const { candidateDetails } = await req.json();

    const {
      jobRole,
      skills = [],
      location,
      distance=100,
      country,
      page = 1,
      jobType = "full_time",  
      maxDaysOld = 30,
      resultsPerPage = 10,
    } = candidateDetails;

    if (!jobRole) {
      return NextResponse.json(
        { error: "Job role is required" },
        { status: 400 }
      );
    }

     
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) {
      console.error("Missing Adzuna credentials");
      return NextResponse.json(
        { error: "Adzuna credentials not configured" },
        { status: 500 }
      );
    }

   
    const resolvedCountry = resolveCountry(country);

    
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: resultsPerPage.toString(),
       
      what: [jobRole, ...skills].join(" "),
      max_days_old: maxDaysOld.toString(),
    });

    
    if (location) {
      params.append("where", location);}

      
      if (distance &&resolvedCountry !== "in") {
        params.append("distance", distance.toString());
      }
    // }

 
    if (jobType === "full_time") params.append("full_time", "1");
    if (jobType === "part_time") params.append("part_time", "1");
    if (jobType === "contract") params.append("contract", "1");
    if (jobType === "permanent") params.append("permanent", "1");
// console.log("params",params)
  
    const url = `https://api.adzuna.com/v1/api/jobs/${resolvedCountry}/search/${page}?${params}`;
    // console.log("Adzuna URL:", url);
console.log("url",url)
    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok) {
      console.error("Adzuna error:", res.status, text);
      return NextResponse.json(
        {
          error: "Adzuna request failed",
          status: res.status,
          details: text,
        },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    // console.log("Adzuna API Response:", data);

     
    const jobs = (data.results || []).map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown company",
      location: job.location?.display_name || resolvedCountry.toUpperCase(),
      jobType: job.contract_time || job.contract_type || "Not specified",
      source: job.category?.label || "Adzuna",
      postedDate: job.created
        ? new Date(job.created).toLocaleDateString()
        : "Recently",
      description: (job.description || "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      applyLink: job.redirect_url,
    }));

    return NextResponse.json({
      totalCount: data.count,
      page,
      country: resolvedCountry,
      jobs,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
