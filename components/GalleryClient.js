"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function GalleryClient({ items }) {
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <div className="gallery-toolbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`gallery-filter-pill${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="gallery-empty">No items in this category yet.</div>
      ) : (
        <div className="gallery-grid">
          {filtered.map((item, i) => (
            <div
              className="gallery-card reveal visible"
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(i)}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.src} muted preload="metadata" />
                  <div className="gallery-card-play">
                    <Play size={16} fill="currentColor" />
                  </div>
                </>
              ) : (
                <img src={item.src} alt={item.caption || "NK Udada photo"} loading="lazy" />
              )}
              {item.caption ? (
                <div className="gallery-card-overlay">{item.caption}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {active && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <X size={20} />
          </button>
          {filtered.length > 1 && (
            <>
              <button
                className="lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                className="lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}
          <div className="lightbox-media-wrap" onClick={(e) => e.stopPropagation()}>
            {active.type === "video" ? (
              <video src={active.src} controls autoPlay playsInline />
            ) : (
              <img src={active.src} alt={active.caption || "NK Udada photo"} />
            )}
            {active.caption && <div className="lightbox-caption">{active.caption}</div>}
          </div>
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
