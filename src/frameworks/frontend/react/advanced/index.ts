/**
 * React Advanced Mode Templates
 */

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Counter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="script.js"></script>
</body>
</html>`;

export const stylesCss = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  padding: 2rem;
  max-width: 400px;
}

h1 {
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.counter {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  transition: all 0.2s;
}

.btn:hover {
  background: #f0f0f0;
}

.btn:active {
  transform: scale(0.95);
}

.count-display {
  font-size: 2rem;
  font-weight: bold;
  min-width: 3rem;
  text-align: center;
}

.btn-reset {
  border-color: #dc2626;
  color: #dc2626;
}

.btn-reset:hover {
  background: #fee;
}`;

export const scriptJs = `// React - Counter Example
// Clean version without inline styles
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="container">
      <h1>Counter App</h1>
      <div className="counter">
        <button className="btn" onClick={() => setCount(count - 1)}>
          -
        </button>
        <span className="count-display">{count}</span>
        <button className="btn" onClick={() => setCount(count + 1)}>
          +
        </button>
      </div>
      <button className="btn btn-reset" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// React 18+ API
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Counter />);`;
