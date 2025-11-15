import { describe, it, expect, beforeEach } from 'vitest'
import { BaseFrontendExecutor, BaseBackendExecutor } from '../base'
import type { ExecutionOptions, FileSystemTemplate } from '../../frameworks/types'

// Create concrete test implementations of abstract classes
class TestFrontendExecutor extends BaseFrontendExecutor {
  async execute(code: string, options: ExecutionOptions): Promise<string> {
    return this.createHTMLDocument({
      bodyContent: code,
    })
  }

  // Expose protected methods for testing
  public testCreateHTMLDocument(params: Parameters<BaseFrontendExecutor['createHTMLDocument']>[0]) {
    return this.createHTMLDocument(params)
  }

  public testCreateScriptTag(content: string, type?: string) {
    return this.createScriptTag(content, type)
  }

  public testCreateExternalScript(src: string, attrs?: Record<string, string>) {
    return this.createExternalScript(src, attrs)
  }
}

class TestBackendExecutor extends BaseBackendExecutor {
  async execute(
    files: FileSystemTemplate,
    onOutput: (text: string) => void,
    onReady: (url: string) => void
  ): Promise<void> {
    // Mock implementation
  }

  async cleanup(): Promise<void> {
    // Mock implementation
  }
}

describe('BaseFrontendExecutor', () => {
  let executor: TestFrontendExecutor

  beforeEach(() => {
    executor = new TestFrontendExecutor()
  })

  describe('execute', () => {
    it('should be implemented by child classes', async () => {
      const result = await executor.execute('test code', { mode: 'simple' })
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })

  describe('createHTMLDocument', () => {
    it('should create basic HTML document with body content', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<h1>Hello World</h1>',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html lang="en">')
      expect(html).toContain('<h1>Hello World</h1>')
      expect(html).toContain('</html>')
    })

    it('should include CSS when provided', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
        css: 'body { background: red; }',
      })

      expect(html).toContain('<style>body { background: red; }</style>')
    })

    it('should not include style tag when CSS is not provided', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
      })

      expect(html).not.toContain('<style>')
    })

    it('should use custom HTML when provided', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<script>alert("hi")</script>',
        html: '<div id="custom">Custom Root</div>',
      })

      expect(html).toContain('<div id="custom">Custom Root</div>')
      expect(html).not.toContain('<div id="root"></div>')
    })

    it('should use default root div when HTML is not provided', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<script>console.log("test")</script>',
      })

      expect(html).toContain('<div id="root"></div>')
    })

    it('should include head scripts in correct position', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
        headScripts: [
          '<script src="https://cdn.example.com/lib.js"></script>',
          '<script>console.log("head")</script>',
        ],
      })

      expect(html).toContain('<script src="https://cdn.example.com/lib.js"></script>')
      expect(html).toContain('<script>console.log("head")</script>')

      // Head scripts should be in the <head> section
      const headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
      expect(headMatch).toBeDefined()
      expect(headMatch?.[1]).toContain('lib.js')
      expect(headMatch?.[1]).toContain('console.log("head")')
    })

    it('should include body scripts in correct position', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
        bodyScripts: [
          '<script>console.log("body script 1")</script>',
          '<script>console.log("body script 2")</script>',
        ],
      })

      expect(html).toContain('console.log("body script 1")')
      expect(html).toContain('console.log("body script 2")')

      // Body scripts should be after bodyContent
      const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/)
      expect(bodyMatch).toBeDefined()
      expect(bodyMatch?.[1]).toContain('body script 1')
    })

    it('should handle empty head and body scripts arrays', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
        headScripts: [],
        bodyScripts: [],
      })

      expect(html).toContain('<div>Content</div>')
      expect(html).toBeDefined()
    })

    it('should include viewport meta tag', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
      })

      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    })

    it('should include charset meta tag', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
      })

      expect(html).toContain('<meta charset="UTF-8">')
    })

    it('should include title tag', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<div>Content</div>',
      })

      expect(html).toContain('<title>Preview</title>')
    })

    it('should handle complex HTML with all parameters', () => {
      const html = executor.testCreateHTMLDocument({
        html: '<div id="app"><h1>Title</h1></div>',
        css: '.app { color: blue; }',
        bodyContent: '<script>console.log("init")</script>',
        headScripts: ['<script src="lib.js"></script>'],
        bodyScripts: ['<script>console.log("done")</script>'],
      })

      expect(html).toContain('<div id="app"><h1>Title</h1></div>')
      expect(html).toContain('<style>.app { color: blue; }</style>')
      expect(html).toContain('<script>console.log("init")</script>')
      expect(html).toContain('<script src="lib.js"></script>')
      expect(html).toContain('<script>console.log("done")</script>')
    })

    it('should properly escape and preserve content', () => {
      const html = executor.testCreateHTMLDocument({
        bodyContent: '<script>const x = "test"; console.log(x);</script>',
        css: 'body::before { content: "Hello"; }',
      })

      expect(html).toContain('const x = "test"')
      expect(html).toContain('content: "Hello"')
    })
  })

  describe('createScriptTag', () => {
    it('should create a module script tag by default', () => {
      const script = executor.testCreateScriptTag('console.log("test")')

      expect(script).toBe('<script type="module">console.log("test")</script>')
    })

    it('should create a script tag with specified type', () => {
      const script = executor.testCreateScriptTag('console.log("test")', 'text/javascript')

      expect(script).toBe('<script type="text/javascript">console.log("test")</script>')
    })

    it('should handle empty content', () => {
      const script = executor.testCreateScriptTag('')

      expect(script).toBe('<script type="module"></script>')
    })

    it('should preserve script content exactly', () => {
      const content = `
        const data = { name: "test" };
        console.log(data);
      `
      const script = executor.testCreateScriptTag(content)

      expect(script).toContain(content)
    })

    it('should handle complex JavaScript code', () => {
      const content = `
        import React from 'react';
        const App = () => <div>Hello</div>;
        export default App;
      `
      const script = executor.testCreateScriptTag(content, 'text/babel')

      expect(script).toBe(`<script type="text/babel">${content}</script>`)
    })
  })

  describe('createExternalScript', () => {
    it('should create script tag with src attribute', () => {
      const script = executor.testCreateExternalScript('https://cdn.example.com/lib.js')

      expect(script).toContain('<script src="https://cdn.example.com/lib.js"')
      expect(script).toContain('</script>')
    })

    it('should create script tag without additional attributes', () => {
      const script = executor.testCreateExternalScript('https://cdn.example.com/lib.js', {})

      expect(script).toBe('<script src="https://cdn.example.com/lib.js" ></script>')
    })

    it('should add custom attributes', () => {
      const script = executor.testCreateExternalScript('https://cdn.example.com/lib.js', {
        crossorigin: 'anonymous',
        integrity: 'sha384-abc123',
      })

      expect(script).toContain('crossorigin="anonymous"')
      expect(script).toContain('integrity="sha384-abc123"')
    })

    it('should handle multiple attributes', () => {
      const script = executor.testCreateExternalScript('https://cdn.example.com/lib.js', {
        async: 'true',
        defer: 'true',
        crossorigin: 'use-credentials',
      })

      expect(script).toContain('async="true"')
      expect(script).toContain('defer="true"')
      expect(script).toContain('crossorigin="use-credentials"')
    })

    it('should handle relative URLs', () => {
      const script = executor.testCreateExternalScript('/static/js/app.js')

      expect(script).toContain('src="/static/js/app.js"')
    })

    it('should handle CDN URLs with version', () => {
      const url = 'https://unpkg.com/react@18/umd/react.production.min.js'
      const script = executor.testCreateExternalScript(url)

      expect(script).toContain(`src="${url}"`)
    })
  })

  describe('Integration', () => {
    it('should use helper methods in execute', async () => {
      const result = await executor.execute('<div>Test</div>', { mode: 'simple' })

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<div>Test</div>')
    })

    it('should produce valid HTML structure', async () => {
      const result = await executor.execute('<h1>Hello World</h1>', { mode: 'simple' })

      // Check for required HTML elements
      expect(result).toMatch(/<!DOCTYPE html>/i)
      expect(result).toMatch(/<html[^>]*>/i)
      expect(result).toMatch(/<head>/i)
      expect(result).toMatch(/<\/head>/i)
      expect(result).toMatch(/<body>/i)
      expect(result).toMatch(/<\/body>/i)
      expect(result).toMatch(/<\/html>/i)
    })
  })
})

describe('BaseBackendExecutor', () => {
  let executor: TestBackendExecutor

  beforeEach(() => {
    executor = new TestBackendExecutor()
  })

  describe('execute', () => {
    it('should be implemented by child classes', async () => {
      const mockOnOutput = vi.fn()
      const mockOnReady = vi.fn()
      const files: FileSystemTemplate = {
        'package.json': '{"name":"test"}',
      }

      await executor.execute(files, mockOnOutput, mockOnReady)
      // No error should be thrown
      expect(true).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('should be implemented by child classes', async () => {
      await executor.cleanup()
      // No error should be thrown
      expect(true).toBe(true)
    })
  })
})
