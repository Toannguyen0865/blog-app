"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tag, Sparkles } from "lucide-react";

const TAGS = [
  { label: "Tất cả", value: "" },
  { label: "#lập trình", value: "lập trình" },
  { label: "#game", value: "game" },
  { label: "#công nghệ", value: "công nghệ" },
  { label: "#nextjs", value: "nextjs" },
  { label: "#react", value: "react" },
  { label: "#ai", value: "ai" },
  { label: "#đời sống", value: "đời sống" },
];

export default function TagBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || "";
  const currentQuery = searchParams.get("q") || "";

  const handleTagClick = (value: string) => {
    if (value) {
      // Khi chọn tag, chỉ lọc theo tag và không gộp chung với tìm kiếm
      router.push(`/?tag=${encodeURIComponent(value)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.55rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <span
        style={{
          fontSize: "0.95rem",
          color: "var(--text-main)",
          fontWeight: 700,
          marginRight: "0.3rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <Tag size={18} color="var(--primary-blue)" /> Khám phá Tags:
      </span>
      {TAGS.map((tag) => {
        const isActive =
          !currentQuery && currentTag.toLowerCase() === tag.value.toLowerCase();
        return (
          <button
            key={tag.label}
            type="button"
            onClick={() => handleTagClick(tag.value)}
            style={{
              padding: "0.4rem 0.95rem",
              borderRadius: "20px",
              fontSize: "0.88rem",
              fontWeight: 600,
              fontFamily: "inherit",
              border: isActive
                ? "1px solid var(--primary-blue)"
                : "1px solid var(--card-border)",
              background: isActive
                ? "var(--primary-blue)"
                : "rgba(255, 255, 255, 0.75)",
              color: isActive ? "#ffffff" : "var(--text-main)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: isActive
                ? "0 4px 14px rgba(37, 99, 235, 0.3)"
                : "0 2px 6px rgba(0, 0, 0, 0.03)",
            }}
          >
            {tag.value === "" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                Tất cả
              </span>
            ) : (
              tag.label
            )}
          </button>
        );
      })}
    </div>
  );
}
