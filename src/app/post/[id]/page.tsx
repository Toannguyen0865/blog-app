import prisma from "@/lib/prisma";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id, 10);
    if (isNaN(postId)) return { title: "Không tìm thấy bài viết | DevVibe Blog" };

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { title: true, content: true, author: true },
    });

    if (!post) return { title: "Không tìm thấy bài viết | DevVibe Blog" };

    const desc = post.content.replace(/#+/g, "").replace(/\n/g, " ").slice(0, 160).trim() + "...";

    return {
      title: `${post.title} | DevVibe Blog`,
      description: desc,
      openGraph: {
        title: post.title,
        description: desc,
        type: "article",
        authors: [post.author],
      },
    };
  } catch {
    return { title: "DevVibe Blog - Nền tảng chia sẻ kiến thức" };
  }
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main
        className="container animate-fade-in"
        style={{ paddingBottom: "4rem" }}
      >
        <header style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "2rem",
              background: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={18} /> Trang chủ
          </Link>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            {post.title}
          </h1>
          <div className={styles.meta} style={{ marginBottom: "0.75rem" }}>
            <span>
              Bởi <strong>{post.author}</strong>
            </span>{" "}
            &bull;
            <span> {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
          {post.tags && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
              }}
            >
              {post.tags.split(",").map((t: string) => {
                const cleanTag = t.trim().replace(/^#/, "");
                if (!cleanTag) return null;
                return (
                  <Link
                    key={cleanTag}
                    href={`/?tag=${encodeURIComponent(cleanTag)}`}
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.8rem",
                        background: "rgba(37, 99, 235, 0.12)",
                        color: "var(--primary-blue)",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                    >
                      #{cleanTag}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </header>

        {post.imageUrl && (
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              borderRadius: "16px",
              marginBottom: "2rem",
              background: "rgba(37, 99, 235, 0.05)",
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <article className={`glass-panel ${styles.markdownContent}`}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--card-border)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LikeButton postId={post.id} initialLikes={(post as any).likes || 0} />
          </div>
        </article>

        {/* Khối thảo luận & bình luận */}
        <CommentSection postId={post.id} />
      </main>
    </>
  );
}
