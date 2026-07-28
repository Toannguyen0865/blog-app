import React from "react";
import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingBottom: "4rem" }}>
        {/* Skeleton Header */}
        <div style={{ margin: "2rem 0", textAlign: "center" }}>
          <div
            className="skeleton skeleton-title"
            style={{ width: "350px", height: "40px", margin: "0 auto 1rem" }}
          />
          <div
            className="skeleton skeleton-text"
            style={{ width: "250px", margin: "0 auto" }}
          />
        </div>

        {/* Skeleton Search / Tag Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            margin: "2rem 0",
            flexWrap: "wrap",
          }}
        >
          <div
            className="skeleton"
            style={{
              flex: 1,
              minWidth: "250px",
              height: "46px",
              borderRadius: "12px",
            }}
          />
          <div
            className="skeleton"
            style={{ width: "120px", height: "46px", borderRadius: "12px" }}
          />
        </div>

        {/* Skeleton Hero / Slider */}
        <div
          className="skeleton"
          style={{
            width: "100%",
            height: "320px",
            borderRadius: "20px",
            marginBottom: "3rem",
          }}
        />

        {/* Skeleton Grid for Posts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card" style={{ padding: "1rem" }}>
              {/* Image thumbnail */}
              <div
                className="skeleton"
                style={{
                  width: "100%",
                  height: "180px",
                  borderRadius: "12px",
                  marginBottom: "0.5rem",
                }}
              />
              {/* Author and Date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  margin: "0.5rem 0",
                }}
              >
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex: 1 }}>
                  <div
                    className="skeleton skeleton-text"
                    style={{
                      width: "60%",
                      marginBottom: "0.25rem",
                      height: "0.85rem",
                    }}
                  />
                  <div
                    className="skeleton skeleton-text"
                    style={{ width: "40%", height: "0.75rem" }}
                  />
                </div>
              </div>
              {/* Title */}
              <div
                className="skeleton skeleton-title"
                style={{ width: "90%", height: "1.4rem", marginBottom: "0.5rem" }}
              />
              {/* Excerpt */}
              <div
                className="skeleton skeleton-text"
                style={{ width: "100%" }}
              />
              <div className="skeleton skeleton-text" style={{ width: "80%" }} />
              {/* Tags / Footer */}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <div
                  className="skeleton"
                  style={{ width: "60px", height: "24px", borderRadius: "12px" }}
                />
                <div
                  className="skeleton"
                  style={{ width: "80px", height: "24px", borderRadius: "12px" }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
