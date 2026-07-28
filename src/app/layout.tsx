import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevVibe Blog - Nền tảng chia sẻ kiến thức công nghệ",
  description: "Chia sẻ kiến thức phần mềm, xu hướng công nghệ mới nhất và câu chuyện lập trình viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-wrapper">
          <div className="app-content">
            {children}
          </div>
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
