# Notes Frontend

A modern, minimalistic React notes application with a sidebar for filters, a top bar for global actions, and a main content area for listing and editing notes.

## Features

- Create, edit, and delete notes
- Display notes in a list with quick metadata
- Search and filter by keyword, tag, or category
- Organize notes by category or tag
- Responsive design for desktop and mobile
- In-memory data store with optional REST API backend

## Quick Start

Install dependencies and run:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Optional Backend

By default, the app uses an in-memory data store. To connect to a backend (notes_database), expose a REST API and set the base URL:

Create `.env`:
```
REACT_APP_NOTES_API=http://localhost:4000/api
```

Endpoints expected (typical):
- GET    /notes?search=&tag=&category=
- GET    /notes/:id
- POST   /notes
- PUT    /notes/:id
- DELETE /notes/:id
- GET    /tags
- GET    /categories

See `.env.example` for reference.

## Project Structure

- src/theme.css — Design tokens and layout styles
- src/services/notesService.js — Data service with memory fallback
- src/components/TopBar.js — Global actions and search
- src/components/Sidebar.js — Filters by category/tag
- src/components/NoteList.js — Notes list with selection
- src/components/NoteEditor.js — Editor for title, content, tags, category
- src/App.js — Composition and state management

## Colors

Palette used:
- Primary: #1976d2
- Secondary: #1565c0
- Accent: #ffca28

## Scripts

- npm start — Run dev server
- npm test — Run tests
- npm run build — Production build

