"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertTriangle, LogOut, Info } from "lucide-react";

export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "confirm" | "success" | "error" | "info" | "logout";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function NotificationModal({
  isOpen,
  title,
  message,
  type = "info",
  confirmText,
  cancelText = "Hủy bỏ",
  onConfirm,
  onClose,
  autoCloseMs,
}: NotificationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    let timer: NodeJS.Timeout;
    if (autoCloseMs && autoCloseMs > 0 && type !== "confirm" && type !== "logout") {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
    }

    return () => {
      document.body.style.overflow = "unset";
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoCloseMs, type, onClose]);

  if (!isOpen || typeof window === "undefined" || typeof document === "undefined" || !document.body) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={36} color="#10b981" />;
      case "error":
      case "confirm":
        return <AlertTriangle size={36} color="#ef4444" />;
      case "logout":
        return <LogOut size={36} color="#ef4444" />;
      default:
        return <Info size={36} color="#3b82f6" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.12)";
      case "error":
      case "logout":
      case "confirm":
        return "rgba(239, 68, 68, 0.12)";
      default:
        return "rgba(59, 130, 246, 0.12)";
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          padding: "2.5rem 2rem",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.98)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)",
          borderRadius: "24px",
          position: "relative",
          backdropFilter: "blur(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            background: "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s ease",
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.2rem",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: getBgColor(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getIcon()}
          </div>
        </div>

        <h3
          style={{
            marginBottom: "0.6rem",
            fontSize: "1.35rem",
            color: "#0f172a",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#64748b",
            marginBottom: "2rem",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          {type === "confirm" || type === "logout" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.2rem",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onConfirm) onConfirm();
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.2rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                }}
              >
                {confirmText || "Đồng ý"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              style={{
                width: "100%",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "none",
                background:
                  type === "success"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow:
                  type === "success"
                    ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                    : "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
            >
              {confirmText || "Đóng thông báo"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
