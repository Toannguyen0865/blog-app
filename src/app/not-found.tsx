import Link from "next/link";
import { Sparkles, Home, ArrowLeft, FileQuestion } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingBottom: "5rem", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: "650px",
            margin: "2rem auto",
            padding: "3.5rem 2rem",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.15))",
              color: "var(--primary-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              border: "1px solid rgba(37, 99, 235, 0.3)",
            }}
          >
            <FileQuestion size={44} />
          </div>

          <h1 style={{ fontSize: "4rem", fontWeight: 900, marginBottom: "0.5rem", background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            404
          </h1>
          
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>
            Trang bạn tìm kiếm không tồn tại!
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 2.5rem" }}>
            Có vẻ như đường dẫn URL này đã bị sai, bài viết đã bị xóa hoặc được chuyển sang một địa chỉ khác trên DevVibe Blog.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.75rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 650,
                fontSize: "1rem",
              }}
            >
              <Home size={18} /> Về Trang chủ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
