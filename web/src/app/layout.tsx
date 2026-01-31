import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/landing/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SportsHuddle.ai - Premier League Analytics",
  description: "Premier League analytics that go beyond basic stats. Get weekly insights with 39 unique metrics across all 20 PL teams. Free newsletter with Sharp Strategy metrics.",
  keywords: ["Premier League", "football analytics", "soccer stats", "xG", "betting insights", "EPL"],
  authors: [{ name: "SportsHuddle.ai" }],
  openGraph: {
    title: "SportsHuddle.ai - Premier League Analytics",
    description: "Premier League analytics that go beyond basic stats. Weekly insights with 39 unique metrics.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportsHuddle.ai - Premier League Analytics",
    description: "Premier League analytics that go beyond basic stats. Weekly insights with 39 unique metrics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased text-white`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
