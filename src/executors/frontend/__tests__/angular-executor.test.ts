import { describe, it, expect, beforeEach } from 'vitest'
import { AngularExecutor } from '../angular-executor'
import type { ExecutionOptions } from '../../../frameworks/types'

describe('AngularExecutor', () => {
  let executor: AngularExecutor

  beforeEach(() => {
    executor = new AngularExecutor()
  })

  describe('Simple Mode', () => {
    it('should execute simple Angular code', async () => {
      const code = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<div>Hello Angular</div>\`
})
export class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="app"></div>')
    })

    it('should include TypeScript CDN', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('unpkg.com/typescript')
    })

    it('should encode component code in base64', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      // Check that base64 decoding is used (code is encoded server-side with btoa)
      expect(result).toContain('atob(')
      expect(result).toContain('decodeURIComponent')
    })

    it('should extract and parse template', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('templateMatch')
      expect(result).toContain('template:')
    })

    it('should transpile TypeScript using TypeScript compiler', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('window.ts.transpile')
    })

    it('should have render method for template rendering', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Component.prototype.render')
    })

    it('should support interpolation in templates', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('{{ interpolations }}')
      expect(result).toMatch(/\\{\\{.*?\\}\\}/)
    })

    it('should have attachEvents method for event handling', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Component.prototype.attachEvents')
    })

    it('should support (click) event binding', async () => {
      const code = `@Component({ template: \`<button (click)="increment()">Click</button>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('(click)')
      expect(result).toContain('addEventListener')
    })

    it('should auto-mount component to #app', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('new Component()')
      expect(result).toContain('component.render()')
      expect(result).toContain('component.attachEvents()')
    })

    it('should have error handling with try-catch', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain('} catch (error) {')
    })

    it('should display errors with stack trace', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('error.message')
      expect(result).toContain('error.stack')
    })
  })

  describe('Advanced Mode', () => {
    it('should execute advanced mode with separate files', async () => {
      const code = `@Component({
  selector: 'app-root',
  template: \`<div>Advanced Angular</div>\`
})
export class AppComponent {}`
      const html = '<html><head></head><body><div id="app"></div></body></html>'
      const css = 'body { background: white; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain(css)
      expect(result).toContain('<div id="app"></div>')
    })

    it('should inject CSS into head section', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html><head></head><body></body></html>'
      const css = '.container { padding: 20px; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('<style>')
      expect(result).toContain(css)
      expect(result).toContain('</style>')
    })

    it('should inject Angular script into body section', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      const bodyMatch = result.match(/<body>([\s\S]*?)<\/body>/)
      expect(bodyMatch).toBeDefined()
      expect(bodyMatch?.[1]).toContain('typescript')
    })

    it('should remove external CSS links to avoid 404s', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html><head><link rel="stylesheet" href="styles.css"></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<link rel="stylesheet" href="styles.css">')
    })

    it('should remove user-provided external script tags', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html><head></head><body><script src="app.js"></script></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<script src="app.js"></script>')
    })

    it('should preserve HTML structure and attributes', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html lang="en" class="dark"><head></head><body class="container"></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('lang="en"')
      expect(result).toContain('class="dark"')
      expect(result).toContain('class="container"')
    })

    it('should include TypeScript in advanced mode', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('typescript')
    })
  })

  describe('Mode Selection', () => {
    it('should use simple mode when mode is simple', async () => {
      const code = `@Component({ template: \`<div>Simple</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should use advanced mode when mode is advanced and files are provided', async () => {
      const code = `@Component({ template: \`<div>Advanced</div>\` })\nexport class AppComponent {}`
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<!DOCTYPE html>')
      expect(result).toContain('<html><head>')
    })

    it('should fallback to simple mode when files are missing', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = {
        mode: 'advanced',
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
    })
  })

  describe('Template Processing', () => {
    it('should extract template with backticks', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('templateMatch')
    })

    it('should handle multiline templates', async () => {
      const code = `@Component({
  template: \`
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  \`
})
export class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('templateMatch')
    })

    it('should provide fallback for missing template', async () => {
      const code = `export class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('No template found')
    })
  })

  describe('Class Extraction', () => {
    it('should extract class body', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent { count = 0; }`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('export class')
    })

    it('should handle nested braces in class', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })
export class AppComponent {
  getData() {
    return { name: 'Test', value: 123 };
  }
}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('braceCount')
    })
  })

  describe('Event Handling', () => {
    it('should remove old event listeners before adding new ones', async () => {
      const code = `@Component({ template: \`<button (click)="test()">Click</button>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('cloneNode')
      expect(result).toContain('replaceChild')
    })

    it('should strip parentheses from method names', async () => {
      const code = `@Component({ template: \`<button (click)="increment()">+</button>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("replace('()', '')")
    })

    it('should re-render and re-attach events after event fires', async () => {
      const code = `@Component({ template: \`<button (click)="test()">Click</button>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('this.render()')
      expect(result).toContain('this.attachEvents()')
    })
  })

  describe('Error Handling', () => {
    it('should display errors in red with padding', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('color: red')
      expect(result).toContain('padding: 20px')
      expect(result).toContain('font-family: monospace')
    })

    it('should target #app element for error display', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("document.getElementById('app')")
    })

    it('should log errors to console', async () => {
      const code = `@Component({ template: \`<div>Test</div>\` })\nexport class AppComponent {}`
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('console.error')
    })
  })
})
