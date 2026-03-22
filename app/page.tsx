import type { Metadata } from "next";
import Script from "next/script";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "HireMind | AI Mock Interview Practice Platform",
  description:
    "HireMind is an AI mock interview platform that helps candidates practice technical and HR interviews with AI-generated questions, instant feedback, and detailed performance reports.",
  keywords: [
    "HireMind",
    "HireMind AI",
    "hiremind interview platform",
    "AI mock interview platform",
    "mock interview practice",
    "technical interview practice",
    "HR interview practice",
    "AI interview feedback",
  ],
  alternates: {
    canonical: "https://hiremind.io",
  },
  openGraph: {
    title: "HireMind | AI Mock Interview Practice Platform",
    description:
      "Practice technical and HR interviews with HireMind, the AI-powered mock interview platform for job seekers.",
    url: "https://hiremind.io",
    siteName: "HireMind",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireMind AI mock interview practice platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireMind | AI Mock Interview Practice Platform",
    description:
      "Practice interviews with HireMind and get AI-generated feedback, reports, and interview coaching.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HireMind",
      alternateName: "HireMind AI",
      url: "https://hiremind.io",
      logo: "https://hiremind.io/logo/favicon.jpeg",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HireMind",
      alternateName: "HireMind AI",
      url: "https://hiremind.io",
    },
  ];

  return (
    <>
      <Script
        id="hiremind-home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient />
    </>
  );
}