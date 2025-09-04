import React from "react";

/**
 * PUBLIC_INTERFACE
 * NoteList
 * Props:
 * - notes: Array<Note>
 * - activeId: string | null
 * - onSelect: (id: string) => void
 */
export default function NoteList({ notes, activeId, onSelect }) {
  return (
    <div className="card list" aria-label="Notes list">
      <div className="list-header">
        <strong>Notes</strong>
        <span style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
          {notes.length} {notes.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="list-scroll">
        {notes.length === 0 ? (
          <div className="empty">No notes match your filters.</div>
        ) : (
          notes.map((n) => (
            <div
              key={n.id}
              className={`note-item ${activeId === n.id ? "active" : ""}`}
              onClick={() => onSelect(n.id)}
              role="button"
              tabIndex={0}
            >
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-meta">
                <span>{new Date(n.updatedAt).toLocaleString()}</span>
                {n.category ? <span>· {n.category}</span> : null}
                {n.tags?.slice(0, 3).map((t) => (
                  <span key={t} className="tag-pill">#{t}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
