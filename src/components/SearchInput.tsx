"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  ChevronDown,
  Check,
  Tag,
  Clock,
  Calendar,
  SortAsc,
} from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function CustomDropdown({
  options,
  value,
  onChange,
  icon,
  placeholder,
  minWidth = "170px",
  className = "",
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  placeholder: string;
  minWidth?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const isModified = Boolean(value && value !== "desc");

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{ position: "relative", flex: `0 1 ${minWidth}`, minWidth }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          height: "44px",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          background: isModified
            ? "rgba(37, 99, 235, 0.08)"
            : "rgba(255, 255, 255, 0.95)",
          border: isModified
            ? "1px solid var(--primary-blue)"
            : "1px solid var(--card-border)",
          borderRadius: "12px",
          color: isModified ? "var(--primary-blue)" : "var(--text-main)",
          fontSize: "0.9rem",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen
            ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
            : "0 2px 6px rgba(0, 0, 0, 0.02)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
            flexShrink: 0,
            color: isModified ? "var(--primary-blue)" : "var(--text-muted)",
          }}
        />
      </button>

      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: "100%",
            minWidth: "100%",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderRadius: "14px",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 14px 36px rgba(0, 0, 0, 0.12)",
            padding: "0.4rem",
            zIndex: 100,
            maxHeight: "300px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  background: isSelected
                    ? "var(--primary-blue)"
                    : "transparent",
                  color: isSelected ? "#ffffff" : "var(--text-main)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: isSelected ? 600 : 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "rgba(37, 99, 235, 0.08)";
                    e.currentTarget.style.color = "var(--primary-blue)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-main)";
                  }
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TAG_OPTIONS: DropdownOption[] = [
  { label: "Tất cả Tags", value: "", icon: <Tag size={15} /> },
  { label: "#lập trình", value: "lập trình", icon: <Tag size={15} /> },
  { label: "#game", value: "game", icon: <Tag size={15} /> },
  { label: "#công nghệ", value: "công nghệ", icon: <Tag size={15} /> },
  { label: "#nextjs", value: "nextjs", icon: <Tag size={15} /> },
  { label: "#react", value: "react", icon: <Tag size={15} /> },
  { label: "#ai", value: "ai", icon: <Tag size={15} /> },
  { label: "#đời sống", value: "đời sống", icon: <Tag size={15} /> },
];

const SORT_OPTIONS: DropdownOption[] = [
  { label: "Mới nhất", value: "desc", icon: <Clock size={15} /> },
  { label: "Cũ nhất", value: "asc", icon: <Calendar size={15} /> },
  { label: "Tên A - Z", value: "title", icon: <SortAsc size={15} /> },
];

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSort = searchParams.get("sort") || "desc";

  const [query, setQuery] = useState(currentQuery);
  const [tag, setTag] = useState(currentTag);
  const [sort, setSort] = useState(currentSort);

  useEffect(() => {
    setQuery(currentQuery);
    setTag(currentTag);
    setSort(currentSort);
  }, [currentQuery, currentTag, currentSort]);

  const updateUrl = (newQuery: string, newTag: string, newSort: string) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newTag) params.set("tag", newTag);
    if (newSort && newSort !== "desc") params.set("sort", newSort);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, tag, sort);
  };

  const handleTagChange = (newTag: string) => {
    setTag(newTag);
    updateUrl(query, newTag, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateUrl(query, tag, newSort);
  };

  const handleClearAll = () => {
    setQuery("");
    setTag("");
    setSort("desc");
    router.push("/");
  };

  const isFiltered = Boolean(
    currentQuery || currentTag || currentSort !== "desc",
  );

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1rem 1.25rem",
        marginBottom: "2.5rem",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      }}
    >
      <form
        onSubmit={handleSearch}
        className="search-form"
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          margin: 0,
          flexWrap: "wrap",
        }}
      >
        {/* 1. Ô tìm kiếm từ khóa */}
        <div
          className="search-input-wrapper"
          style={{ position: "relative", flex: "1 1 240px", minWidth: "200px" }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm bài viết theo từ khóa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "2.8rem",
              paddingRight: "1rem",
              background: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem",
              margin: 0,
              height: "44px",
              borderRadius: "12px",
            }}
          />
        </div>

        {/* 2. Custom Dropdown cho Bộ lọc Tags */}
        <CustomDropdown
          options={TAG_OPTIONS}
          value={tag}
          onChange={handleTagChange}
          icon={
            <Filter
              size={16}
              style={{
                color: tag ? "var(--primary-blue)" : "var(--text-muted)",
              }}
            />
          }
          placeholder="Tất cả Tags"
          minWidth="180px"
          className="search-dropdown-tag"
        />

        {/* 3. Custom Dropdown cho Bộ lọc Sắp xếp */}
        <CustomDropdown
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          icon={
            <ArrowUpDown
              size={16}
              style={{
                color:
                  sort !== "desc" ? "var(--primary-blue)" : "var(--text-muted)",
              }}
            />
          }
          placeholder="Mới nhất"
          minWidth="160px"
          className="search-dropdown-sort"
        />

        {/* 4. Nút Tìm kiếm */}
        <button
          type="submit"
          className="btn-primary search-submit-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            padding: "0 1.5rem",
            fontWeight: 600,
            borderRadius: "12px",
            height: "44px",
            flex: "0 0 auto",
          }}
        >
          <Search size={18} /> Tìm
        </button>

        {/* 5. Nút xóa bộ lọc khi có thay đổi */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleClearAll}
            className="search-clear-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              padding: "0 1rem",
              fontWeight: 600,
              borderRadius: "12px",
              height: "44px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s ease",
            }}
          >
            <X size={16} /> Xóa
          </button>
        )}
      </form>
    </div>
  );
}
