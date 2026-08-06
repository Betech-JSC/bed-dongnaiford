"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
  level: number; // 2 or 3
}

/**
 * Parse HTML content string and extract H2/H3 headings.
 * Returns an array of TocHeading items.
 */
export function parseHeadings(html: string): TocHeading[] {
  if (!html) return [];
  const headings: TocHeading[] = [];
  const regex = /<h([23])\b[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  const seen = new Map<string, number>();

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    // Strip HTML tags from heading text
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    // Generate slug from text
    let slug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) slug = `heading-${headings.length}`;

    // Ensure uniqueness
    const count = seen.get(slug) || 0;
    seen.set(slug, count + 1);
    const id = count > 0 ? `${slug}-${count}` : slug;

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Inject id attributes into H2/H3 tags in the HTML content.
 * This allows anchor links to scroll to the correct heading.
 */
export function injectHeadingIds(html: string, headings: TocHeading[]): string {
  if (!html || headings.length === 0) return html;

  let headingIndex = 0;
  return html.replace(/<h([23])\b([^>]*)>/gi, (fullMatch, level, attrs) => {
    if (headingIndex >= headings.length) return fullMatch;
    const heading = headings[headingIndex];
    headingIndex++;
    // Remove existing id if any
    const cleanAttrs = attrs.replace(/\s*id\s*=\s*["'][^"']*["']/gi, "").trim();
    return `<h${level} id="${heading.id}"${cleanAttrs ? " " + cleanAttrs : ""}>`;
  });
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll spy: observe headings and update active one
  useEffect(() => {
    if (headings.length === 0) return;

    // Small delay to ensure heading elements are rendered
    const timeout = setTimeout(() => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find the first visible heading
          const visibleEntries = entries.filter((e) => e.isIntersecting);
          if (visibleEntries.length > 0) {
            setActiveId(visibleEntries[0].target.id);
          }
        },
        {
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        }
      );

      headingElements.forEach((el) => {
        observerRef.current?.observe(el);
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      // Update URL hash without jumping
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="toc-container" aria-label="Mục lục bài viết">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="toc-header"
        aria-expanded={isExpanded}
      >
        <span className="toc-title">
          <List className="w-[18px] h-[18px]" />
          Nội dung bài viết
        </span>
        <span className="toc-toggle-icon">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      <div
        className={`toc-body ${isExpanded ? "toc-body--open" : "toc-body--closed"}`}
      >
        <ol className="toc-list">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`toc-item ${heading.level === 3 ? "toc-item--sub" : ""} ${
                activeId === heading.id ? "toc-item--active" : ""
              }`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className="toc-link"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
