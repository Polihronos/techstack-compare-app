/**
 * Vanilla JS Advanced Mode Templates
 */

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanilla JS Counter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <div class="container">
      <h1>Counter App</h1>
      <div class="counter">
        <button id="decrement" class="btn">-</button>
        <span id="count" class="count-display">0</span>
        <button id="increment" class="btn">+</button>
      </div>
      <button id="reset" class="btn btn-reset">Reset</button>
    </div>
  </div>
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

export const scriptJs = `// Vanilla JavaScript - Counter Example
// Clean version without embedded HTML
let count = 0;

const countEl = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');

function updateCount() {
  countEl.textContent = count;
}

incrementBtn.addEventListener('click', () => {
  count++;
  updateCount();
});

decrementBtn.addEventListener('click', () => {
  count--;
  updateCount();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateCount();
});`;
