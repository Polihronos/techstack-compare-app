export const EXAMPLE_CODE = {
  vanilla: `// Vanilla JavaScript - Counter Example
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
});`,

  react: `// React - Counter Example
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

ReactDOM.render(<Counter />, document.getElementById('app'));`,

  vue: `// Vue 3 - Counter Example
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
}).mount('#app');`,

  svelte: `<script>
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
</div>`,

  angular: `// Angular - Counter Example (Standalone Component)
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
};
