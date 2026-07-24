# StitchBox: Development Handoff & Project Context

## 1. Project Overview
StitchBox is a client-side design inspiration board tailored for capturing visual assets, analyzing their structural "DNA" via Gemini Flash, and outputting highly customized code specifications matching Google Stitch's `DESIGN.md` prompt formatting rules.

## 2. Tech Stack
*   **Framework:** React 18 (Vite Bundler)
*   **Styling:** Tailwind CSS (Utility-first, dark theme config)
*   **AI Engine:** `@google/generative-ai` SDK (running client-side)
*   **State Management:** React local state, persisted securely via browser `localStorage`

## 3. Project Directory Structure
```text
stitchbox/
├── ANTIGRAVITY_CONTEXT.md   <-- (This Context File)
├── package.json
├── tailwind.config.js
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx               <-- (Main Application Component)