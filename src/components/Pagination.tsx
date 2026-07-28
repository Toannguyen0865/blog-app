"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/app/page.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query?: string;
  tag?: string;
  sort?: string;
}

export default function Pagination({ currentPage, totalPages, query, tag, sort }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tag) params.set("tag", tag);
    if (sort && sort !== "desc") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  // Build page numbers to show: always show first, last, current, and neighbors
  const getPageNumbers = (): (number | "dots")[] => {
    const pages: (number | "dots")[] = [];
    const delta = 1; // neighbors around current

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("dots");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("dots");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className={styles.pagination} aria-label="Phân trang">
      {/* Prev button */}
      {currentPage <= 1 ? (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
          <ChevronLeft size={18} />
        </span>
      ) : (
        <Link href={buildUrl(currentPage - 1)} className={styles.pageBtn} aria-label="Trang trước">
          <ChevronLeft size={18} />
        </Link>
      )}

      {/* Page number buttons */}
      {pages.map((page, idx) =>
        page === "dots" ? (
          <span key={`dots-${idx}`} className={styles.pageDots}>
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ""}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next button */}
      {currentPage >= totalPages ? (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
          <ChevronRight size={18} />
        </span>
      ) : (
        <Link href={buildUrl(currentPage + 1)} className={styles.pageBtn} aria-label="Trang sau">
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
