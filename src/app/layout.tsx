import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Plainly AI: Practical AI for Small Businesses",
  description: "Plainly AI helps small UK businesses use AI tools confidently, from team training on ChatGPT and Copilot, to custom automations that actually work.",
  keywords: "AI training, small business AI, ChatGPT training, Microsoft Copilot, AI automation, Birmingham UK",
  openGraph: {
    title: "Plainly AI: Practical AI for Small Businesses",
    description: "Helping small UK businesses use AI tools confidently, from team training to custom automations.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} style={{ fontFamily: 'var(--font-inter), var(--font-sans)' }}>
        {children}
      </body>
    </html>
  );
}
