import React from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Props:
 * - tags: string[]
 * - categories: string[]
 * - activeTag: string | null
 * - activeCategory: string | null
 * - onSelectTag: (tag: string | null) => void
 * - onSelectCategory: (category: string | null) => void
 */
export default function Sidebar({
  tags,
  categories,
  activeTag,
  activeCategory,
  onSelectTag,
  onSelectCategory,
}) {
  return (
    <aside className="sidebar" aria-label="Sidebar filters">
      <div className="section">
        <div className="section-title">Filters</div>
        <div className="chips" style={{ marginBottom: 12 }}>
          <button className={`chip ${!activeTag && !activeCategory ? "active" : ""}`} onClick={() => { onSelectTag(null); onSelectCategory(null); }}>
            All
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Categories</div>
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? "active" : ""}`}
              onClick={() => onSelectCategory(activeCategory === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-title">Tags</div>
        <div className="chips">
          {tags.map((t) => (
            <button
              key={t}
              className={`chip ${activeTag === t ? "active" : ""}`}
              onClick={() => onSelectTag(activeTag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
