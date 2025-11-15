# Framework Playground

Interactive code playground for testing and comparing frontend and backend frameworks side-by-side.

**[Live Demo on Vercel](https://techstack-compare-mu.vercel.app/)**

## What it does

**Frontend Mode:** Write code in Vanilla JS, React, Vue, Svelte, or Angular and see the output live. Auto-run updates the preview as you type. Switch between Simple mode (single file) and Advanced mode (separate HTML/CSS/JS files).

**Backend Mode:** Run Node.js backend frameworks in the browser using WebContainers. See server logs in the terminal and API responses in the preview. Full file system with npm package installation.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Supported Frameworks

### Frontend

- ✅ Vanilla JavaScript
- ✅ React 18 (CDN with Babel transpilation)
- ✅ Vue 3 (CDN)
- ✅ Svelte 5 (ESM compiler via esm.sh)
- ✅ Angular (TypeScript transpilation)

All frontend frameworks run in an isolated iframe with CDN-loaded libraries or runtime compilation.

### Backend

- ✅ Express.js
- ✅ Fastify
- ✅ Next.js (API Routes)
- ✅ SvelteKit

Backend frameworks run using [WebContainers](https://webcontainers.io/) - a browser-based Node.js runtime powered by WebAssembly. No backend server required.

## Features

- **Dual Mode Interface**: Switch between Frontend and Backend development modes
- **Simple & Advanced Modes**: Frontend supports single-file (Simple) or multi-file (Advanced) editing
- **Live Preview**: See output in real-time with auto-run (frontend) or manual server start (backend)
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **File Explorer**: Navigate and edit multiple files in Advanced mode
- **Terminal Output**: XTerm.js terminal for backend server logs
- **Resizable Panels**: Customize your workspace layout
- **Framework Switching**: Change frameworks without losing your code
- **Runs Entirely in Browser**: No backend server or API required

## Architecture

The project uses a modular, registry-based architecture for easy extensibility:

### Registry Pattern

All frameworks are registered in `src/frameworks/registry.ts` as a single source of truth. Each framework configuration includes:

- Metadata (name, description, icon, color)
- Templates (simple and advanced modes)
- Executor implementation

### Executor Pattern

Abstract base classes (`BaseFrontendExecutor`, `BaseBackendExecutor`) in `src/executors/base.ts` provide type-safe code execution. Each framework has its own executor:

- **Frontend**: Framework-specific execution (CDN injection, compilation, etc.)
- **Backend**: Shared WebContainer executor for all Node.js frameworks

### File Structure

```
src/
├── frameworks/
│   ├── types.ts              # Core type definitions
│   ├── registry.ts           # Framework registry
│   ├── frontend/
│   │   └── [framework]/
│   │       ├── config.ts     # Framework configuration
│   │       ├── simple.ts     # Simple mode template
│   │       └── advanced/     # Advanced mode templates
│   └── backend/
│       └── [framework]/
│           ├── config.ts     # Framework configuration
│           └── templates.ts  # File system templates
├── executors/
│   ├── base.ts              # Base executor classes
│   ├── frontend/            # Frontend executors
│   └── backend/             # Backend executor (WebContainers)
└── stores/
    └── app-store.ts         # Zustand state management
```

## Adding New Frameworks

### Frontend Framework

1. Create `src/frameworks/frontend/[name]/config.ts` with framework configuration
2. Add `simple.ts` with single-file template
3. Add `advanced/index.ts` with multi-file templates (HTML, CSS, JS)
4. Create executor in `src/executors/frontend/[name]-executor.ts`
5. Register in `src/frameworks/registry.ts`

### Backend Framework

1. Create `src/frameworks/backend/[name]/templates.ts` with file system structure
2. Add `config.ts` for framework configuration
3. Register in `src/frameworks/registry.ts` (uses shared WebContainer executor)

## Documentation

View the full component documentation:

- In the app: Click the "Docs" button in the header
- Locally: Open `public/docs/index.html` in your browser
- Generate/update docs: `npm run docs`

The documentation is generated using [TypeDoc](https://typedoc.org/) and includes:

- Component API documentation
- Hook usage guides
- Type definitions
- Architecture diagrams
- Search functionality

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run docs         # Generate documentation
npm run docs:watch   # Generate docs in watch mode

npm test              # Run tests in watch mode
npm run test:run      # Run once
npm run test:coverage # Generate coverage report
npm run test:ui       # Visual test UI
npm run e2e          # Run E2E tests (when ready)
```

## License

MIT
