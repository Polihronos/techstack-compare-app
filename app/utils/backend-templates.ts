// Backend framework templates for WebContainer execution

export const BACKEND_TEMPLATES = {
  express: {
    name: 'Express.js',
    files: {
      'README.md': `# Express.js Server

## Available Endpoints

### GET /
Returns a simple greeting message.

**Response:**
\`\`\`json
{
  "message": "Hello from Express!"
}
\`\`\`

### GET /api/users
Returns a list of all users.

**Response:**
\`\`\`json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
\`\`\`

### POST /api/users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Charlie"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "name": "Charlie"
}
\`\`\`

## Files Structure
- \`server.js\` - Main Express server with all routes and middleware
- \`package.json\` - Dependencies configuration

## Features
- JSON middleware for parsing request bodies
- RESTful API endpoints
- Simple and straightforward Express.js setup`,
      'package.json': `{
  "name": "express-server",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
      'server.js': `import express from 'express';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  res.status(201).json({ id: 3, ...newUser });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
    }
  },

  fastify: {
    name: 'Fastify',
    files: {
      'README.md': `# Fastify Server

## Available Endpoints

### GET /
Returns a simple greeting message.

**Response:**
\`\`\`json
{
  "message": "Hello from Fastify!"
}
\`\`\`

### GET /api/users
Returns a list of all users.

**Response:**
\`\`\`json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
\`\`\`

### POST /api/users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Charlie"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "name": "Charlie"
}
\`\`\`

## Files Structure
- \`server.js\` - Main Fastify server with all routes
- \`package.json\` - Dependencies configuration

## Features
- Built-in logging with Pino
- High performance and low overhead
- Async/await support throughout
- Schema-based validation ready`,
      'package.json': `{
  "name": "fastify-server",
  "type": "module",
  "dependencies": {
    "fastify": "^4.25.0"
  }
}`,
      'server.js': `import Fastify from 'fastify';

const fastify = Fastify({ logger: true });
const PORT = 3001;

// Routes
fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify!' };
});

fastify.get('/api/users', async (request, reply) => {
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
});

fastify.post('/api/users', async (request, reply) => {
  const newUser = request.body;
  reply.code(201);
  return { id: 3, ...newUser };
});

// Start server
try {
  await fastify.listen({ port: PORT });
  console.log(\`Server running on port \${PORT}\`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}`
    }
  },

  nextjs: {
    name: 'Next.js API Routes',
    files: {
      'README.md': `# Next.js API Routes

## Available Endpoints

### GET /api/hello
Returns a simple greeting message.

**Response:**
\`\`\`json
{
  "message": "Hello from Next.js API!"
}
\`\`\`

### GET /api/users
Returns a list of all users.

**Response:**
\`\`\`json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
\`\`\`

### POST /api/users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Charlie"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "name": "Charlie"
}
\`\`\`

## Files Structure
- \`pages/api/hello.js\` - Hello endpoint
- \`pages/api/users.js\` - Users CRUD endpoint
- \`pages/index.js\` - Home page with API links`,
      'package.json': `{
  "name": "nextjs-api",
  "scripts": {
    "dev": "next dev -p 3001"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
      'pages/api/hello.js': `export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js API!' });
}`,
      'pages/api/users.js': `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}`,
      'pages/index.js': `export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Next.js API Routes</h1>
      <p>Visit:</p>
      <ul>
        <li><a href="/api/hello">/api/hello</a></li>
        <li><a href="/api/users">/api/users</a></li>
      </ul>
    </div>
  );
}`
    }
  },

  sveltekit: {
    name: 'SvelteKit',
    files: {
      'README.md': `# SvelteKit Server

## Available Endpoints

### GET /api/hello
Returns a simple greeting message.

**Response:**
\`\`\`json
{
  "message": "Hello from SvelteKit!"
}
\`\`\`

### GET /api/users
Returns a list of all users.

**Response:**
\`\`\`json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
\`\`\`

### POST /api/users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Charlie"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "name": "Charlie"
}
\`\`\`

## Files Structure
- \`src/routes/+page.svelte\` - Home page with API links
- \`src/routes/api/hello/+server.js\` - Hello endpoint
- \`src/routes/api/users/+server.js\` - Users CRUD endpoint
- \`src/app.html\` - Base HTML template

## Svelte 5 Features
This template uses Svelte 5 with runes (\`$state\`, \`$derived\`, etc.)`,
      'package.json': `{
  "name": "sveltekit-server",
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3001"
  },
  "dependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "svelte": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,
      'svelte.config.js': `import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter()
  }
};`,
      'vite.config.js': `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3001
  }
});`,
      'src/app.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`,
      'src/routes/+page.svelte': `<script>
  let name = $state('SvelteKit');
</script>

<div style="padding: 2rem; font-family: system-ui;">
  <h1>Welcome to {name}!</h1>
  <p>Visit:</p>
  <ul>
    <li><a href="/api/hello">/api/hello</a></li>
    <li><a href="/api/users">/api/users</a></li>
  </ul>
</div>`,
      'src/routes/api/hello/+server.js': `import { json } from '@sveltejs/kit';

export function GET() {
  return json({ message: 'Hello from SvelteKit!' });
}`,
      'src/routes/api/users/+server.js': `import { json } from '@sveltejs/kit';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

export function GET() {
  return json(users);
}

export async function POST({ request }) {
  const newUser = await request.json();
  const user = { id: users.length + 1, ...newUser };
  users.push(user);
  return json(user, { status: 201 });
}`
    }
  }
};

export type BackendFramework = keyof typeof BACKEND_TEMPLATES;
