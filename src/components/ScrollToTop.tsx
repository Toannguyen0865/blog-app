"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

const emptySubscribe = () => () => {};

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Kiểm tra vị trí cuộn ngay khi mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isClient || typeof document === "undefined") return null;

  return createPortal(
    <button
      onClick={scrollToTop}
      title="Cuộn lên đầu trang"
      className={`scroll-to-top-btn ${isVisible ? "show" : ""}`}
    >
      <ArrowUp size={22} />
    </button>,
    document.body
  );
}
