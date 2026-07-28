"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Settings,
} from "lucide-react";
import NotificationModal, { NotificationModalProps } from "@/components/NotificationModal";

interface UserSession {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("devvibe_user_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Đo chiều cao navbar thực tế và đồng bộ với CSS variable
  useEffect(() => {
    if (!navRef.current) return;
    const updateHeight = () => {
      if (navRef.current) {
        const h = navRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navbar-height', `${h}px`);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [loading, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/user/me", {
        cache: "no-store",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          try {
            localStorage.setItem("devvibe_user_cache", JSON.stringify(data.user));
          } catch (e) {}
          setLoading(false);
          return;
        }
      }

      // Nếu không phải Reader bình thường, kiểm tra xem có phải Quản trị viên (Admin) đang đăng nhập không
      const adminRes = await fetch("/api/auth/admin/check", {
        cache: "no-store",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.authenticated && adminData.admin) {
          const adminObj = {
            id: adminData.admin.id,
            name: `${adminData.admin.username} (Admin)`,
            email: "admin@devvibe.com",
            avatar: null,
          };
          setUser(adminObj);
          try {
            localStorage.setItem("devvibe_user_cache", JSON.stringify(adminObj));
          } catch (e) {}
          setLoading(false);
          return;
        }
      }

      try {
        localStorage.removeItem("devvibe_user_cache");
      } catch (e) {}
      setUser(null);
    } catch (err) {
      try {
        localStorage.removeItem("devvibe_user_cache");
      } catch (e) {}
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUser, 0);
    window.addEventListener("focus", fetchUser);
    window.addEventListener("user_auth_change", fetchUser);
    window.addEventListener("admin_auth_change", fetchUser);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", fetchUser);
      window.removeEventListener("user_auth_change", fetchUser);
      window.removeEventListener("admin_auth_change", fetchUser);
    };
  }, [pathname]);

  const handleLogout = () => {
    setShowMenu(false);
    setNotifyModal({
      isOpen: true,
      title: "Xác nhận đăng xuất",
      message: "Bạn có chắc chắn muốn rời khỏi tài khoản không?",
      type: "logout",
      confirmText: "Đăng xuất",
      cancelText: "Hủy bỏ",
      onClose: () => setNotifyModal(null),
      onConfirm: async () => {
        try {
          await fetch("/api/auth/user/logout", { method: "POST" });
          await fetch("/api/auth/admin/logout", { method: "POST" }).catch(() => {});
          try {
            localStorage.removeItem("devvibe_user_cache");
          } catch (e) {}
          setUser(null);
          setNotifyModal(null);
          window.dispatchEvent(new Event("user_auth_change"));
          window.dispatchEvent(new Event("admin_auth_change"));
          router.refresh();
        } catch (err) {
          setNotifyModal({
            isOpen: true,
            title: "Lỗi đăng xuất",
            message: "Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.",
            type: "error",
            onClose: () => setNotifyModal(null),
          });
        }
      },
    });
  };

  const getReturnUrlQuery = () => {
    if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")) {
      return "";
    }
    return `?returnUrl=${encodeURIComponent(pathname)}`;
  };

  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register" || isAdminPage;

  return (
    <>
      <nav ref={navRef} className="navbar-container">
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="navbar-logo">
            <span className="navbar-logo-icon">
              <Sparkles size={20} />
            </span>
            <span className="navbar-logo-text">
              DevVibe Blog
            </span>
          </div>
        </Link>

        {/* Góc phải: Thông tin người dùng hoặc Nút Đăng nhập/Đăng ký */}
        <div className="navbar-actions">
          {!isAdminPage && (
            user ? (
              <div style={{ position: "relative", width: "100%" }} ref={menuRef}>
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="user-badge-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "30px",
                    background: "rgba(255, 255, 255, 0.7)",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid var(--primary-blue)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className="user-badge-name"
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "var(--text-main)",
                    }}
                  >
                    {user.name}
                  </span>
                  <ChevronDown
                    size={16}
                    color="var(--text-muted)"
                    className="user-badge-chevron"
                    style={{
                      transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>

                {showMenu && (
                  <div
                    className="glass-panel animate-fade-in user-dropdown-menu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: "0.35rem",
                      minWidth: "260px",
                      width: "max-content",
                      maxWidth: "calc(100vw - 2rem)",
                      padding: "1rem",
                      zIndex: 1000,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.98)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        paddingBottom: "0.85rem",
                        marginBottom: "0.85rem",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          border: "2px solid rgba(37, 99, 235, 0.2)",
                        }}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "var(--text-main)",
                            wordBreak: "break-word",
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.82rem",
                            color: "var(--text-muted)",
                            wordBreak: "break-all",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setShowMenu(false)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "0.65rem",
                        padding: "0.65rem 0.9rem",
                        borderRadius: "10px",
                        color: "var(--text-main)",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        transition: "all 0.2s ease",
                        marginBottom: "0.4rem",
                        background: "rgba(37, 99, 235, 0.06)",
                        border: "1px solid rgba(37, 99, 235, 0.15)",
                      }}
                    >
                      <Settings size={18} color="var(--primary-blue)" /> Cài đặt hồ sơ
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "0.65rem",
                        padding: "0.65rem 0.9rem",
                        borderRadius: "10px",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.15)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : loading ? (
              <div
                className="skeleton"
                style={{
                  width: "140px",
                  height: "40px",
                  borderRadius: "30px",
                }}
              />
            ) : (
              !isAuthPage && (
                <div className="auth-buttons-group">
                  <Link
                    href={`/login${getReturnUrlQuery()}`}
                    className="btn-secondary nav-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    <LogIn size={16} /> <span className="nav-btn-text">Đăng nhập</span>
                  </Link>
                  <Link
                    href={`/register${getReturnUrlQuery()}`}
                    className="btn-primary nav-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    }}
                  >
                    <UserPlus size={16} /> <span className="nav-btn-text">Đăng ký</span>
                  </Link>
                </div>
              )
            )
          )}
        </div>
      </nav>
      {/* Spacer đẩy nội dung xuống dưới navbar cố định.
          Chỉ trang nào dùng <Navbar /> mới bị ảnh hưởng. */}
      <div className="navbar-spacer" />
      {notifyModal && <NotificationModal {...notifyModal} />}
    </>
  );
}
