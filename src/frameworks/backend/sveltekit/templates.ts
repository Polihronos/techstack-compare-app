/**
 * SvelteKit Backend Templates
 */

export const sveltekitTemplates = {
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
};
