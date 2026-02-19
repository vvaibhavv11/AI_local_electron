---
description: Always use pnpm as the package manager for this project
---

## Package Manager

This project uses **pnpm** as the package manager. Always use `pnpm` commands:

- `pnpm install` — install dependencies
- `pnpm run dev` — run both React + Electron dev servers
- `pnpm run dev:react` — run only the Vite dev server
- `pnpm run dev:electron` — run only the Electron process  
- `pnpm run build` — build the React frontend
- `pnpm run dist:linux` — build Linux distribution
- `pnpm run dist:mac` — build macOS distribution
- `pnpm run dist:win` — build Windows distribution

**Never** use `npm`, `npx`, `yarn`, or `bun` directly for this project.
