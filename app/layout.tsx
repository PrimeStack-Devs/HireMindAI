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
  applicationName: "HireMind",

  title: {
    default: "HireMind | AI Mock Interview Practice Platform",
    template: "%s | HireMind",
  },

  description:
    "HireMind is an AI mock interview platform that helps you practice real interview questions, get instant feedback, and improve performance in technical and HR interviews.",

  keywords: [
    "HireMind",
    "HireMind AI",
    "AI interview practice",
    "mock interview AI",
    "AI interviewer",
    "interview preparation platform",
    "technical interview practice",
    "AI interview coach",
    "HR interview practice",
  ],

  authors: [{ name: "HireMind" }],
  creator: "HireMind",
  publisher: "HireMind",
  category: "education",

  openGraph: {
    title: "HireMind | Practice Interviews with AI",
    description:
      "Practice interviews with an AI interviewer, receive feedback reports, and improve your chances of getting hired.",
    url: "https://hiremind.io",
    siteName: "HireMind",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HireMind interview practice platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HireMind | AI Interview Practice",
    description:
      "Prepare for interviews with AI-powered mock interviews and feedback reports.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
      
      
      <body className="font-sans relative min-h-screen">
        {/* MediaPipe scripts */}
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" />
        <Script
          id="hiremind-app-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "HireMind",
              alternateName: "HireMind AI",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              description:
                "HireMind is an AI-powered interview preparation platform that helps candidates practice mock interviews and get real-time feedback.",
              url: "https://hiremind.io",
              creator: {
                "@type": "Organization",
                name: "HireMind",
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
