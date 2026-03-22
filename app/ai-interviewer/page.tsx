import Script from "next/script";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import {
  buildSeoJsonLd,
  buildSeoMetadata,
  getSeoPage,
} from "@/lib/seo-pages";

const page = getSeoPage("ai-interviewer")!;

export const metadata = buildSeoMetadata(page);

export default function AiInterviewerPage() {
  return (
    <>
      <Script
        id="ai-interviewer-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoJsonLd(page)) }}
      />
      <SeoLandingPage
        eyebrow={page.eyebrow}
        title={`${page.title} for Interview Practice`}
        description={page.description}
        benefits={page.benefits}
        sections={page.sections}
        faq={page.faq}
        primaryCta={{ href: "/create-interview", label: "Practice with AI Interviewer" }}
        secondaryCta={{ href: "/roadmap-chat", label: "See More Features" }}
      />
    </>
  );
}
