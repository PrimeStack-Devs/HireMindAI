import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import ToastProvider from "@/providers/ToastProvider";
import AuthProvider from "@/components/provider/next-auth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Script from "next/script";
import LayoutShell from "@/components/LayoutShell";
import 'quill/dist/quill.snow.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://hiremind.io"),

  title: {
    default: "HireMind AI - AI Interview Practice & Mock Interview Platform",
    template: "%s | HireMind AI",
  },

  description:
    "HireMind AI helps you practice real interview questions with an AI interviewer. Get feedback, performance reports, and improve your chances of cracking technical and HR interviews.",

  keywords: [
    "AI interview practice",
    "mock interview AI",
    "AI interviewer",
    "interview preparation platform",
    "technical interview practice",
    "AI interview coach",
    "hiremind",
  ],

  authors: [{ name: "HireMind AI" }],
  creator: "HireMind AI",
  publisher: "HireMind AI",

  openGraph: {
    title: "HireMind AI - Practice Interviews with AI",
    description:
      "Practice interviews with an AI interviewer, receive feedback reports, and improve your chances of getting hired.",
    url: "https://hiremind.io",
    siteName: "HireMind AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireMind AI Interview Practice",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HireMind AI - AI Interview Practice",
    description:
      "Prepare for interviews with AI-powered mock interviews and feedback reports.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/logo/favicon.jpeg",
  },
  alternates: {
    canonical: "https://hiremind.io",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      
      <link rel="icon" href="/logo/favicon.jpeg" />
      
      <body className="font-sans relative min-h-screen">
        {/* MediaPipe scripts */}
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "HireMind AI",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              description:
                "HireMind AI is an AI-powered interview preparation platform that helps candidates practice mock interviews and get real-time feedback.",
              url: "https://hiremind.io",
              creator: {
                "@type": "Organization",
                name: "HireMind AI",
              },
            }),
          }}
        />
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense>
              <ToastProvider />
              <LayoutShell>
                {children}
              </LayoutShell>
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
