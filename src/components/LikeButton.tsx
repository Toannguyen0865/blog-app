"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import styles from "./LikeButton.module.css";

interface LikeButtonProps {
  postId: number;
  initialLikes?: number;
  variant?: "button" | "badge";
}

const STORAGE_KEY = "devvibe_liked_posts";

export default function LikeButton({
  postId,
  initialLikes = 0,
  variant = "button",
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const likedArray: number[] = JSON.parse(stored);
        if (Array.isArray(likedArray) && likedArray.includes(postId)) {
          setIsLiked(true);
        }
      }
    } catch {
      // Bỏ qua lỗi parse localStorage nếu có
    }
  }, [postId]);

  if (variant === "badge") {
    return (
      <span className={styles.badge} title="Số lượt thích">
        <Heart size={14} fill="#db2777" color="#db2777" />
        <span className={styles.count}>{likes}</span>
      </span>
    );
  }

  const handleToggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const nextLiked = !isLiked;
    const action = nextLiked ? "like" : "unlike";
    const nextLikes = nextLiked ? likes + 1 : Math.max(0, likes - 1);

    // Optimistic UI update
    setIsLiked(nextLiked);
    setLikes(nextLikes);
    if (nextLiked) {
      setIsAnimate(true);
      setTimeout(() => setIsAnimate(false), 500);
    }

    // Cập nhật localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let likedArray: number[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(likedArray)) likedArray = [];

      if (nextLiked && !likedArray.includes(postId)) {
        likedArray.push(postId);
      } else if (!nextLiked) {
        likedArray = likedArray.filter((id) => id !== postId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedArray));
    } catch {
      // Bỏ qua lỗi localStorage
    }

    // Gửi request lên server
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === "number") {
          setLikes(data.likes);
        }
      } else {
        // Revert nếu lỗi server
        setIsLiked(!nextLiked);
        setLikes(likes);
      }
    } catch {
      // Revert nếu lỗi mạng
      setIsLiked(!nextLiked);
      setLikes(likes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      className={`${styles.likeContainer} ${isLiked ? styles.liked : ""}`}
      aria-label={isLiked ? "Bỏ thích bài viết" : "Thích bài viết"}
    >
      <Heart
        size={20}
        className={styles.heartIcon}
        fill={isLiked ? "#ffffff" : "transparent"}
        color={isLiked ? "#ffffff" : "#ec4899"}
      />
      <span>{isLiked ? "Đã thích" : "Thích bài viết"}</span>
      <span className={styles.count}>• {likes}</span>
    </button>
  );
}
