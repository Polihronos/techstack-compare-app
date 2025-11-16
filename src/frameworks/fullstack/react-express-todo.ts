/**
 * React + Express Todo App Template
 * Full-stack example with CRUD operations
 */

import type { FullStackTemplate } from './types';

export const reactExpressTodo: FullStackTemplate = {
  id: 'react-express-todo',
  name: 'Todo App',
  description: 'Full-stack todo application with React frontend and Express backend',
  frontendFramework: 'react',
  backendFramework: 'express',

  files: {
    // Frontend files
    frontend: {
      'App.jsx': `function TodoApp() {
  const [todos, setTodos] = React.useState([]);
  const [newTodo, setNewTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const API_URL = '__BACKEND_URL__';

  // Fetch todos on mount
  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(\`\${API_URL}/api/todos\`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setError('');
      const response = await fetch(\`\${API_URL}/api/todos\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo('');
    } catch (err) {
      setError(err.message);
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError('');
      const todo = todos.find(t => t.id === id);
      const response = await fetch(\`\${API_URL}/api/todos/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError(err.message);
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      const response = await fetch(\`\${API_URL}/api/todos/\${id}\`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting todo:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <p>Loading todos...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '32px',
        marginBottom: '20px',
        color: '#1a1a1a'
      }}>
        📝 Todo App
      </h1>

      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Full-stack app: React frontend + Express backend
      </p>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33'
        }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={addTodo} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Add
          </button>
        </div>
      </form>

      <div>
        {todos.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
            No todos yet. Add one above! 👆
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {todos.map(todo => (
              <li
                key={todo.id}
                style={{
                  padding: '16px',
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.done ? 'line-through' : 'none',
                    color: todo.done ? '#999' : '#1a1a1a',
                    fontSize: '16px'
                  }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '12px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Total:</strong> {todos.length} todos ({todos.filter(t => t.done).length} completed)
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TodoApp />);`,

      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App - React + Express</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,

      'styles.css': `body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}`,
    },

    // Backend files
    backend: {
      'package.json': `{
  "name": "todo-api",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}`,

      'server.js': `import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// CORS configuration - allow all origins (not needed since same-origin, but kept for clarity)
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// In-memory database
let todos = [
  { id: 1, text: 'Learn React', done: false },
  { id: 2, text: 'Build REST API', done: true },
  { id: 3, text: 'Connect frontend to backend', done: false }
];

let nextId = 4;

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check');
  res.json({ status: 'ok', todos: todos.length });
});

// Routes
app.get('/api/todos', (req, res) => {
  console.log('GET /api/todos - Fetching all todos');
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  console.log('POST /api/todos - Request body:', req.body);
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    done: false
  };

  todos.push(newTodo);
  console.log(\`POST /api/todos - Created todo: \${text}\`);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(\`PUT /api/todos/\${id} - Request body:\`, req.body);
  const { done } = req.body;

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.done = done !== undefined ? done : todo.done;
  console.log(\`PUT /api/todos/\${id} - Updated todo: \${todo.text} (done: \${todo.done})\`);
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  console.log(\`DELETE /api/todos/\${id} - Deleted todo\`);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(\`\\n✅ Todo API server running on port \${PORT}\`);
  console.log(\`📋 Ready to serve \${todos.length} todos\`);
  console.log(\`🔗 Endpoints:\`);
  console.log(\`   GET    /api/todos\`);
  console.log(\`   POST   /api/todos\`);
  console.log(\`   PUT    /api/todos/:id\`);
  console.log(\`   DELETE /api/todos/:id\`);
  console.log(\`   GET    /health\\n\`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});`,

      'README.md': `# Todo API (Express)

## Available Endpoints

### GET /api/todos
Get all todos.

**Response:**
\`\`\`json
[
  { "id": 1, "text": "Learn React", "done": false },
  { "id": 2, "text": "Build REST API", "done": true }
]
\`\`\`

### POST /api/todos
Create a new todo.

**Request Body:**
\`\`\`json
{
  "text": "New todo item"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 3,
  "text": "New todo item",
  "done": false
}
\`\`\`

### PUT /api/todos/:id
Update a todo's status.

**Request Body:**
\`\`\`json
{
  "done": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 1,
  "text": "Learn React",
  "done": true
}
\`\`\`

### DELETE /api/todos/:id
Delete a todo.

**Response:** 204 No Content

## Features
- CORS enabled for cross-origin requests
- In-memory storage (resets on server restart)
- Full CRUD operations
- Input validation`,
    },
  },
};
