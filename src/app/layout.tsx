import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  // Default metadata fallback
  const defaultMeta = {
    title: "Enablr: Practical AI for Small Businesses",
    description: "Enablr helps small UK businesses use AI tools confidently, from team training on ChatGPT and Copilot, to custom automations that actually work.",
    keywords: "AI training, small business AI, ChatGPT training, Microsoft Copilot, AI automation, Birmingham UK"
  };

  try {
    // auto-seed homepage if missing
    const homepage = await prisma.contentPage.upsert({
      where: { url: 'https://enablr.digital/' },
      update: {},
      create: {
        title: defaultMeta.title,
        url: "https://enablr.digital/",
        primaryTopic: "AI training",
        status: "published",
        aiSummary: defaultMeta.description,
        suggestedKeywords: defaultMeta.keywords.split(", "),
        notes: "Auto-generated homepage record"
      }
    });

    return {
      title: {
        default: homepage.title || defaultMeta.title,
        template: "%s | Enablr",
      },
      description: homepage.aiSummary || defaultMeta.description,
      applicationName: "Enablr",
      keywords: homepage.suggestedKeywords ? (homepage.suggestedKeywords as string[]).join(", ") : defaultMeta.keywords,
      openGraph: {
        title: homepage.title || defaultMeta.title,
        description: homepage.aiSummary || defaultMeta.description,
        siteName: "Enablr",
        type: "website",
        locale: "en_GB",
      },
      appleWebApp: {
        title: "Enablr",
        statusBarStyle: "default",
      },
    };
  } catch (error) {
    // Database unavailable - return static fallback
    console.error('Metadata generation failed, using fallback:', error);
    return {
      title: {
        default: defaultMeta.title,
        template: "%s | Enablr",
      },
      description: defaultMeta.description,
      applicationName: "Enablr",
      keywords: defaultMeta.keywords,
    };
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
