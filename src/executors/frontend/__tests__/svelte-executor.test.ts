import { describe, it, expect, beforeEach } from 'vitest'
import { SvelteExecutor } from '../svelte-executor'
import type { ExecutionOptions } from '../../../frameworks/types'

describe('SvelteExecutor', () => {
  let executor: SvelteExecutor

  beforeEach(() => {
    executor = new SvelteExecutor()
  })

  describe('Simple Mode', () => {
    it('should execute simple Svelte code', async () => {
      const code = '<script>\n  let count = 0;\n</script>\n\n<button on:click={() => count++}>\n  Count: {count}\n</button>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="app"></div>')
    })

    it('should include Svelte importmap', async () => {
      const code = '<div>Hello Svelte</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('type="importmap"')
      expect(result).toContain('"svelte": "https://esm.sh/svelte@5"')
    })

    it('should use module script type', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('type="module"')
    })

    it('should encode component code in base64', async () => {
      const code = '<script>\n  let name = "World";\n</script>\n<h1>Hello {name}!</h1>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      // Check that base64 decoding is used (code is encoded server-side with btoa)
      expect(result).toContain('atob(')
      expect(result).toContain('decodeURIComponent')
    })

    it('should include compiler import from esm.sh', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('esm.sh/svelte@5/compiler')
    })

    it('should have error handling for setup errors', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Setup Error:')
      expect(result).toContain('catch (error)')
    })

    it('should have error handling for compilation errors', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Compilation Error:')
    })

    it('should have error handling for component load errors', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Component Load Error:')
    })

    it('should have error handling for mount errors', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('Mount Error:')
    })

    it('should auto-mount component to #app', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('document.getElementById(\'app\')')
      expect(result).toContain('mount(ComponentFunc')
    })
  })

  describe('Advanced Mode', () => {
    it('should execute advanced mode with separate files', async () => {
      const code = '<script>\n  let message = "Advanced Svelte";\n</script>\n<div>{message}</div>'
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
      const code = '<div>Test</div>'
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

    it('should inject Svelte script into body section', async () => {
      const code = '<div>Test</div>'
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      const bodyMatch = result.match(/<body>([\s\S]*?)<\/body>/)
      expect(bodyMatch).toBeDefined()
      expect(bodyMatch?.[1]).toContain('type="importmap"')
      expect(bodyMatch?.[1]).toContain('type="module"')
    })

    it('should remove external CSS links to avoid 404s', async () => {
      const code = '<div>Test</div>'
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
      const code = '<div>Test</div>'
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
      const code = '<div>Test</div>'
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

    it('should include importmap in advanced mode', async () => {
      const code = '<div>Test</div>'
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('"svelte": "https://esm.sh/svelte@5"')
    })
  })

  describe('Mode Selection', () => {
    it('should use simple mode when mode is simple', async () => {
      const code = '<div>Simple</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should use advanced mode when mode is advanced and files are provided', async () => {
      const code = '<div>Advanced</div>'
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
      const code = '<div>Test</div>'
      const options: ExecutionOptions = {
        mode: 'advanced',
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
    })
  })

  describe('Error Handling', () => {
    it('should display errors in red with padding', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('color: red')
      expect(result).toContain('padding: 20px')
      expect(result).toContain('font-family: monospace')
    })

    it('should target #app element for error display', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("document.getElementById('app')")
    })

    it('should cleanup blob URLs on errors', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('URL.revokeObjectURL')
    })
  })

  describe('Svelte 5 Specific', () => {
    it('should use Svelte 5 version', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('svelte@5')
    })

    it('should use mount function from Svelte 5', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('svelte.mount')
    })

    it('should compile with client generation', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("generate: 'client'")
    })

    it('should use injected CSS mode', async () => {
      const code = '<div>Test</div>'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("css: 'injected'")
    })
  })
})
