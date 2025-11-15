/**
 * Next.js Backend Templates
 */

export const nextjsTemplates = {
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
};
