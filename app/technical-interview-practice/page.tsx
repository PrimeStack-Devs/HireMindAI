import Script from "next/script";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import {
  buildSeoJsonLd,
  buildSeoMetadata,
  getSeoPage,
} from "@/lib/seo-pages";

const page = getSeoPage("technical-interview-practice")!;

export const metadata = buildSeoMetadata(page);

export default function TechnicalInterviewPracticePage() {
  return (
    <>
      <Script
        id="technical-interview-practice-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoJsonLd(page)) }}
      />
      <SeoLandingPage
        eyebrow={page.eyebrow}
        title={`${page.title} for Software Roles`}
        description={page.description}
        benefits={page.benefits}
        sections={page.sections}
        faq={page.faq}
        primaryCta={{ href: "/create-interview", label: "Practice Technical Interviews" }}
        secondaryCta={{ href: "/roadmap-chat", label: "Explore Preparation Tools" }}
      />
    </>
  );
}
