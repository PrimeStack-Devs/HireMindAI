import Script from "next/script";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import {
  buildSeoJsonLd,
  buildSeoMetadata,
  getSeoPage,
} from "@/lib/seo-pages";

const page = getSeoPage("ai-mock-interview")!;

export const metadata = buildSeoMetadata(page);

export default function AiMockInterviewPage() {
  return (
    <>
      <Script
        id="ai-mock-interview-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoJsonLd(page)) }}
      />
      <SeoLandingPage
        eyebrow={page.eyebrow}
        title={`${page.title} with HireMind`}
        description={page.description}
        benefits={page.benefits}
        sections={page.sections}
        faq={page.faq}
        primaryCta={{ href: "/create-interview", label: "Start AI Mock Interview" }}
        secondaryCta={{ href: "/", label: "Explore HireMind" }}
      />
    </>
  );
}
