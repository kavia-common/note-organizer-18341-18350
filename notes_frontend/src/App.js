import React, { useEffect, useMemo, useState } from "react";
import "./theme.css";
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  listTags,
  listCategories,
  getNote,
} from "./services/notesService";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";

// PUBLIC_INTERFACE
function App() {
  /** App holds global UI state, fetches data from service, and composes the layout. */
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);

  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const active = useMemo(() => notes.find((n) => n.id === activeId) || null, [notes, activeId]);

  async function refreshData(opts = {}) {
    setLoading(true);
    try {
      const [ns, ts, cs] = await Promise.all([
        listNotes({ search, tag, category, ...opts }),
        listTags(),
        listCategories(),
      ]);
      setNotes(ns);
      setTags(ts);
      setCategories(cs);
      // maintain activeId if still present, else choose first
      if (ns.length > 0) {
        if (!ns.find((n) => n.id === activeId)) {
          setActiveId(ns[0].id);
        }
      } else {
        setActiveId(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tag, category]);

  const handleAddNote = async () => {
    const note = await createNote({
      title: "New note",
      content: "",
      tags: tag ? [tag] : [],
      category: category || "General",
    });
    await refreshData();
    setActiveId(note.id);
  };

  const handleSaveNote = async (updates) => {
    if (!active) return;
    await updateNote(active.id, updates);
    await refreshData();
    const updated = await getNote(active.id);
    if (updated) setActiveId(updated.id);
  };

  const handleDeleteNote = async () => {
    if (!active) return;
    await deleteNote(active.id);
    await refreshData();
  };

  return (
    <div className="app-shell">
      <TopBar search={search} onSearchChange={setSearch} onAddNote={handleAddNote} />
      <div className="layout">
        <Sidebar
          tags={tags}
          categories={categories}
          activeTag={tag}
          activeCategory={category}
          onSelectTag={setTag}
          onSelectCategory={setCategory}
        />
        <main className="main">
          <div className="content-grid">
            <div className="list">
              <NoteList
                notes={notes}
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
              />
            </div>
            <div>
              {loading ? (
                <div className="card empty">Loading…</div>
              ) : (
                <NoteEditor
                  note={active}
                  onSave={handleSaveNote}
                  onDelete={handleDeleteNote}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
