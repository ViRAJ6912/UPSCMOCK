import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UPSC Prelims Practice Portal",
  description: "Mock tests modelled on the UPSC Civil Services Preliminary examination — GS Paper I and CSAT Paper II with full UPSC marking scheme.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-5 py-8 sm:py-10">
          {children}
        </main>
        <footer className="bg-surface border-t border-black/5 py-5">
          <div className="mx-auto max-w-6xl px-5 text-xs text-ink-mute">
            Built to UPSC Prelims pattern · Negative marking applied · Progress saves locally in this browser
          </div>
        </footer>
      </body>
    </html>
  );
}
