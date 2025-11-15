import { describe, it, expect, beforeEach } from 'vitest'
import { VanillaExecutor } from '../vanilla-executor'
import type { ExecutionOptions } from '../../../frameworks/types'

describe('VanillaExecutor', () => {
  let executor: VanillaExecutor

  beforeEach(() => {
    executor = new VanillaExecutor()
  })

  describe('Simple Mode', () => {
    it('should execute simple JavaScript code', async () => {
      const code = 'console.log("Hello World");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="app"></div>')
      expect(result).toContain(code)
    })

    it('should wrap code in try-catch block', async () => {
      const code = 'const x = 5;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain(code)
      expect(result).toContain('} catch (error) {')
    })

    it('should have error handling with console.error', async () => {
      const code = 'throw new Error("test");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('console.error(error)')
      expect(result).toContain('document.getElementById(\'app\').innerHTML')
    })

    it('should display errors in red with padding', async () => {
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute('code', options)

      expect(result).toContain('color: red')
      expect(result).toContain('padding: 20px')
      expect(result).toContain('font-family: monospace')
    })

    it('should use text/javascript script type', async () => {
      const code = 'console.log("test");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('type="text/javascript"')
    })

    it('should create complete HTML document', async () => {
      const code = 'document.body.style.background = "blue";'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<html lang="en">')
      expect(result).toContain('<head>')
      expect(result).toContain('<meta charset="UTF-8">')
      expect(result).toContain('<meta name="viewport"')
      expect(result).toContain('</head>')
      expect(result).toContain('<body>')
      expect(result).toContain('</body>')
      expect(result).toContain('</html>')
    })

    it('should preserve code formatting', async () => {
      const code = `
        const greeting = "Hello";
        const name = "World";
        console.log(greeting + " " + name);
      `
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('const greeting = "Hello"')
      expect(result).toContain('const name = "World"')
    })
  })

  describe('Advanced Mode', () => {
    it('should execute advanced mode with separate files', async () => {
      const code = 'console.log("Advanced mode");'
      const html = '<html><head></head><body><div id="app"></div></body></html>'
      const css = 'body { background: white; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain(code)
      expect(result).toContain(css)
      expect(result).toContain('<div id="app"></div>')
    })

    it('should inject CSS into head section', async () => {
      const code = 'console.log("test");'
      const html = '<html><head></head><body></body></html>'
      const css = '.container { padding: 20px; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      const headMatch = result.match(/<head>([\s\S]*?)<\/head>/)
      expect(headMatch).toBeDefined()
      expect(headMatch?.[1]).toContain('<style>')
      expect(headMatch?.[1]).toContain(css)
      expect(headMatch?.[1]).toContain('</style>')
    })

    it('should inject script into body section', async () => {
      const code = 'const x = 10;'
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      const bodyMatch = result.match(/<body>([\s\S]*?)<\/body>/)
      expect(bodyMatch).toBeDefined()
      expect(bodyMatch?.[1]).toContain('<script>')
      expect(bodyMatch?.[1]).toContain(code)
      expect(bodyMatch?.[1]).toContain('</script>')
    })

    it('should remove external CSS links to avoid 404s', async () => {
      const code = 'console.log("test");'
      const html = '<html><head><link rel="stylesheet" href="styles.css"></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<link rel="stylesheet" href="styles.css">')
    })

    it('should remove external script tags to avoid 404s', async () => {
      const code = 'console.log("test");'
      const html = '<html><head></head><body><script src="app.js"></script></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<script src="app.js"></script>')
    })

    it('should wrap code in try-catch in advanced mode', async () => {
      const code = 'const test = true;'
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain(code)
      expect(result).toContain('} catch (error) {')
    })

    it('should handle HTML without head tag gracefully', async () => {
      const code = 'console.log("test");'
      const html = '<body></body>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      // Should still work even without </head> tag
      expect(result).toBeDefined()
      expect(result).toContain(code)
    })

    it('should handle HTML without body tag gracefully', async () => {
      const code = 'console.log("test");'
      const html = '<html><head></head></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      // Should still work even without </body> tag
      expect(result).toBeDefined()
    })

    it('should preserve HTML structure and attributes', async () => {
      const code = 'console.log("test");'
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

    it('should handle multiple external CSS links', async () => {
      const code = 'console.log("test");'
      const html = `<html>
        <head>
          <link rel="stylesheet" href="reset.css">
          <link rel="stylesheet" href="main.css">
        </head>
        <body></body>
      </html>`
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('href="reset.css"')
      expect(result).not.toContain('href="main.css"')
    })

    it('should handle complex CSS', async () => {
      const code = 'console.log("test");'
      const html = '<html><head></head><body></body></html>'
      const css = `
        body { margin: 0; padding: 0; }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .container { padding: 10px; }
        }
      `
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('max-width: 1200px')
      expect(result).toContain('@media (max-width: 768px)')
    })
  })

  describe('Mode Selection', () => {
    it('should use simple mode when mode is simple', async () => {
      const code = 'console.log("simple");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      // Simple mode creates full HTML document
      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should use advanced mode when mode is advanced and files are provided', async () => {
      const code = 'console.log("advanced");'
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      // Advanced mode uses provided HTML
      expect(result).not.toContain('<!DOCTYPE html>')
      expect(result).toContain('<html><head>')
    })

    it('should fallback to simple mode when advanced mode has missing files', async () => {
      const code = 'console.log("test");'
      const options: ExecutionOptions = {
        mode: 'advanced',
        // Missing files
      }

      const result = await executor.execute(code, options)

      // Falls back to simple mode
      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should fallback to simple mode when HTML is missing in advanced mode', async () => {
      const code = 'console.log("test");'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { css: 'body { margin: 0; }' },
      }

      const result = await executor.execute(code, options)

      // Falls back to simple mode
      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should fallback to simple mode when CSS is missing in advanced mode', async () => {
      const code = 'console.log("test");'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html: '<html></html>' },
      }

      const result = await executor.execute(code, options)

      // Falls back to simple mode
      expect(result).toContain('<!DOCTYPE html>')
    })
  })

  describe('Error Handling', () => {
    it('should have error display logic in both modes', async () => {
      const code = 'throw new Error("test error");'

      const simpleResult = await executor.execute(code, { mode: 'simple' })
      expect(simpleResult).toContain('Error:')
      expect(simpleResult).toContain('error.message')

      const advancedResult = await executor.execute(code, {
        mode: 'advanced',
        files: { html: '<html><head></head><body></body></html>', css: '' },
      })
      expect(advancedResult).toContain('Error:')
      expect(advancedResult).toContain('error.message')
    })

    it('should target #app element for error display', async () => {
      const code = 'error'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("document.getElementById('app')")
    })
  })
})
