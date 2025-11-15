import { describe, it, expect, beforeEach } from 'vitest'
import { VueExecutor } from '../vue-executor'
import type { ExecutionOptions } from '../../../frameworks/types'

describe('VueExecutor', () => {
  let executor: VueExecutor

  beforeEach(() => {
    executor = new VueExecutor()
  })

  describe('Simple Mode', () => {
    it('should execute simple Vue code', async () => {
      const code = 'const { createApp } = Vue; createApp({ data() { return { message: "Hello Vue" } } }).mount("#app");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div id="app"></div>')
      expect(result).toContain(code)
    })

    it('should include Vue 3 CDN in head section', async () => {
      const code = 'const app = Vue.createApp({});'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('unpkg.com/vue@3/dist/vue.global.js')
    })

    it('should use text/javascript script type', async () => {
      const code = 'console.log("test");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('type="text/javascript"')
    })

    it('should wrap code in try-catch block', async () => {
      const code = 'const app = Vue.createApp({});'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain(code)
      expect(result).toContain('} catch (error) {')
    })

    it('should have error handling with console.error', async () => {
      const code = 'throw new Error("Vue error");'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain('console.error(error)')
      expect(result).toContain('document.getElementById(\'app\').innerHTML')
    })
  })

  describe('Advanced Mode', () => {
    it('should execute advanced mode with separate files', async () => {
      const code = 'const { createApp } = Vue; createApp({ template: "<div>Advanced Vue</div>" }).mount("#app");'
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

    // CRITICAL TEST: Check if Vue CDN is actually present in advanced mode
    it('should include Vue CDN in advanced mode (checking for bug)', async () => {
      const code = 'const { createApp } = Vue;'
      const html = '<html><head></head><body><div id="app"></div></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      // This test will reveal if the Vue script is removed by the external script cleanup
      const hasVueScript = result.includes('unpkg.com/vue@3/dist/vue.global.js')

      // Log the result for debugging
      if (!hasVueScript) {
        console.log('BUG CONFIRMED: Vue CDN script is removed in advanced mode')
        console.log('Result:', result)
      }

      expect(hasVueScript).toBe(true) // This will fail if the bug exists
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

      expect(result).toContain('<style>')
      expect(result).toContain(css)
      expect(result).toContain('</style>')
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

    it('should remove user-provided external script tags to avoid 404s', async () => {
      const code = 'console.log("test");'
      const html = '<html><head></head><body><script src="app.js"></script></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      // User's app.js should be removed
      expect(result).not.toContain('<script src="app.js"></script>')

      // But Vue CDN should still be there (checking if cleanup is too aggressive)
      expect(result).toContain('vue.global.js')
    })

    it('should wrap code in try-catch in advanced mode', async () => {
      const code = 'const app = Vue.createApp({});'
      const html = '<html><head></head><body></body></html>'
      const css = 'body { margin: 0; }'
      const options: ExecutionOptions = {
        mode: 'advanced',
        files: { html, css, code },
      }

      const result = await executor.execute(code, options)

      expect(result).toContain('try {')
      expect(result).toContain(code)
      expect(result).toContain('} catch (error) {')
    })
  })

  describe('Error Handling', () => {
    it('should target #app element for error display', async () => {
      const code = 'error'
      const options: ExecutionOptions = { mode: 'simple' }

      const result = await executor.execute(code, options)

      expect(result).toContain("document.getElementById('app')")
    })
  })
})
