/**
 * Vanilla JS - Simple Mode Template
 * Single file with inline styles
 */

export const vanillaSimpleTemplate = `// Vanilla JavaScript - Counter Example
const app = document.getElementById('app');

let count = 0;

app.innerHTML = \`
  <div style="font-family: system-ui; padding: 2rem; max-width: 400px;">
    <h1 style="color: #1a1a1a; margin-bottom: 1rem;">Counter App</h1>
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
      <button id="decrement" style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;">-</button>
      <span id="count" style="font-size: 2rem; font-weight: bold; min-width: 3rem; text-align: center;">0</span>
      <button id="increment" style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;">+</button>
    </div>
    <button id="reset" style="padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #dc2626; border-radius: 4px; background: white; color: #dc2626;">Reset</button>
  </div>
\`;

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
