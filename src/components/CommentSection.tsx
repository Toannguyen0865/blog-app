"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  LogIn,
  UserPlus,
  Loader2,
  Sparkles,
  Edit2,
  Trash2,
} from "lucide-react";
import NotificationModal, {
  NotificationModalProps,
} from "@/components/NotificationModal";

interface CommentUser {
  id: number;
  name: string;
  avatar?: string | null;
}

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  parentId?: number | null;
  user: CommentUser;
}

interface UserSession {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

// Helper component đệ quy để hiển thị từng bình luận cha và các bình luận con (nested replies)
function CommentNode({
  comment,
  allComments,
  currentUser,
  activeReplyId,
  setActiveReplyId,
  replyText,
  setReplyText,
  handleSendReply,
  handleEditComment,
  handleDeleteComment,
  submittingReply,
  formatDate,
  collapsedThreads,
  toggleThread,
  setNotifyModal,
  depth = 0,
}: {
  comment: CommentItem;
  allComments: CommentItem[];
  currentUser: UserSession | null;
  activeReplyId: number | null;
  setActiveReplyId: (id: number | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: (parentId: number, e: React.FormEvent) => void;
  handleEditComment: (id: number, content: string) => Promise<boolean>;
  handleDeleteComment: (id: number) => Promise<void>;
  submittingReply: boolean;
  formatDate: (dateStr: string) => string;
  collapsedThreads: Record<number, boolean>;
  toggleThread: (id: number) => void;
  setNotifyModal: (modal: NotificationModalProps | null) => void;
  depth?: number;
}) {
  // Tìm các câu trả lời trực tiếp cho bình luận này, sắp xếp theo thời gian tăng dần (cũ trước, mới sau)
  const replies = allComments
    .filter((c) => c.parentId === comment.id)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const isCollapsed = collapsedThreads[comment.id] || false;
  const isReplying = activeReplyId === comment.id;

  // Kiểm tra xem người dùng hiện tại có phải tác giả của bình luận không (hoặc là Admin)
  const isOwner =
    currentUser &&
    (currentUser.id === comment.user.id || currentUser.name === "Admin");

  // State hỗ trợ sửa bình luận
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      style={{
        marginLeft: depth > 0 ? (depth > 1 ? "1.25rem" : "2rem") : "0",
        marginTop: depth > 0 ? "0.85rem" : "0",
        borderLeft: depth > 0 ? "2px solid rgba(59, 130, 246, 0.35)" : "none",
        paddingLeft: depth > 0 ? "1.25rem" : "0",
        position: "relative",
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-panel"
        style={{
          padding: depth > 0 ? "1rem 1.25rem" : "1.25rem 1.5rem",
          border:
            depth > 0
              ? "1px solid rgba(255, 255, 255, 0.55)"
              : "1px solid rgba(255, 255, 255, 0.8)",
          background:
            depth > 0
              ? "rgba(255, 255, 255, 0.55)"
              : "rgba(255, 255, 255, 0.7)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          borderRadius: "14px",
        }}
      >
        {/* Header: Avatar, Name, Date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.6rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}
          >
            {comment.user.avatar ? (
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                referrerPolicy="no-referrer"
                style={{
                  width: depth > 0 ? "32px" : "38px",
                  height: depth > 0 ? "32px" : "38px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1.5px solid rgba(37, 99, 235, 0.3)",
                }}
              />
            ) : (
              <div
                style={{
                  width: depth > 0 ? "32px" : "38px",
                  height: depth > 0 ? "32px" : "38px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: depth > 0 ? "0.85rem" : "0.95rem",
                }}
              >
                {comment.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--text-main)",
                  fontSize: depth > 0 ? "0.95rem" : "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {comment.user.name}
                {comment.user.name === "Admin" && (
                  <span
                    style={{
                      background: "rgba(37, 99, 235, 0.15)",
                      color: "var(--primary-blue)",
                      fontSize: "0.7rem",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "6px",
                      fontWeight: 700,
                      border: "1px solid rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    QTV
                  </span>
                )}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* Content (hiển thị chế độ xem hoặc chế độ chỉnh sửa) */}
        {isEditing ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editText.trim() || editText.trim() === comment.content) {
                setIsEditing(false);
                return;
              }
              setSubmittingEdit(true);
              const success = await handleEditComment(
                comment.id,
                editText.trim(),
              );
              setSubmittingEdit(false);
              if (success) {
                setIsEditing(false);
              }
            }}
            style={{
              paddingLeft: depth > 0 ? "2.6rem" : "3.2rem",
              marginBottom: "0.85rem",
            }}
          >
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "1.5px solid var(--primary-blue)",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                color: "var(--text-main)",
                outline: "none",
              }}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(comment.content);
                }}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(0,0,0,0.06)",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submittingEdit || !editText.trim()}
                className="btn-primary"
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: submittingEdit || !editText.trim() ? 0.6 : 1,
                  cursor:
                    submittingEdit || !editText.trim()
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submittingEdit ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        ) : (
          <p
            style={{
              margin: "0 0 0.85rem 0",
              lineHeight: 1.6,
              color: "var(--text-main)",
              fontSize: depth > 0 ? "0.94rem" : "0.98rem",
              whiteSpace: "pre-line",
              paddingLeft: depth > 0 ? "2.6rem" : "3.2rem",
            }}
          >
            {comment.content}
          </p>
        )}

        {/* Actions: Reply, Edit, Delete, and Collapse toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            paddingLeft: depth > 0 ? "2.6rem" : "3.2rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                setNotifyModal({
                  isOpen: true,
                  title: "Yêu cầu đăng nhập",
                  message: "Vui lòng đăng nhập để trả lời bình luận!",
                  type: "error",
                  onClose: () => setNotifyModal(null),
                });
                return;
              }
              if (activeReplyId === comment.id) {
                setActiveReplyId(null);
              } else {
                setActiveReplyId(comment.id);
                setReplyText("");
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              color: isReplying ? "var(--primary-blue)" : "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
          >
            <MessageSquare size={14} /> {isReplying ? "Hủy trả lời" : "Trả lời"}
          </button>

          {/* Các nút dành cho tác giả bình luận */}
          {isOwner && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setEditText(comment.content);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                <Edit2 size={13} /> Sửa
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setNotifyModal({
                    isOpen: true,
                    title: "Xác nhận xóa bình luận",
                    message:
                      "Bạn có chắc chắn muốn xóa bình luận này không? Các bình luận trả lời (nếu có) cũng sẽ bị xóa theo.",
                    type: "confirm",
                    confirmText: "Xóa bình luận",
                    cancelText: "Hủy bỏ",
                    onClose: () => setNotifyModal(null),
                    onConfirm: async () => {
                      setDeleting(true);
                      setNotifyModal(null);
                      await handleDeleteComment(comment.id);
                    },
                  });
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "6px",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}{" "}
                Xóa
              </button>
            </>
          )}

          {replies.length > 0 && (
            <button
              type="button"
              onClick={() => toggleThread(comment.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary-blue)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "6px",
              }}
            >
              {isCollapsed ? (
                <>Xem {replies.length} câu trả lời ▾</>
              ) : (
                <>Ẩn câu trả lời ▴</>
              )}
            </button>
          )}
        </div>

        {/* Inline Reply Form */}
        {isReplying && (
          <form
            onSubmit={(e) => handleSendReply(comment.id, e)}
            style={{
              marginTop: "1rem",
              paddingLeft: depth > 0 ? "2.6rem" : "3.2rem",
            }}
            className="animate-fade-in"
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "1.5px solid var(--primary-blue)",
                borderRadius: "12px",
                padding: "0.75rem",
                boxShadow: "0 4px 15px rgba(37, 99, 235, 0.08)",
              }}
            >
              <textarea
                rows={2}
                placeholder={`Trả lời @${comment.user.name}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "0.92rem",
                  fontFamily: "inherit",
                  color: "var(--text-main)",
                  minHeight: "50px",
                }}
                autoFocus
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveReplyId(null)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(0,0,0,0.06)",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="btn-primary"
                  style={{
                    padding: "0.4rem 0.95rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    opacity: submittingReply || !replyText.trim() ? 0.6 : 1,
                    cursor:
                      submittingReply || !replyText.trim()
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {submittingReply ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Gửi
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Replies */}
      {!isCollapsed && replies.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            marginTop: "0.85rem",
          }}
        >
          {replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              allComments={allComments}
              currentUser={currentUser}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleSendReply={handleSendReply}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              submittingReply={submittingReply}
              formatDate={formatDate}
              collapsedThreads={collapsedThreads}
              toggleThread={toggleThread}
              setNotifyModal={setNotifyModal}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId }: { postId: number }) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("devvibe_user_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps | null>(
    null,
  );

  // Form states cho bình luận cha (top-level comment)
  const [newCommentText, setNewCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states cho câu trả lời nhúng (inline reply)
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [collapsedThreads, setCollapsedThreads] = useState<
    Record<number, boolean>
  >({});

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/user/me", {
        cache: "no-store",
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem("devvibe_user_cache", JSON.stringify(data.user));
          } catch (e) {}
          return;
        }
      }

      // Check admin
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
          setCurrentUser(adminObj);
          try {
            localStorage.setItem("devvibe_user_cache", JSON.stringify(adminObj));
          } catch (e) {}
          return;
        }
      }

      try {
        localStorage.removeItem("devvibe_user_cache");
      } catch (e) {}
      setCurrentUser(null);
    } catch (err) {
      try {
        localStorage.removeItem("devvibe_user_cache");
      } catch (e) {}
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
    window.addEventListener("user_auth_change", fetchCurrentUser);
    window.addEventListener("admin_auth_change", fetchCurrentUser);
    return () => {
      window.removeEventListener("user_auth_change", fetchCurrentUser);
      window.removeEventListener("admin_auth_change", fetchCurrentUser);
    };
  }, [postId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: newCommentText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewCommentText("");
        setComments((prev) => [data, ...prev]);
      } else {
        if (res.status === 401) {
          setCurrentUser(null);
          router.push(`/login?returnUrl=/post/${postId}`);
          return;
        }
        setErrorMsg(data.error || "Không thể gửi bình luận.");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (parentId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: replyText.trim(),
          parentId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyText("");
        setActiveReplyId(null);
        setComments((prev) => [...prev, data]);
        setCollapsedThreads((prev) => ({ ...prev, [parentId]: false }));
      } else {
        if (res.status === 401) {
          setCurrentUser(null);
          router.push(`/login?returnUrl=/post/${postId}`);
          return;
        }
        setNotifyModal({
          isOpen: true,
          title: "Lỗi gửi câu trả lời",
          message: data.error || "Không thể gửi câu trả lời.",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
      }
    } catch (err) {
      setNotifyModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Lỗi kết nối máy chủ.",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, content: data.content } : c,
          ),
        );
        return true;
      } else {
        setNotifyModal({
          isOpen: true,
          title: "Lỗi cập nhật",
          message: data.error || "Không thể cập nhật bình luận.",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
        return false;
      }
    } catch (err) {
      setNotifyModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Lỗi kết nối máy chủ.",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
      return false;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        // Xóa bình luận cùng toàn bộ các câu trả lời con (nếu có) khỏi state
        setComments((prev) => {
          const idsToDelete = new Set<number>([commentId]);
          let added = true;
          while (added) {
            added = false;
            for (const c of prev) {
              if (
                c.parentId &&
                idsToDelete.has(c.parentId) &&
                !idsToDelete.has(c.id)
              ) {
                idsToDelete.add(c.id);
                added = true;
              }
            }
          }
          return prev.filter((c) => !idsToDelete.has(c.id));
        });
      } else {
        setNotifyModal({
          isOpen: true,
          title: "Lỗi xóa bình luận",
          message: data.error || "Không thể xóa bình luận.",
          type: "error",
          onClose: () => setNotifyModal(null),
        });
      }
    } catch (err) {
      setNotifyModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Lỗi kết nối máy chủ.",
        type: "error",
        onClose: () => setNotifyModal(null),
      });
    }
  };

  const toggleThread = (commentId: number) => {
    setCollapsedThreads((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Lọc ra các bình luận gốc (không có parentId)
  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <section style={{ marginTop: "4rem", marginBottom: "3rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1.5rem",
          borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
          paddingBottom: "0.75rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--primary-blue), #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <MessageSquare size={18} />
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
          Bình luận bài viết ({comments.length})
        </h2>
      </div>

      {/* Khối nhập bình luận hoặc nút chuyển sang trang đăng nhập/đăng ký */}
      {currentUser ? (
        <div
          className="glass-panel"
          style={{ padding: "1.5rem", marginBottom: "2.5rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--primary-blue)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--primary-blue)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--text-main)",
                    display: "block",
                  }}
                >
                  {currentUser.name}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    display: "block",
                  }}
                >
                  {currentUser.email}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePostComment}>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Chia sẻ suy nghĩ, ý kiến thảo luận của bạn về bài viết này..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                resize: "vertical",
                minHeight: "90px",
                marginBottom: "0.75rem",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            />

            {errorMsg && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.88rem",
                  marginBottom: "0.75rem",
                }}
              >
                {errorMsg}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={submitting || !newCommentText.trim()}
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.4rem",
                  borderRadius: "12px",
                  fontWeight: 600,
                  opacity: submitting || !newCommentText.trim() ? 0.6 : 1,
                  cursor:
                    submitting || !newCommentText.trim()
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Gửi bình luận
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            textAlign: "center",
            marginBottom: "2.5rem",
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px dashed rgba(37, 99, 235, 0.4)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.12)",
              color: "var(--primary-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <Sparkles size={24} />
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Tham gia bình luận & thảo luận
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
              maxWidth: "480px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.5,
            }}
          >
            Vui lòng đăng nhập tài khoản độc giả để để lại ý kiến và trao đổi
            cùng cộng đồng DevVibe.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/login?returnUrl=/post/${postId}`}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <LogIn size={18} /> Đăng nhập để bình luận
            </Link>
            <Link
              href={`/register?returnUrl=/post/${postId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 600,
                background: "rgba(124, 58, 237, 0.1)",
                color: "#7c3aed",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <UserPlus size={18} /> Đăng ký thành viên
            </Link>
          </div>
        </div>
      )}

      {/* Danh sách bình luận theo dạng cây thảo luận */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem 0" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              <div className="skeleton skeleton-avatar" style={{ width: "42px", height: "42px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div className="skeleton skeleton-text" style={{ width: "120px", height: "16px", marginBottom: 0 }} />
                  <div className="skeleton skeleton-text" style={{ width: "80px", height: "14px", marginBottom: 0 }} />
                </div>
                <div className="skeleton skeleton-text" style={{ width: "95%", height: "15px", marginBottom: "0.4rem" }} />
                <div className="skeleton skeleton-text" style={{ width: "70%", height: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : topLevelComments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <MessageSquare
            size={36}
            color="var(--text-muted)"
            style={{ opacity: 0.5, marginBottom: "0.5rem" }}
          />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Chưa có bình luận nào. Hãy là người đầu tiên thảo luận về bài viết
            này!
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {topLevelComments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              allComments={comments}
              currentUser={currentUser}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyText={replyText}
              setReplyText={setReplyText}
              handleSendReply={handleSendReply}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              submittingReply={submittingReply}
              formatDate={formatDate}
              collapsedThreads={collapsedThreads}
              toggleThread={toggleThread}
              setNotifyModal={setNotifyModal}
            />
          ))}
        </div>
      )}
      {notifyModal && <NotificationModal {...notifyModal} />}
    </section>
  );
}
