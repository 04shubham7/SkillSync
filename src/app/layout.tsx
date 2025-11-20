import type { Metadata } from "next";
import localFont from "next/font/local";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SkillSync",
  description: "SkillSync – Real-time collaborative technical interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <Providers>
          {/* Static gradient background */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0820]"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/50 via-transparent to-purple-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent"></div>
          </div>

          <div className="min-h-screen relative z-10">
            <div className="px-4 md:px-8">
              <Navbar />
            </div>
            <main className="px-4 md:px-8">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
