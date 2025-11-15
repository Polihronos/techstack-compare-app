/**
 * Fastify Backend Templates
 */

export const fastifyTemplates = {
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
};
