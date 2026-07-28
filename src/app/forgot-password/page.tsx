"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, Loader2, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import styles from "../login/page.module.css";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Vui lòng nhập email tài khoản của bạn!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
          // Tự động chuyển trang sau 1.5 giây cho trải nghiệm cực nhanh
          setTimeout(() => {
            router.push(data.resetUrl);
          }, 1500);
        }
      } else {
        setError(data.error || "Không tìm thấy tài khoản hợp lệ.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingBottom: "4rem" }}>
        <div className={styles.authContainer}>
          <section className={`glass-panel ${styles.authCard}`}>
            <div className={styles.splitForm}>
              {/* Khu vực bên trái: Giới thiệu */}
              <div className={styles.headerArea}>
                <h1 className={styles.title}>
                  <KeyRound size={32} /> Quên mật khẩu?
                </h1>
                <p className={styles.subtitle}>
                  Chỉ cần nhập chính xác địa chỉ email đã đăng ký tài khoản DevVibe, hệ thống sẽ xác thực và cho phép bạn đặt lại mật khẩu mới ngay lập tức.
                </p>
              </div>

              {/* Khu vực bên phải: Form / Thành công */}
              <div className={styles.inputsArea}>
                {success ? (
                  <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.25rem",
                      }}
                    >
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                      Xác nhận tài khoản thành công!
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                      Tài khoản <strong>{email}</strong> hợp lệ! Hệ thống đang chuyển bạn đến trang đổi mật khẩu mới...
                    </p>

                    {resetUrl && (
                      <Link
                        href={resetUrl}
                        className="btn-primary"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "0.85rem 1.5rem",
                          borderRadius: "14px",
                          textDecoration: "none",
                          fontWeight: 650,
                          fontSize: "1.05rem",
                          width: "100%",
                        }}
                      >
                        <ShieldCheck size={20} /> Đổi mật khẩu ngay &rarr;
                      </Link>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                      <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Mail size={16} /> Email tài khoản
                      </label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="ví du: programmer@devvibe.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "0.85rem 1rem" }}
                      />
                    </div>

                    {error && (
                      <div
                        style={{
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.1)",
                          padding: "0.75rem",
                          borderRadius: "10px",
                          marginBottom: "1.25rem",
                          fontSize: "0.9rem",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{
                        width: "100%",
                        padding: "0.9rem",
                        borderRadius: "14px",
                        fontWeight: 650,
                        fontSize: "1.05rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Đang kiểm tra...
                        </>
                      ) : (
                        <>
                          <KeyRound size={20} /> Xác nhận & Đổi mật khẩu
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Khu vực bên dưới: Quay lại */}
              <div className={styles.actionsArea}>
                <div className={styles.footer} style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
                  Đã nhớ lại mật khẩu?{" "}
                  <Link href="/login" className={styles.link}>
                    Đăng nhập ngay
                  </Link>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <Link
                    href="/login"
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      textDecoration: "none",
                    }}
                  >
                    <ArrowLeft size={16} /> Quay lại trang Đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
