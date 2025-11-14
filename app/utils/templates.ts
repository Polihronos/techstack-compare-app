export const FRONTEND_TEMPLATES = {
  vanilla: {
    name: 'Vanilla JS',
    files: {
      'index.html': `<!DOCTYPE html>
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
</html>`,
      'styles.css': `body {
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
}`,
      'script.js': `// Vanilla JavaScript - Counter Example
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
});`
    }
  },

  react: {
    name: 'React',
    files: {
      'index.html': `<!DOCTYPE html>
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
</html>`,
      'styles.css': `body {
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
}`,
      'script.js': `// React - Counter Example
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

ReactDOM.render(<Counter />, document.getElementById('app'));`
    }
  },

  vue: {
    name: 'Vue 3',
    files: {
      'index.html': `<!DOCTYPE html>
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
</html>`,
      'styles.css': `body {
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
}`,
      'script.js': `// Vue 3 - Counter Example
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
}).mount('#app');`
    }
  },

  svelte: {
    name: 'Svelte',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Svelte Counter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
      'styles.css': `body {
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
}`,
      'App.svelte': `<script>
  // Svelte 5 runes syntax
  // Clean version without inline styles
  let count = $state(0);

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div class="container">
  <h1>Counter App</h1>
  <div class="counter">
    <button class="btn" onclick={decrement}>-</button>
    <span class="count-display">{count}</span>
    <button class="btn" onclick={increment}>+</button>
  </div>
  <button class="btn btn-reset" onclick={reset}>Reset</button>
</div>`
    }
  },

  angular: {
    name: 'Angular',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angular Counter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
      'styles.css': `body {
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
}`,
      'counter.component.ts': `// @ts-nocheck
// Angular - Counter Example (Standalone Component)
// Clean version without inline styles
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="container">
      <h1>Counter App</h1>
      <div class="counter">
        <button class="btn" (click)="decrement()">-</button>
        <span class="count-display">{{ count }}</span>
        <button class="btn" (click)="increment()">+</button>
      </div>
      <button class="btn btn-reset" (click)="reset()">Reset</button>
    </div>
  \`
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}`
    }
  }
};

// Simple mode templates (single file, embedded styles)
export const SIMPLE_TEMPLATES = {
  vanilla: {
    name: 'Vanilla JS',
    files: {
      'script.js': `// Vanilla JavaScript - Counter Example
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
});`
    }
  },
  react: {
    name: 'React',
    files: {
      'script.js': `// React - Counter Example
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: '400px' }}>
      <h1 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>Counter App</h1>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
        >
          -
        </button>
        <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => setCount(0)}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: '1px solid #dc2626', borderRadius: '4px', background: 'white', color: '#dc2626' }}
      >
        Reset
      </button>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('app'));`
    }
  },
  vue: {
    name: 'Vue 3',
    files: {
      'script.js': `// Vue 3 - Counter Example
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
    <div style="font-family: system-ui; padding: 2rem; max-width: 400px;">
      <h1 style="color: #1a1a1a; margin-bottom: 1rem;">Counter App</h1>
      <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
        <button
          @click="decrement"
          style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
        >
          -
        </button>
        <span style="font-size: 2rem; font-weight: bold; min-width: 3rem; text-align: center;">
          {{ count }}
        </span>
        <button
          @click="increment"
          style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
        >
          +
        </button>
      </div>
      <button
        @click="reset"
        style="padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #dc2626; border-radius: 4px; background: white; color: #dc2626;"
      >
        Reset
      </button>
    </div>
  \`
}).mount('#app');`
    }
  },
  svelte: {
    name: 'Svelte',
    files: {
      'App.svelte': `<script>
  // Svelte 5 runes syntax
  let count = $state(0);

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div style="font-family: system-ui; padding: 2rem; max-width: 400px;">
  <h1 style="color: #1a1a1a; margin-bottom: 1rem;">Counter App</h1>
  <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
    <button
      onclick={decrement}
      style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
    >
      -
    </button>
    <span style="font-size: 2rem; font-weight: bold; min-width: 3rem; text-align: center;">
      {count}
    </span>
    <button
      onclick={increment}
      style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
    >
      +
    </button>
  </div>
  <button
    onclick={reset}
    style="padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #dc2626; border-radius: 4px; background: white; color: #dc2626;"
  >
    Reset
  </button>
</div>`
    }
  },
  angular: {
    name: 'Angular',
    files: {
      'counter.component.ts': `// @ts-nocheck
// Angular - Counter Example (Standalone Component)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div style="font-family: system-ui; padding: 2rem; max-width: 400px;">
      <h1 style="color: #1a1a1a; margin-bottom: 1rem;">Counter App</h1>
      <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
        <button
          (click)="decrement()"
          style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
        >
          -
        </button>
        <span style="font-size: 2rem; font-weight: bold; min-width: 3rem; text-align: center;">
          {{ count }}
        </span>
        <button
          (click)="increment()"
          style="padding: 0.5rem 1rem; font-size: 1.2rem; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
        >
          +
        </button>
      </div>
      <button
        (click)="reset()"
        style="padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #dc2626; border-radius: 4px; background: white; color: #dc2626;"
      >
        Reset
      </button>
    </div>
  \`
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}`
    }
  }
};

// Backward compatibility: export just the main code file for each framework
export const EXAMPLE_CODE = {
  vanilla: FRONTEND_TEMPLATES.vanilla.files['script.js'],
  react: FRONTEND_TEMPLATES.react.files['script.js'],
  vue: FRONTEND_TEMPLATES.vue.files['script.js'],
  svelte: FRONTEND_TEMPLATES.svelte.files['App.svelte'],
  angular: FRONTEND_TEMPLATES.angular.files['counter.component.ts']
};
