const API_BASE = process.env.REACT_APP_NOTES_API || ""; // leave empty to use memory store

// Utilities
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const nowISO = () => new Date().toISOString();

const seedNotes = [
  {
    id: uid(),
    title: "Welcome to Notes",
    content: "This is your notes app. Create, edit, and organize notes by tags.",
    tags: ["getting-started", "info"],
    category: "General",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    title: "Ideas",
    content: "• Build a notes app\n• Try a new recipe\n• Learn TypeScript",
    tags: ["ideas"],
    category: "Personal",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

let memory = [...seedNotes];

// Attempt fetch; if API_BASE is not set or request fails, we fallback to memory implementation
async function apiFetch(path, options) {
  if (!API_BASE) throw new Error("No API configured");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function listNotes(query = {}) {
  /** List notes with simple client-side filtering fallback.
   * query: { search?: string, tag?: string, category?: string }
   * Returns: Promise<Note[]>
   */
  try {
    const qs = new URLSearchParams(query).toString();
    const data = await apiFetch(`/notes${qs ? `?${qs}` : ""}`, { method: "GET" });
    return data;
  } catch {
    // memory fallback
    let result = [...memory];
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(s) ||
          n.content.toLowerCase().includes(s) ||
          n.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    if (query.tag) {
      result = result.filter((n) => n.tags.includes(query.tag));
    }
    if (query.category) {
      result = result.filter((n) => (n.category || "") === query.category);
    }
    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id.
   * Returns: Promise<Note | null>
   */
  try {
    return await apiFetch(`/notes/${id}`, { method: "GET" });
  } catch {
    return memory.find((n) => n.id === id) || null;
  }
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note.
   * payload: { title, content, tags?: string[], category?: string }
   * Returns: Promise<Note>
   */
  const base = {
    id: uid(),
    title: (payload.title || "").trim() || "Untitled",
    content: payload.content || "",
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    category: payload.category || "General",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  try {
    return await apiFetch(`/notes`, { method: "POST", body: JSON.stringify(base) });
  } catch {
    memory.unshift(base);
    return base;
  }
}

// PUBLIC_INTERFACE
export async function updateNote(id, updates) {
  /** Update an existing note.
   * updates: Partial<Note>
   * Returns: Promise<Note>
   */
  try {
    return await apiFetch(`/notes/${id}`, { method: "PUT", body: JSON.stringify(updates) });
  } catch {
    const ix = memory.findIndex((n) => n.id === id);
    if (ix === -1) throw new Error("Note not found");
    const updated = { ...memory[ix], ...updates, updatedAt: nowISO() };
    memory[ix] = updated;
    return updated;
  }
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id.
   * Returns: Promise<void>
   */
  try {
    await apiFetch(`/notes/${id}`, { method: "DELETE" });
    return;
  } catch {
    memory = memory.filter((n) => n.id !== id);
  }
}

// PUBLIC_INTERFACE
export async function listTags() {
  /** List all unique tags. */
  try {
    const data = await apiFetch(`/tags`, { method: "GET" });
    return data;
  } catch {
    const set = new Set();
    memory.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }
}

// PUBLIC_INTERFACE
export async function listCategories() {
  /** List all unique categories. */
  try {
    const data = await apiFetch(`/categories`, { method: "GET" });
    return data;
  } catch {
    const set = new Set();
    memory.forEach((n) => set.add(n.category || "General"));
    return Array.from(set).sort();
  }
}
