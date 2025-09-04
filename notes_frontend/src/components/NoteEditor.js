import React, { useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Props:
 * - note: Note | null
 * - onSave: (updates: Partial<Note>) => Promise<void> | void
 * - onDelete: () => Promise<void> | void
 */
export default function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setCategory(note.category || "General");
      setTags(Array.isArray(note.tags) ? note.tags : []);
      setTagInput("");
    } else {
      setTitle("");
      setContent("");
      setCategory("General");
      setTags([]);
      setTagInput("");
    }
  }, [note?.id]);

  const valid = useMemo(() => title.trim().length > 0 || content.trim().length > 0, [title, content]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const handleSave = async () => {
    await onSave({ title, content, category, tags });
  };

  if (!note) {
    return (
      <div className="card editor">
        <div className="empty" style={{ padding: 32 }}>
          Select a note from the list or create a new one to start editing.
        </div>
      </div>
    );
  }

  return (
    <div className="card editor" aria-label="Note editor">
      <div className="editor-header">
        <input
          className="input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
      </div>

      <div className="editor-body">
        <div className="row">
          <input
            className="input"
            placeholder="Category (e.g., Work, Personal)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Note category"
            style={{ maxWidth: 260 }}
          />
          <div className="row" style={{ flex: 1 }}>
            <input
              className="input"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" ? addTag() : null}
              aria-label="Add tag"
              style={{ maxWidth: 240 }}
            />
            <button className="btn" onClick={addTag} aria-label="Add tag button">Add tag</button>
          </div>
        </div>

        <div className="tags-input">
          {tags.map((t) => (
            <span key={t} className="tag-pill" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              #{t}
              <button
                onClick={() => removeTag(t)}
                className="btn"
                aria-label={`Remove tag ${t}`}
                style={{ padding: "2px 8px", fontSize: "0.8rem" }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <textarea
          className="textarea"
          placeholder="Write your note here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Note content"
        />
      </div>

      <div className="footer">
        <div className="row">
          <button className="btn accent" disabled={!valid} onClick={handleSave} aria-disabled={!valid}>
            💾 Save
          </button>
          <button className="btn" onClick={() => { setTitle(""); setContent(""); setTags([]); setTagInput(""); }}>
            Reset
          </button>
        </div>
        <button className="btn" onClick={onDelete} aria-label="Delete note">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
