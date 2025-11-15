/**
 * Angular - Simple Mode Template
 * Single file with inline styles
 */

export const angularSimpleTemplate = `// @ts-nocheck
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
}`;
