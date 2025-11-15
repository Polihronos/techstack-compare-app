/**
 * Express.js Backend Templates
 */

export const expressTemplates = {
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
};
