"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Edit,
  Trash2,
  List as ListIcon,
  PlusSquare,
  ArrowLeft,
  LogOut,
  Loader2,
  User,
  Menu,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import styles from "./page.module.css";
import ScrollToTop from "@/components/ScrollToTop";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  tags?: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Auth checking state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    icon?: React.ReactNode;
    message: string;
    isNotification?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Tab state: 'list' or 'form'
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/admin/check");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAdminUser(data.admin);
            setCheckingAuth(false);
            fetchPosts();
            return;
          }
        }
        router.replace("/admin/login");
      } catch (err) {
        router.replace("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận đăng xuất",
      icon: <LogOut size={32} color="#ef4444" />,
      message: "Bạn có chắc chắn muốn rời khỏi tài khoản Quản trị viên không?",
      onConfirm: async () => {
        await fetch("/api/auth/admin/logout", { method: "POST" });
        setConfirmModal(null);
        router.replace("/admin/login");
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/posts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, imageUrl, tags }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: author || "Admin",
          imageUrl,
          tags: tags || "lập trình, công nghệ",
        }),
      });
    }
    setTitle("");
    setContent("");
    setAuthor("");
    setImageUrl("");
    setTags("");
    fetchPosts();
    setActiveTab("list"); // Chuyển về danh sách sau khi đăng/sửa
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setImageUrl(post.imageUrl || "");
    setTags(post.tags || "");
    setEditingId(post.id);
    setActiveTab("form"); // Chuyển sang tab form
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận xóa bài viết",
      icon: <Trash2 size={32} color="#ef4444" />,
      message:
        "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        setConfirmModal(null);
        fetchPosts();
      },
    });
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.tags && post.tags.toLowerCase().includes(query)) ||
      post.id.toString() === query
    );
  });

  if (checkingAuth) {
    return (
      <main
        className="container animate-fade-in"
        style={{ maxWidth: "1200px" }}
      >
        <div
          className="glass-panel"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Loader2 className="animate-spin" size={24} />{" "}
          <h2>Đang kiểm tra quyền truy cập...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="container animate-fade-in" style={{ maxWidth: "1200px" }}>
      <div className={styles.adminLayout}>
        <aside className={styles.sidebar}>
          <h2
            style={{
              paddingLeft: "0.5rem",
              marginBottom: "0.5rem",
              fontSize: "2rem",
            }}
          >
            Quản trị Blog
          </h2>

          {adminUser && (
            <div
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  color: "var(--primary-blue)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <User size={18} /> {adminUser.username}
              </div>

              <button
                onClick={handleLogout}
                title="Đăng xuất khỏi tài khoản Admin"
                style={{
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  padding: "0.35rem 0.6rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            </div>
          )}

          {/* Mobile Menu Container */}
          <div className={styles.mobileMenuContainer}>
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Menu size={18} />{" "}
                {isMobileMenuOpen ? "Thu gọn menu" : "Menu chức năng"}
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: isMobileMenuOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            <div
              className={`${styles.navGroup} ${isMobileMenuOpen ? styles.navGroupOpen : ""}`}
            >
              <Link
                href="/"
                className={styles.tabButton}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <ArrowLeft size={18} />
                Về trang chủ
              </Link>

              <button
                className={`${styles.tabButton} ${activeTab === "form" && !editingId ? styles.active : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => {
                  setActiveTab("form");
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                  setAuthor("");
                  setImageUrl("");
                  setIsMobileMenuOpen(false);
                }}
              >
                <PlusSquare size={18} /> Đăng bài mới
              </button>

              <button
                className={`${styles.tabButton} ${activeTab === "list" ? styles.active : ""}`}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => {
                  setActiveTab("list");
                  setIsMobileMenuOpen(false);
                }}
              >
                <ListIcon size={18} /> Danh sách bài viết
              </button>

              {editingId && (
                <button
                  className={`${styles.tabButton} ${activeTab === "form" && editingId ? styles.active : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color:
                      activeTab === "form" && editingId
                        ? "#ffffff"
                        : "var(--primary-blue)",
                    borderColor: "var(--primary-blue)",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    setActiveTab("form");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Edit size={18} /> Chỉnh sửa bài #{editingId}
                </button>
              )}
            </div>
          </div>
        </aside>

        <section className={`glass-panel ${styles.mainContent}`}>
          {activeTab === "form" ? (
            <>
              <h2>{editingId ? "Chỉnh sửa bài viết" : "Đăng bài mới"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Tiêu đề</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tác giả</label>
                  <input
                    type="text"
                    className="form-control"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Mặc định: Admin"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Đường dẫn Hình ảnh (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Tags / Nhãn bài viết (Cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ví dụ: lập trình, nextjs, game, ai"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Nội dung (Hỗ trợ Markdown)
                  </label>
                  <textarea
                    className="form-control"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  {editingId ? "Cập nhật" : "Đăng bài"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-danger"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                      setEditingId(null);
                      setTitle("");
                      setContent("");
                      setAuthor("");
                      setImageUrl("");
                      setActiveTab("list");
                    }}
                  >
                    Hủy
                  </button>
                )}
              </form>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  Danh sách bài viết{" "}
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--text-muted)",
                      fontWeight: "normal",
                    }}
                  >
                    ({filteredPosts.length}/{posts.length})
                  </span>
                </h2>

                <div
                  style={{
                    position: "relative",
                    flex: "1 1 250px",
                    maxWidth: "380px",
                  }}
                >
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tìm tiêu đề, tác giả, nội dung, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{
                      paddingLeft: "2.5rem",
                      paddingRight: searchQuery ? "2.5rem" : "1rem",
                      background: "rgba(255, 255, 255, 0.7)",
                      width: "100%",
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "0.6rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "0.25rem",
                      }}
                      title="Xóa tìm kiếm"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.postList}>
                {filteredPosts.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 1rem",
                      color: "var(--text-muted)",
                      background: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "12px",
                      border: "1px dashed var(--card-border)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "1.05rem" }}>
                      Không tìm thấy bài viết nào phù hợp với từ khóa &quot;
                      {searchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className={styles.adminPostItem}>
                      <div>
                        <h3 style={{ marginBottom: "0.2rem" }}>{post.title}</h3>
                        <small style={{ color: "var(--text-muted)" }}>
                          Bởi {post.author} -{" "}
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </small>
                      </div>
                      <div className={styles.actions}>
                        <button
                          className="btn-primary"
                          style={{
                            padding: "0.4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => handleEdit(post)}
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-danger"
                          style={{
                            padding: "0.4rem",
                            marginLeft: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => handleDelete(post.id)}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {confirmModal &&
        confirmModal.isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.35)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999,
            }}
          >
            <div
              className="animate-fade-in"
              style={{
                padding: "2.5rem 2rem",
                maxWidth: "420px",
                width: "90%",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                backdropFilter: "blur(16px)",
              }}
            >
              {confirmModal.icon && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {confirmModal.icon}
                </div>
              )}
              <h3
                style={{
                  marginBottom: "0.6rem",
                  fontSize: "1.35rem",
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                {confirmModal.title}
              </h3>
              <p
                style={{
                  color: "#475569",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                }}
              >
                {confirmModal.message}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {confirmModal.isNotification ? (
                  <button
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      padding: "0.65rem 1.75rem",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                      transition: "all 0.2s",
                      width: "100%",
                    }}
                    onClick={confirmModal.onConfirm}
                  >
                    Đóng thông báo
                  </button>
                ) : (
                  <>
                    <button
                      style={{
                        background: "#ef4444",
                        color: "#ffffff",
                        padding: "0.65rem 1.75rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                        transition: "all 0.2s",
                      }}
                      onClick={confirmModal.onConfirm}
                    >
                      Đồng ý
                    </button>
                    <button
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        padding: "0.65rem 1.75rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onClick={() => setConfirmModal(null)}
                    >
                      Hủy bỏ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
      <ScrollToTop />
    </main>
  );
}
