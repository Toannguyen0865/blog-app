import prisma from "@/lib/prisma";
import Link from "next/link";
import { Settings, Sparkles, Flame, BookOpen, Search, Tag } from "lucide-react";
import styles from "./page.module.css";
import SearchInput from "@/components/SearchInput";
import TagBar from "@/components/TagBar";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  const tag = resolvedParams?.tag || "";
  const sort = resolvedParams?.sort || "desc";

  const whereCondition: any = {};
  if (query) {
    whereCondition.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
      { tags: { contains: query } },
    ];
  }
  if (tag) {
    whereCondition.tags = { contains: tag };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "asc") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "title") {
    orderBy = { title: "asc" };
  }

  const posts = await prisma.post.findMany({
    where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
    orderBy,
  });

  // Mục 4: Bài viết tiêu điểm (chỉ hiện ở trang chủ tổng khi không tìm kiếm, lọc hay sắp xếp khác)
  const isFiltering = Boolean(query || tag || sort !== "desc");
  const featuredPosts = !isFiltering ? posts.slice(0, 3) : [];
  const displayPosts = !isFiltering
    ? posts.slice(Math.min(3, posts.length))
    : posts;

  return (
    <>
      <Navbar />
      <main
        className="container animate-fade-in"
        style={{ paddingBottom: "4rem" }}
      >
        {/* 1. Top Navbar */}

        {/* 2. Hero Intro Banner trung tâm */}
        <section
          style={{
            textAlign: "center",
            marginBottom: "2.5rem",
            padding: "0 1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "var(--text-main)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.5px",
              lineHeight: 1.25,
            }}
          >
            Khám phá thế giới Lập trình & Công nghệ
          </h1>
          <p
            style={{
              margin: "0 auto",
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              maxWidth: "680px",
            }}
          >
            Chia sẻ kiến thức phần mềm, xu hướng công nghệ mới nhất và câu
            chuyện thú vị về đời sống lập trình viên mỗi ngày.
          </p>
        </section>

        {/* 3. Khối điều khiển Tìm kiếm & Bộ lọc (bên trong SearchInput) */}
        <SearchInput />

        {/* 4. Thẻ Hero Bài viết nổi bật nhất (hiển thị dạng Slide 3 bài) */}
        {featuredPosts.length > 0 && <HeroSlider posts={featuredPosts} />}

        {/* 5. Thanh Điều hướng Tag chuyên biệt */}
        <TagBar />

        {/* Tiêu đề phần danh sách bài viết còn lại */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h2
            style={{
              margin: "0",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-main)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {query ? (
              <>
                <Search size={22} color="var(--primary-blue)" /> Kết quả tìm
                kiếm cho "{query}"
              </>
            ) : tag ? (
              <>
                <Tag size={22} color="var(--primary-blue)" /> Các bài viết thuộc
                tag #{tag}
              </>
            ) : (
              <>
                <Flame size={22} color="#ef4444" fill="#ef4444" /> Các bài viết
                mới nhất
              </>
            )}
          </h2>
          <span
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {displayPosts.length} bài viết
          </span>
        </div>

        <div className={styles.grid}>
          {displayPosts.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "4rem 2rem",
                color: "var(--text-muted)",
                borderRadius: "16px",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem" }}>
                {query || tag
                  ? `Không tìm thấy bài viết nào phù hợp.`
                  : "Chưa có bài viết nào. Hãy thêm bài viết trong trang quản trị."}
              </p>
            </div>
          ) : (
            displayPosts.map((post: any) => (
              <Link
                href={`/post/${post.id}`}
                key={post.id}
                style={{ display: "block" }}
              >
                <article className={`glass-panel ${styles.card}`}>
                  {post.imageUrl && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className={styles.cardImage}
                      />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    {post.tags && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.35rem",
                          flexWrap: "wrap",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {post.tags.split(",").map((t: string) => {
                          const cleanTag = t.trim().replace(/^#/, "");
                          if (!cleanTag) return null;
                          return (
                            <span
                              key={cleanTag}
                              style={{
                                padding: "0.15rem 0.55rem",
                                background: "rgba(37, 99, 235, 0.1)",
                                color: "var(--primary-blue)",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              #{cleanTag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <h2>{post.title}</h2>
                    <div className={styles.meta}>
                      <span>Bởi {post.author}</span> &bull;
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className={styles.content}>
                      {post.content.length > 150
                        ? post.content.substring(0, 150) + "..."
                        : post.content}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </main>
    </>
  );
}
