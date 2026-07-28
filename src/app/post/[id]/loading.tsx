import React from "react";
import Navbar from "@/components/Navbar";

export default function PostLoading() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "3rem 1rem", maxWidth: "800px" }}>
        {/* Back button skeleton */}
        <div className="skeleton" style={{ width: "120px", height: "36px", borderRadius: "8px", marginBottom: "2rem" }} />

        {/* Title skeleton */}
        <div className="skeleton skeleton-title" style={{ width: "100%", height: "44px", marginBottom: "1rem" }} />
        <div className="skeleton skeleton-title" style={{ width: "70%", height: "44px", marginBottom: "1.5rem" }} />

        {/* Author metadata skeleton */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", padding: "1rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="skeleton skeleton-avatar" style={{ width: "48px", height: "48px" }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: "180px", height: "16px", marginBottom: "0.4rem" }} />
            <div className="skeleton skeleton-text" style={{ width: "120px", height: "14px" }} />
          </div>
        </div>

        {/* Cover image skeleton */}
        <div className="skeleton" style={{ width: "100%", height: "400px", borderRadius: "16px", marginBottom: "2.5rem" }} />

        {/* Article content skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          <div className="skeleton skeleton-text" style={{ width: "100%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "95%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "98%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "90%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "60%", height: "18px", marginBottom: "1rem" }} />

          <div className="skeleton skeleton-text" style={{ width: "100%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "92%", height: "18px" }} />
          <div className="skeleton skeleton-text" style={{ width: "96%", height: "18px" }} />
        </div>
      </main>
    </>
  );
}
