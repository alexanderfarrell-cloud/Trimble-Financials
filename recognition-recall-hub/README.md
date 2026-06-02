# Trimble Financials Hub

React + TypeScript + Vite prototype for Trimble's construction financial management app. Built with [Trimble Modus Web Components](https://modus-web-components.trimble.com/).

Deployed on GitHub Pages at `/Trimble-Financials/`.

## Getting started

**Prerequisites:** Node.js LTS, Cursor IDE

```bash
npm install
npm run dev
# → http://localhost:5173/
```

## Modus Web Components

This project uses `@trimble-oss/moduswebcomponents-react` v1.3.0-react19.

- [Modus component docs](https://modus-web-components.trimble.com/)
- [Modus design system](https://modus.trimble.com/)

**Reference page for Modus usage patterns in this project:** `src/pages/JobDetail.tsx`

## Cursor + Modus MCP setup (team)

The `.cursor/mcp.json` at the repo root configures the Modus Docs MCP server so Cursor's Agent can look up component props, events, and React wiring without leaving the IDE.

**First-time setup:**

1. Open this repo in Cursor
2. Restart Cursor after pulling
3. Go to **Settings → Tools & MCP** — confirm `modus-docs` shows as connected (green)
4. If it shows red, click **Refresh** next to the server entry

**Using it:** In Agent mode, ask questions like:
- *"Look up `modus-wc-button` props for version 1.3.0"*
- *"What's the React event for `modus-wc-select`?"*

Always pass version **`1.3.0`** so the docs match the installed package.

**Troubleshooting:** If `mcp.json` doesn't load on Windows, add the server manually via **Settings → Tools & MCP → Add new MCP server** using the same config from `.cursor/mcp.json`.

## Project structure

```
recognition-recall-hub/
├── src/
│   ├── pages/          # Route-level page components
│   ├── context/        # React context (PeriodsContext)
│   ├── data/           # Static data / seed data
│   ├── hooks/          # Custom React hooks
│   ├── App.tsx         # Routes
│   ├── main.tsx        # Entry point + Modus setup
│   └── index.css       # Modus global styles + Tailwind
├── public/
│   └── modus-web-components/
│       └── modus-icons.css   # Modus icon font (jsDelivr CDN)
└── index.html          # Theme bootstrap script
```

## Deploy

- **Production (master):** GitHub Actions deploys to `gh-pages` branch → `/Trimble-Financials/`
- **Branch previews:** push any non-master branch → `/Trimble-Financials/branches/<slug>/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build locally |
