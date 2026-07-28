"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Loader2,
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin để đăng ký!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
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
        setError(data.error || "Đăng ký thất bại.");
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
              <UserPlus size={32} /> Đăng ký thành viên
            </h1>
            <p className={styles.subtitle}>
              Tạo tài khoản độc giả nhanh chóng để cùng thảo luận, bình luận và
              chia sẻ kiến thức công nghệ mỗi ngày.
            </p>
          </div>

          {/* Khu vực 2: Các ô nhập liệu ở bên phải (Hàng 1 + 2) */}
          <div className={styles.inputsArea}>
            <div className="form-group">
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <UserIcon size={16} /> Họ và tên của bạn
              </label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="VD: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Mail size={16} /> Địa chỉ Email
              </label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Lock size={16} /> Mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Ít nhất 6 ký tự..."
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label
                className="form-label"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Lock size={16} /> Xác nhận mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Khu vực 3: Nút đăng ký + Thông báo lỗi + Links ở bên trái (Hàng 2) */}
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
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                </>
              ) : (
                <>
                  <UserPlus size={20} /> Đăng ký tài khoản
                </>
              )}
            </button>

            <div className={styles.footer}>
              Đã có tài khoản thành viên?{" "}
              <Link
                href={`/login${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                className={styles.link}
              >
                Đăng nhập ngay
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

export default function UserRegisterPage() {
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
          <RegisterForm />
        </Suspense>
      </main>
    </>
  );
}
