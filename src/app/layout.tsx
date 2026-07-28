import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
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
    <html lang="vi" className={jakarta.variable}>
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
