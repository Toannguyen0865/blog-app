"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import styles from "../login/page.module.css";
import Navbar from "@/components/Navbar";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Mã xác thực (token) không hợp lệ hoặc bị thiếu!");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <section className={`glass-panel ${styles.authCard}`}>
        <div className={styles.splitForm}>
          {/* Khu vực bên trái: Tiêu đề */}
          <div className={styles.headerArea}>
            <h1 className={styles.title}>
              <ShieldCheck size={32} /> Đặt lại mật khẩu
            </h1>
            <p className={styles.subtitle}>
              Hãy nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu nên có độ dài từ 6 ký tự trở lên để đảm bảo an toàn.
            </p>
          </div>

          {/* Khu vực bên phải: Form / Thành công */}
          <div className={styles.inputsArea}>
            {success ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
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
                  Đổi mật khẩu thành công!
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Mật khẩu tài khoản của bạn đã được cập nhật. Hệ thống sẽ tự động chuyển hướng về trang đăng nhập sau vài giây...
                </p>
                <Link
                  href="/login"
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 650,
                  }}
                >
                  Đăng nhập ngay &rarr;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {!token && (
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
                    Cảnh báo: Không tìm thấy token khôi phục trong đường dẫn URL!
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Lock size={16} /> Mật khẩu mới
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="form-control"
                      placeholder="Ít nhất 6 ký tự..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ paddingRight: "2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.25rem",
                      }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Lock size={16} /> Nhập lại mật khẩu mới
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-control"
                    placeholder="Xác nhận lại mật khẩu..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  disabled={loading || !token}
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
                    opacity: !token ? 0.6 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Đang lưu mật khẩu...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} /> Lưu mật khẩu mới
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Khu vực bên dưới: Quay lại */}
          <div className={styles.actionsArea}>
            <div className={styles.footer} style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
              Chưa có tài khoản?{" "}
              <Link href="/register" className={styles.link}>
                Đăng ký ngay
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
                <ArrowLeft size={16} /> Về trang Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="container animate-fade-in" style={{ paddingBottom: "4rem" }}>
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              Đang tải giao diện...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
