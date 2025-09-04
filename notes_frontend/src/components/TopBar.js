import React from "react";

/**
 * PUBLIC_INTERFACE
 * TopBar
 * Props:
 * - search: string
 * - onSearchChange: (value: string) => void
 * - onAddNote: () => void
 */
export default function TopBar({ search, onSearchChange, onAddNote }) {
  return (
    <div className="topbar">
      <div className="brand" aria-label="App brand">
        <div className="brand-badge" />
        <div className="brand-title">Notes</div>
      </div>

      <div className="search" role="search">
        <span aria-hidden="true">🔎</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes by title, content, or tags…"
          aria-label="Search notes"
        />
      </div>

      <button className="btn primary" onClick={onAddNote} aria-label="Add note">
        ➕ Add Note
      </button>
    </div>
  );
}
