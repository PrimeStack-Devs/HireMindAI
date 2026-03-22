import Script from "next/script";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import {
  buildSeoJsonLd,
  buildSeoMetadata,
  getSeoPage,
} from "@/lib/seo-pages";

const page = getSeoPage("ai-interview-practice")!;

export const metadata = buildSeoMetadata(page);

export default function AiInterviewPracticePage() {
  return (
    <>
      <Script
        id="ai-interview-practice-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoJsonLd(page)) }}
      />
      <SeoLandingPage
        eyebrow={page.eyebrow}
        title={`${page.title} That Builds Real Confidence`}
        description={page.description}
        benefits={page.benefits}
        sections={page.sections}
        faq={page.faq}
        primaryCta={{ href: "/create-interview", label: "Start Interview Practice" }}
        secondaryCta={{ href: "/", label: "Visit Homepage" }}
      />
    </>
  );
}
