"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import styles from "@/app/page.module.css";
import LikeButton from "@/components/LikeButton";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  imageUrl?: string | null;
  tags?: string | null;
  createdAt: Date;
}

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Touch swipe states for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    if (posts.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [posts.length, isHovered]);

  if (!posts || posts.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEndX(currentX);
    if (touchStartX && Math.abs(currentX - touchStartX) > 10) {
      setIsSwiping(true);
    }
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section style={{ marginBottom: "3.5rem" }}>
      {/* Tiêu đề và Nút điều khiển Slider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Flame size={20} color="#ef4444" fill="#ef4444" />
          <h2
            style={{
              margin: 0,
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-main)",
            }}
          >
            Bài viết tiêu điểm
          </h2>
        </div>

        {posts.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                marginRight: "0.3rem",
              }}
            >
              {currentIndex + 1} / {posts.length}
            </span>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Bài trước"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid var(--card-border)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-blue)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "var(--primary-blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.color = "var(--text-main)";
                e.currentTarget.style.borderColor = "var(--card-border)";
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Bài tiếp theo"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid var(--card-border)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-blue)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "var(--primary-blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.color = "var(--text-main)";
                e.currentTarget.style.borderColor = "var(--card-border)";
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Khối hiển thị Carousel Track ngang */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
          touchAction: "pan-y",
          background: "rgba(255, 255, 255, 0.2)",
          padding: "2px 0",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            transition: isSwiping
              ? "none"
              : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            transform: `translateX(-${currentIndex * 100}%)`,
            width: "100%",
          }}
        >
          {posts.map((post, idx) => (
            <div
              key={post.id}
              style={{
                width: "100%",
                flexShrink: 0,
                display: "flex",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                opacity: idx === currentIndex ? 1 : 0.5,
                transform: idx === currentIndex ? "scale(1)" : "scale(0.98)",
              }}
            >
              <Link
                href={`/post/${post.id}`}
                onClick={(e) => {
                  if (isSwiping) {
                    e.preventDefault();
                  }
                }}
                style={{ display: "flex", width: "100%", textDecoration: "none" }}
              >
                <article
                  className="glass-panel"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                    margin: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className={styles.heroLayout} style={{ flex: 1, height: "100%", width: "100%" }}>
                    {post.imageUrl && (
                      <div className={styles.heroImageWrapper}>
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className={styles.cardImage}
                        />
                      </div>
                    )}
                    <div className={styles.heroBody}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.85rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.25rem 0.75rem",
                              background: "rgba(37, 99, 235, 0.12)",
                              color: "var(--primary-blue)",
                              borderRadius: "20px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            <Sparkles size={14} /> Nổi bật #{idx + 1}
                          </span>
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.85rem",
                            }}
                          >
                            &bull; Bởi {post.author}
                          </span>
                          <span
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.85rem",
                            }}
                          >
                            &bull;{" "}
                            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                          <LikeButton postId={post.id} initialLikes={(post as any).likes || 0} variant="badge" />
                        </div>

                        {post.tags && (
                          <div
                            style={{
                              display: "flex",
                              gap: "0.4rem",
                              flexWrap: "wrap",
                              marginBottom: "0.65rem",
                            }}
                          >
                            {post.tags.split(",").map((t: string) => {
                              const cleanTag = t.trim().replace(/^#/, "");
                              if (!cleanTag) return null;
                              return (
                                <span
                                  key={cleanTag}
                                  style={{
                                    padding: "0.2rem 0.65rem",
                                    background: "rgba(124, 58, 237, 0.12)",
                                    color: "#7c3aed",
                                    borderRadius: "14px",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  #{cleanTag}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <h2
                          style={{
                            fontSize: "1.85rem",
                            fontWeight: 800,
                            color: "var(--text-main)",
                            marginBottom: "0.85rem",
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.title}
                        </h2>

                        <p
                          style={{
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                            fontSize: "0.895rem",
                            marginBottom: "1.5rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.content}
                        </p>
                      </div>

                      <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                        <span
                          className="btn-primary"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.65rem 1.4rem",
                            borderRadius: "12px",
                            fontWeight: 600,
                          }}
                        >
                          <BookOpen size={18} /> Đọc bài viết &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Chấm tròn chỉ số điều hướng (Indicator Dots) */}
      {posts.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          {posts.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển đến bài ${idx + 1}`}
                style={{
                  width: isActive ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "10px",
                  background: isActive
                    ? "var(--primary-blue)"
                    : "rgba(148, 163, 184, 0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
