import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Enablr: Practical AI for Small Businesses",
    template: "%s | Enablr",
  },
  description: "Enablr helps small UK businesses use AI tools confidently, from team training on ChatGPT and Copilot, to custom automations that actually work.",
  applicationName: "Enablr",
  keywords: "AI training, small business AI, ChatGPT training, Microsoft Copilot, AI automation, Birmingham UK",
  openGraph: {
    title: "Enablr: Practical AI for Small Businesses",
    description: "Helping small UK businesses use AI tools confidently, from team training to custom automations.",
    siteName: "Enablr",
    type: "website",
    locale: "en_GB",
  },
  appleWebApp: {
    title: "Enablr",
    statusBarStyle: "default",
  },
};

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
