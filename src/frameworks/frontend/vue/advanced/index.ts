/**
 * Vue 3 Advanced Mode Templates
 */

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Counter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
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

export const scriptJs = `// Vue 3 - Counter Example
// Clean version without inline styles
const { createApp, ref } = Vue;

createApp({
  setup() {
    const count = ref(0);

    const increment = () => count.value++;
    const decrement = () => count.value--;
    const reset = () => count.value = 0;

    return { count, increment, decrement, reset };
  },
  template: \`
    <div class="container">
      <h1>Counter App</h1>
      <div class="counter">
        <button class="btn" @click="decrement">-</button>
        <span class="count-display">{{ count }}</span>
        <button class="btn" @click="increment">+</button>
      </div>
      <button class="btn btn-reset" @click="reset">Reset</button>
    </div>
  \`
}).mount('#app');`;
