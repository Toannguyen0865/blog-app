"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Globe, Heart, ArrowRight } from "lucide-react";

// SVG helper components cho các mạng xã hội
const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();

  // Không hiển thị Footer trong các trang quản trị admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer-container">
      {/* Background glow decoration */}
      <div className="footer-bg-glow" />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo">
              <span className="footer-logo-icon">
                <Sparkles size={22} />
              </span>
              <span className="footer-logo-text">DevVibe Blog</span>
            </Link>
            <p className="footer-slogan">
              Nền tảng chia sẻ kiến thức công nghệ hiện đại và kết nối cộng đồng
              lập trình viên với xu hướng phát triển mới nhất.
            </p>

            <div className="footer-social-group">
              <a
                href="https://github.com/Toannguyen0865"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/to%C3%A0n-nguy%E1%BB%85n-772977332/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href="https://portfolio-henna-eight-89.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="Website"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">Chuyên mục</h4>
            <ul className="footer-links">
              <li>
                <Link href="/?tag=Lập trình" className="footer-link">
                  <span>Lập trình</span>
                </Link>
              </li>
              <li>
                <Link href="/?tag=AI" className="footer-link">
                  <span>Trí tuệ nhân tạo (AI)</span>
                </Link>
              </li>
              <li>
                <Link href="/?tag=Web" className="footer-link">
                  <span>Web Development</span>
                </Link>
              </li>
              <li>
                <Link href="/?tag=DevOps" className="footer-link">
                  <span>Cloud & DevOps</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Điều hướng</h4>
            <ul className="footer-links">
              <li>
                <Link href="/" className="footer-link">
                  <ArrowRight size={14} className="link-arrow" />{" "}
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="footer-link">
                  <ArrowRight size={14} className="link-arrow" />{" "}
                  <span>Đăng nhập</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="footer-link">
                  <ArrowRight size={14} className="link-arrow" />{" "}
                  <span>Đăng ký thành viên</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} <strong>DevVibe Blog</strong>.
          </div>
          <div className="footer-credits">
            <span>Designed with</span>
            <Heart size={14} color="#ef4444" className="credit-heart" />
            <span>
              by <strong>ToanNguyen</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
