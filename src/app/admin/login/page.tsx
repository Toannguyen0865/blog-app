"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  AlertTriangle,
  Loader2,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
        setTimeout(() => {
          window.dispatchEvent(new Event("admin_auth_change"));
        }, 150);
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
    <>
      <Navbar />
      <main
        className="container animate-fade-in"
        style={{ paddingBottom: "4rem" }}
      >
        <div className={styles.authContainer}>
        <section className={`glass-panel ${styles.authCard}`}>
          <form onSubmit={handleSubmit} className={styles.splitForm}>
            {/* Khu vực 1: Tiêu đề + mô tả ở bên trái (Hàng 1) */}
            <div className={styles.headerArea}>
              <h1 className={styles.title}>
                <Lock size={32} /> Đăng nhập Admin
              </h1>
              <p className={styles.subtitle}>
                Vui lòng xác thực tài khoản để truy cập vào hệ thống quản trị nội dung Blog.
              </p>
            </div>

            {/* Khu vực 2: Các ô nhập liệu ở bên phải (Hàng 1 + 2) */}
            <div className={styles.inputsArea}>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mật khẩu</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                    background: "#fee2e2",
                    color: "#b91c1c",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1.25rem",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <AlertTriangle size={18} /> {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
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
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Đang xác thực...
                  </>
                ) : (
                  <>
                    <LogIn size={20} /> Đăng nhập ngay
                  </>
                )}
              </button>

              <div style={{ marginTop: "1.25rem" }}>
                <Link
                  href="/"
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <ArrowLeft size={16} /> Về trang chủ
                </Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
    </>
  );
}
