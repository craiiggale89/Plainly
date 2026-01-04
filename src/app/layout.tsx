import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  // auto-seed homepage if missing
  const homepage = await prisma.contentPage.upsert({
    where: { url: 'https://enablr.digital/' },
    update: {
      // track views on load? possibly, but better in analytics middleware or separate event
      // here we just ensure it exists for SEO editing
    },
    create: {
      title: "Enablr: Practical AI for Small Businesses",
      url: "https://enablr.digital/",
      primaryTopic: "AI training",
      status: "published",
      aiSummary: "Enablr helps small UK businesses use AI tools confidently, from team training on ChatGPT and Copilot, to custom automations that actually work.",
      suggestedKeywords: ["AI training", "small business AI", "ChatGPT training", "Microsoft Copilot", "AI automation", "Birmingham UK"],
      notes: "Auto-generated homepage record"
    }
  });

  return {
    title: {
      default: homepage.title || "Enablr: Practical AI for Small Businesses",
      template: "%s | Enablr",
    },
    description: homepage.aiSummary || "Enablr helps small UK businesses use AI tools confidently, from team training on ChatGPT and Copilot, to custom automations that actually work.",
    applicationName: "Enablr",
    keywords: homepage.suggestedKeywords ? (homepage.suggestedKeywords as string[]).join(", ") : "AI training, small business AI, ChatGPT training, Microsoft Copilot, AI automation, Birmingham UK",
    openGraph: {
      title: homepage.title || "Enablr: Practical AI for Small Businesses",
      description: homepage.aiSummary || "Helping small UK businesses use AI tools confidently, from team training to custom automations.",
      siteName: "Enablr",
      type: "website",
      locale: "en_GB",
    },
    appleWebApp: {
      title: "Enablr",
      statusBarStyle: "default",
    },
  };
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
