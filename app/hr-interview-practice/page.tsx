import Script from "next/script";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import {
  buildSeoJsonLd,
  buildSeoMetadata,
  getSeoPage,
} from "@/lib/seo-pages";

const page = getSeoPage("hr-interview-practice")!;

export const metadata = buildSeoMetadata(page);

export default function HrInterviewPracticePage() {
  return (
    <>
      <Script
        id="hr-interview-practice-schema"
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
        primaryCta={{ href: "/create-interview", label: "Practice HR Interviews" }}
        secondaryCta={{ href: "/", label: "Learn About HireMind" }}
      />
    </>
  );
}
