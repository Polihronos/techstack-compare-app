/**
 * Test fixtures for framework configurations
 */

export const sampleVanillaCode = {
  simple: `console.log('Hello from Vanilla JS');`,
  advanced: {
    html: '<div id="app">Hello World</div>',
    css: 'body { font-family: sans-serif; }',
    js: 'document.getElementById("app").textContent = "Hello from JS";',
  },
}

export const sampleReactCode = {
  simple: `function App() {
  return <div>Hello from React</div>;
}

export default App;`,
  advanced: {
    html: '<div id="root"></div>',
    css: '.container { padding: 20px; }',
    js: `function App() {
  return <div className="container">Hello React</div>;
}

export default App;`,
  },
}

export const sampleVueCode = {
  simple: `<template>
  <div>Hello from Vue</div>
</template>`,
  advanced: {
    html: '<div id="app"></div>',
    css: '.container { padding: 20px; }',
    js: `{
  template: '<div class="container">Hello Vue</div>'
}`,
  },
}

export const sampleSvelteCode = {
  simple: `<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>`,
  advanced: {
    html: '<div id="app"></div>',
    css: 'button { padding: 10px; }',
    js: `<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>`,
  },
}

export const sampleAngularCode = {
  simple: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>Hello from Angular</div>'
})
export class AppComponent {}`,
}

export const sampleBackendCode = {
  express: {
    'package.json': JSON.stringify({
      name: 'express-app',
      dependencies: { express: '^4.18.0' },
    }),
    'index.js': `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express' });
});

app.listen(3000);`,
  },
}
