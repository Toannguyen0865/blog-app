"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  Loader2,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        try {
          if (data.user) {
            localStorage.setItem("devvibe_user_cache", JSON.stringify(data.user));
          }
        } catch (e) {}
        window.dispatchEvent(new Event("user_auth_change"));
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data.error || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <section className={`glass-panel ${styles.authCard}`}>
        <form onSubmit={handleSubmit} className={styles.splitForm}>
          {/* Khu vực 1: Tiêu đề + mô tả ở bên trái (Hàng 1) */}
          <div className={styles.headerArea}>
            <h1 className={styles.title}>
              <LogIn size={32} /> Đăng nhập độc giả
            </h1>
            <p className={styles.subtitle}>
              Đăng nhập tài khoản thành viên để tham gia thảo luận và chia sẻ ý
              kiến về các bài viết trên DevVibe.
            </p>
          </div>

          {/* Khu vực 2: Các ô nhập liệu ở bên phải (Hàng 1 + 2) */}
          <div className={styles.inputsArea}>
            <div className="form-group">
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Mail size={16} /> Email thành viên
              </label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="Nhập email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label
                  className="form-label"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", margin: 0 }}
                >
                  <Lock size={16} /> Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--primary-blue)",
                    fontWeight: 650,
                    textDecoration: "none",
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Nhập mật khẩu ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Khu vực 3: Nút đăng nhập + Thông báo lỗi + Links ở bên trái (Hàng 2) */}
          <div className={styles.actionsArea}>
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
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Đang xác
                  thực...
                </>
              ) : (
                <>
                  <LogIn size={20} /> Đăng nhập ngay
                </>
              )}
            </button>

            <div className={styles.footer}>
              Chưa có tài khoản thành viên?{" "}
              <Link
                href={`/register${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                className={styles.link}
              >
                Đăng ký ngay
              </Link>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <Link
                href={returnUrl}
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <ArrowLeft size={16} /> Quay lại trang trước
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <>
      <Navbar />
      <main
        className="container animate-fade-in"
        style={{ paddingBottom: "4rem" }}
      >
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "4rem" }}>
              Đang tải...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
