import { describe, it, expect, beforeEach } from 'vitest'
import { ReactExecutor } from '../react-executor'
import type { ExecutionOptions } from '../../../frameworks/types'

describe('ReactExecutor', () => {
  let executor: ReactExecutor

  beforeEach(() => {
    executor = new ReactExecutor()
  })

  describe('Simple Mode', () => {
    it('should execute simple React code', async () => {
      const code = 'const App = () => <div>Hello React</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="app"></div>')
      expect(result).toContain(code)
    })

    it('should include React CDN in head section', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('unpkg.com/react@18/umd/react.production.min.js')
    })

    it('should include ReactDOM CDN in head section', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('unpkg.com/react-dom@18/umd/react-dom.production.min.js')
    })

    it('should include Babel standalone in head section', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('unpkg.com/@babel/standalone/babel.min.js')
    })

    it('should use crossorigin attribute for React scripts', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      // Both React and ReactDOM should have crossorigin
      const reactScriptMatch = result.match(/unpkg\.com\/react@18[^>]*>/)
      expect(reactScriptMatch?.[0]).toContain('crossorigin')

      const reactDomScriptMatch = result.match(/unpkg\.com\/react-dom@18[^>]*>/)
      expect(reactDomScriptMatch?.[0]).toContain('crossorigin')
    })

    it('should use text/babel script type', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('type="text/babel"')
    })

    it('should load CDN scripts in correct order', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      const reactIndex = result.indexOf('react@18')
      const reactDomIndex = result.indexOf('react-dom@18')
      const babelIndex = result.indexOf('babel.min.js')

      // React should load before ReactDOM, and Babel before code execution
      expect(reactIndex).toBeLessThan(reactDomIndex)
      expect(babelIndex).toBeGreaterThan(reactIndex)
    })

    it('should wrap code in try-catch block', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain(code)
      expect(result).toContain('} catch (error) {')
    })

    it('should have error handling with console.error', async () => {
      const code = 'throw new Error("React error");'
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

    it('should create complete HTML document', async () => {
      const code = 'const App = () => <div>Test</div>;'
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

    it('should preserve JSX code formatting', async () => {
      const code = `
        const App = () => {
          return (
            <div>
              <h1>Hello</h1>
              <p>World</p>
            </div>
          );
        };
      `
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<h1>Hello</h1>')
      expect(result).toContain('<p>World</p>')
    })
  })

  describe('Advanced Mode', () => {
    it('should execute advanced mode with separate files', async () => {
      const code = 'const App = () => <div>Advanced React</div>;'
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

    it('should inject CSS and React dependencies into head section', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const html = '<html><head></head><body></body></html>'
      const css = '.container { padding: 20px; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('<style>')
      expect(result).toContain(css)
      expect(result).toContain('react@18')
      expect(result).toContain('react-dom@18')
      expect(result).toContain('babel.min.js') // Now should be present after bug fix
    })

    it('should inject script into body section with text/babel type', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      const bodyMatch = result.match(/<body>([\s\S]*?)<\/body>/)
      expect(bodyMatch).toBeDefined()
      expect(bodyMatch?.[1]).toContain('type="text/babel"')
      expect(bodyMatch?.[1]).toContain(code)
    })

    it('should remove external CSS links to avoid 404s', async () => {
      const code = 'const App = () => <div>Test</div>;'
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
      const code = 'const App = () => <div>Test</div>;'
      const html = '<html><head></head><body><script src="app.js"></script></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).not.toContain('<script src="app.js"></script>')
      // But should still have React/Babel scripts
      expect(result).toContain('react@18')
    })

    it('should wrap code in try-catch in advanced mode', async () => {
      const code = 'const App = () => <div>Test</div>;'
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
      const code = 'const App = () => <div>Test</div>;'
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
      const code = 'const App = () => <div>Test</div>;'
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

    it('should include crossorigin attribute in advanced mode', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('crossorigin')
    })

    it('should preserve HTML structure and attributes', async () => {
      const code = 'const App = () => <div>Test</div>;'
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

    it('should handle complex React code', async () => {
      const code = `
        const App = () => {
          const [count, setCount] = React.useState(0);
          return (
            <div>
              <button onClick={() => setCount(count + 1)}>
                Count: {count}
              </button>
            </div>
          );
        };
      `
      const html = '<html><head></head><body></body></html>'
      const css = ''
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('React.useState')
      expect(result).toContain('onClick')
      expect(result).toContain('setCount')
    })
  })

  describe('Mode Selection', () => {
    it('should use simple mode when mode is simple', async () => {
      const code = 'const App = () => <div>Simple</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      // Simple mode creates full HTML document
      expect(result).toContain('<!DOCTYPE html>')
    })

    it('should use advanced mode when mode is advanced and files are provided', async () => {
      const code = 'const App = () => <div>Advanced</div>;'
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
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = {
        mode: 'advanced',
        // Missing files
      }

      const result = await executor.execute(code, options)

      // Falls back to simple mode
      expect(result).toContain('<!DOCTYPE html>')
    })
  })

  describe('CDN Script Loading', () => {
    it('should use production builds of React libraries', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('react.production.min.js')
      expect(result).toContain('react-dom.production.min.js')
    })

    it('should use unpkg CDN for all dependencies', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      const unpkgMatches = result.match(/unpkg\.com/g)
      expect(unpkgMatches).toBeDefined()
      expect(unpkgMatches!.length).toBeGreaterThanOrEqual(3) // React, ReactDOM, Babel
    })

    it('should specify React version 18', async () => {
      const code = 'const App = () => <div>Test</div>;'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('react@18')
      expect(result).toContain('react-dom@18')
    })
  })

  describe('Error Handling', () => {
    it('should have error display logic in both modes', async () => {
      const code = 'throw new Error("React error");'

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
