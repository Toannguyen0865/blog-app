"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Lock,
  Camera,
  Save,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Upload,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import NotificationModal, {
  NotificationModalProps,
} from "@/components/NotificationModal";
import styles from "./page.module.css";

const AVATAR_PRESETS = [
  "https://ui-avatars.com/api/?name=Dev+Vibe&background=2563eb&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Code+Pro&background=10b981&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Tech+Guru&background=8b5cf6&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Nova+Star&background=f59e0b&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Zen+Coder&background=ec4899&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Cyber+Dev&background=06b6d4&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Vibe+King&background=6366f1&color=fff&bold=true&size=128",
  "https://ui-avatars.com/api/?name=Pro+Dev&background=ef4444&color=fff&bold=true&size=128",
];

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Menu tab state: 'profile' (đổi tên, hình) hoặc 'security' (đổi mật khẩu)
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Form states
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps | null>(
    null,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/user/me");
        if (!res.ok) {
          router.push("/login?returnUrl=/profile");
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setName(data.user.name);
          setAvatarUrl(data.user.avatar || "");
        } else {
          router.push("/login?returnUrl=/profile");
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin tài khoản:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra validation theo từng mục Tab
    if (activeTab === "profile") {
      if (!name.trim()) {
        setNotifyModal({
          isOpen: true,
          title: "Thông tin không hợp lệ",
          message: "Họ và tên hiển thị không được để trống!",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }
    } else if (activeTab === "security") {
      if (!currentPassword) {
        setNotifyModal({
          isOpen: true,
          title: "Yêu cầu mật khẩu hiện tại",
          message:
            "Vui lòng nhập mật khẩu hiện tại để xác nhận quyền thay đổi!",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }
      if (!newPassword) {
        setNotifyModal({
          isOpen: true,
          title: "Thiếu mật khẩu mới",
          message: "Vui lòng nhập mật khẩu mới muốn thay đổi!",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setNotifyModal({
          isOpen: true,
          title: "Mật khẩu không khớp",
          message: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới!",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }
      if (newPassword.length < 6) {
        setNotifyModal({
          isOpen: true,
          title: "Mật khẩu quá ngắn",
          message: "Mật khẩu mới phải có ít nhất 6 ký tự bảo mật!",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: {
        name?: string;
        avatar?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {};

      if (activeTab === "profile") {
        payload.name = name.trim();
        payload.avatar = avatarUrl.trim();
      } else {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/auth/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotifyModal({
          isOpen: true,
          title: "Cập nhật thất bại",
          message: data.error || "Có lỗi xảy ra khi cập nhật hồ sơ.",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }

      // Thành công
      setUser(data.user);
      if (activeTab === "security") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      // Phát sự kiện toàn cục để Navbar tự động cập nhật
      window.dispatchEvent(new Event("user_auth_change"));
      router.refresh();

      setNotifyModal({
        isOpen: true,
        title: "Cập nhật thành công",
        message:
          activeTab === "profile"
            ? "Thông tin họ tên và ảnh đại diện của bạn đã được cập nhật thành công!"
            : "Mật khẩu tài khoản của bạn đã được thay đổi an toàn!",
        type: "success",
        onClose: () => setNotifyModal(null),
      });
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setNotifyModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Có lỗi kết nối máy chủ. Vui lòng thử lại sau.",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotifyModal({
        isOpen: true,
        title: "Định dạng không hợp lệ",
        message: "Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp, .gif)!",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotifyModal({
        isOpen: true,
        title: "Ảnh quá lớn",
        message: "Kích thước ảnh không được vượt quá 10MB!",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setNotifyModal({
          isOpen: true,
          title: "Tải ảnh thất bại",
          message: data.error || "Có lỗi xảy ra khi tải ảnh lên.",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return;
      }

      // Cập nhật URL ảnh mới lên giao diện preview mà KHÔNG hiện modal thông báo thành công theo yêu cầu
      setAvatarUrl(data.url);
    } catch (err) {
      console.error("Lỗi upload:", err);
      setNotifyModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Không thể kết nối đến máy chủ tải ảnh. Vui lòng thử lại sau.",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div
          className={styles.profileCard}
          style={{ textAlign: "center", padding: "5rem 2rem" }}
        >
          <RefreshCw
            size={36}
            className="animate-spin"
            color="var(--primary-blue)"
            style={{ margin: "0 auto 1rem" }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Đang tải hồ sơ DevVibe của bạn...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentDisplayAvatar =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=2563eb&color=fff&bold=true`;

  return (
    <div className={styles.profileContainer}>
      {notifyModal && <NotificationModal {...notifyModal} />}

      {/* Nút Trở về Trang chủ */}
      <div className={styles.topNav}>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={18} /> Về trang chủ
        </Link>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Sparkles size={28} color="var(--primary-blue)" /> Cài đặt hồ sơ tài
            khoản
          </h1>
          <p className={styles.subtitle}>
            Tùy chỉnh thông tin cá nhân, hình ảnh và bảo mật cho tài khoản
            DevVibe Blog của bạn.
          </p>
        </div>

        {/* Thanh Menu chuyển mục */}
        <div className={styles.menuBar}>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`${styles.menuItem} ${activeTab === "profile" ? styles.menuItemActive : ""}`}
          >
            <User size={18} /> Đổi Tên & Hình Đại Diện
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`${styles.menuItem} ${activeTab === "security" ? styles.menuItemActive : ""}`}
          >
            <KeyRound size={18} /> Đổi Mật Khẩu Bảo Mật
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "profile" ? (
            /* TAB 1: Đổi Tên & Hình đại diện */
            <div className={styles.gridSection}>
              {/* Cột Trái: Upload & Presets */}
              <div className={styles.leftCol}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />

                <div
                  className={styles.avatarWrapper}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  style={{ cursor: isUploading ? "wait" : "pointer" }}
                  title="Click để tải ảnh lên từ máy"
                >
                  <img
                    src={currentDisplayAvatar}
                    alt={name}
                    className={styles.avatarImage}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name || "User",
                      )}&background=2563eb&color=fff&bold=true`;
                    }}
                    style={{ opacity: isUploading ? 0.5 : 1 }}
                  />
                  <div className={styles.avatarBadge} title="Tải ảnh từ máy">
                    <Camera size={16} />
                  </div>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--text-main)",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Thành viên DevVibe
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    margin: "1rem 0 0.5rem",
                    borderRadius: "12px",
                    background: "var(--primary-blue)",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                    transition: "all 0.2s ease",
                    opacity: isUploading ? 0.7 : 1,
                  }}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Đang tải
                      lên...
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Tải ảnh lên
                    </>
                  )}
                </button>

                <div
                  className={styles.presetHeading}
                  style={{ marginTop: "0.5rem" }}
                >
                  Hoặc chọn nhanh mẫu ảnh:
                </div>
                <div className={styles.presetGrid}>
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setAvatarUrl(preset)}
                      className={`${styles.presetItem} ${
                        avatarUrl === preset ? styles.presetItemActive : ""
                      }`}
                      title={`Chọn mẫu ảnh ${index + 1}`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${index + 1}`}
                        className={styles.presetImg}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Cột Phải: Thông tin họ tên */}
              <div className={styles.rightCol}>
                <div className={styles.sectionGroup}>
                  <div className={styles.sectionTitle}>
                    <User size={20} color="var(--primary-blue)" /> Thông tin cá
                    nhân
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>Họ và tên hiển thị</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="Nhập họ và tên..."
                      required
                    />
                    <p className={styles.hint}>
                      Tên hiển thị khi bạn tham gia bình luận các bài viết.
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>Email đăng nhập</span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <ShieldCheck size={14} /> Đã xác thực
                      </span>
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className={`${styles.input} ${styles.inputDisabled}`}
                    />
                    <p className={styles.hint}>
                      Email định danh tài khoản không thể thay đổi.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Đang lưu
                      thông tin...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Lưu thay đổi hồ sơ
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: Đổi mật khẩu */
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div
                className={styles.sectionGroup}
                style={{
                  padding: "2rem",
                  background: "rgba(248, 250, 252, 0.5)",
                }}
              >
                <div
                  className={styles.sectionTitle}
                  style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                >
                  <Lock size={22} color="#8b5cf6" /> Đổi mật khẩu tài khoản
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    margin: "0 0 1.5rem",
                  }}
                >
                  Để bảo đảm an toàn, vui lòng nhập mật khẩu hiện tại trước khi
                  thiết lập mật khẩu mới.
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>Mật khẩu hiện tại</span>
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Nhập mật khẩu hiện tại..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>Mật khẩu mới</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>Xác nhận mật khẩu mới</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Nhập lại mật khẩu mới..."
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Đang cập
                      nhật mật khẩu...
                    </>
                  ) : (
                    <>
                      <KeyRound size={18} /> Cập nhật mật khẩu mới
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
