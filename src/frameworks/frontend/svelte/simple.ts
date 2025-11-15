/**
 * Svelte - Simple Mode Template
 * Single file with inline styles
 */

export const svelteSimpleTemplate = `<script>
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
</div>`;
