# Framework Playground

Interactive code playground for testing and comparing frontend and backend frameworks side-by-side.

## What it does

**Frontend Mode:** Write code in Vanilla JS, React, Vue, Svelte, or Angular and see the output live. Auto-run updates the preview as you type.

**Backend Mode:** Run Node.js backend frameworks in the browser using WebContainers. See server logs in the terminal and API responses in the preview.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Frontend Frameworks

- Vanilla JavaScript
- React 18 (with Babel)
- Vue 3
- Svelte 5 (with compiler)
- Angular (TypeScript transpilation)

All frameworks run in an isolated iframe using CDN resources.

## Backend Frameworks

- Express.js
- Fastify
- Next.js API Routes
- SvelteKit

Backend frameworks run using [WebContainers](https://webcontainers.io/) - a browser-based Node.js runtime powered by WebAssembly. No backend server required.

## Features

- Split-screen editor and preview
- Auto-run mode (frontend only)
- Resizable panels
- Terminal output for backend logs
- Framework switching without losing code
- Works entirely in your browser

## License

MIT
