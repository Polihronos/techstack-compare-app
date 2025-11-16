import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../app-store'
import type { FrameworkId } from '../../frameworks/types'

describe('App Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useAppStore.getState()
    store.resetEditor()
    store.setAppMode('frontend')
    store.setFramework('vanilla', 'frontend')
    store.setViewMode('simple')
    store.clearTerminalOutput()
  })

  describe('Initial State', () => {
    it('should start in frontend app mode', () => {
      const { appMode } = useAppStore.getState()

      expect(appMode).toBe('frontend')
    })

    it('should have correct initial framework selection', () => {
      const { selectedFramework, frameworkType } = useAppStore.getState()

      expect(selectedFramework).toBe('vanilla')
      expect(frameworkType).toBe('frontend')
    })

    it('should start in simple view mode', () => {
      const { viewMode } = useAppStore.getState()

      expect(viewMode).toBe('simple')
    })

    it('should have initial fullstack state', () => {
      const { fullstack } = useAppStore.getState()

      expect(fullstack.frontendFramework).toBe('react')
      expect(fullstack.backendFramework).toBe('express')
      expect(fullstack.backendUrl).toBe('')
    })

    it('should have empty editor state initially', () => {
      const { editor } = useAppStore.getState()

      expect(editor.code).toBe('')
      expect(editor.htmlContent).toBe('')
      expect(editor.cssContent).toBe('')
    })

    it('should have empty preview state initially', () => {
      const { preview } = useAppStore.getState()

      expect(preview.output).toBe('')
      expect(preview.url).toBe('')
      expect(preview.isLoading).toBe(false)
      expect(preview.terminalOutput).toBe('')
    })
  })

  describe('setFramework', () => {
    it('should update selected framework', () => {
      const { setFramework } = useAppStore.getState()

      setFramework('react', 'frontend')

      const { selectedFramework, frameworkType } = useAppStore.getState()
      expect(selectedFramework).toBe('react')
      expect(frameworkType).toBe('frontend')
    })

    it('should handle backend framework selection', () => {
      const { setFramework } = useAppStore.getState()

      setFramework('express', 'backend')

      const { selectedFramework, frameworkType } = useAppStore.getState()
      expect(selectedFramework).toBe('express')
      expect(frameworkType).toBe('backend')
    })

    it('should reset preview state when switching frameworks', () => {
      const { setFramework, setPreviewOutput, setPreviewUrl, appendTerminalOutput } =
        useAppStore.getState()

      // Set some preview data
      setPreviewOutput('<div>Hello</div>')
      setPreviewUrl('http://localhost:3000')
      appendTerminalOutput('Server started')

      // Switch framework
      setFramework('react', 'frontend')

      const { preview } = useAppStore.getState()
      expect(preview.output).toBe('')
      expect(preview.url).toBe('')
      expect(preview.terminalOutput).toBe('')
      expect(preview.isLoading).toBe(false)
    })

    it('should not reset editor state when switching frameworks', () => {
      const { setFramework, setCode } = useAppStore.getState()

      setCode('console.log("test")')

      setFramework('vue', 'frontend')

      const { editor } = useAppStore.getState()
      expect(editor.code).toBe('console.log("test")')
    })

    it('should handle all frontend framework IDs', () => {
      const frontendIds: FrameworkId[] = ['vanilla', 'react', 'vue', 'svelte', 'angular']
      const { setFramework } = useAppStore.getState()

      frontendIds.forEach(id => {
        setFramework(id, 'frontend')
        const { selectedFramework, frameworkType } = useAppStore.getState()
        expect(selectedFramework).toBe(id)
        expect(frameworkType).toBe('frontend')
      })
    })

    it('should handle all backend framework IDs', () => {
      const backendIds: FrameworkId[] = ['express', 'fastify', 'nextjs', 'sveltekit']
      const { setFramework } = useAppStore.getState()

      backendIds.forEach(id => {
        setFramework(id, 'backend')
        const { selectedFramework, frameworkType } = useAppStore.getState()
        expect(selectedFramework).toBe(id)
        expect(frameworkType).toBe('backend')
      })
    })
  })

  describe('setViewMode', () => {
    it('should update view mode to advanced', () => {
      const { setViewMode } = useAppStore.getState()

      setViewMode('advanced')

      const { viewMode } = useAppStore.getState()
      expect(viewMode).toBe('advanced')
    })

    it('should update view mode to simple', () => {
      const { setViewMode } = useAppStore.getState()

      setViewMode('advanced')
      setViewMode('simple')

      const { viewMode } = useAppStore.getState()
      expect(viewMode).toBe('simple')
    })

    it('should reset preview state when switching view modes', () => {
      const { setViewMode, setPreviewOutput, setPreviewUrl } = useAppStore.getState()

      setPreviewOutput('<div>Preview</div>')
      setPreviewUrl('http://localhost:3000')

      setViewMode('advanced')

      const { preview } = useAppStore.getState()
      expect(preview.output).toBe('')
      expect(preview.url).toBe('')
      expect(preview.isLoading).toBe(false)
    })

    it('should not reset editor state when switching view modes', () => {
      const { setViewMode, setCode, setHtmlContent, setCssContent } = useAppStore.getState()

      setCode('const x = 1')
      setHtmlContent('<div>HTML</div>')
      setCssContent('body { margin: 0; }')

      setViewMode('advanced')

      const { editor } = useAppStore.getState()
      expect(editor.code).toBe('const x = 1')
      expect(editor.htmlContent).toBe('<div>HTML</div>')
      expect(editor.cssContent).toBe('body { margin: 0; }')
    })
  })

  describe('Editor State Actions', () => {
    describe('setCode', () => {
      it('should update code content', () => {
        const { setCode } = useAppStore.getState()

        setCode('console.log("Hello World")')

        const { editor } = useAppStore.getState()
        expect(editor.code).toBe('console.log("Hello World")')
      })

      it('should preserve other editor state', () => {
        const { setCode, setHtmlContent, setCssContent } = useAppStore.getState()

        setHtmlContent('<h1>Title</h1>')
        setCssContent('h1 { color: blue; }')
        setCode('const x = 5;')

        const { editor } = useAppStore.getState()
        expect(editor.code).toBe('const x = 5;')
        expect(editor.htmlContent).toBe('<h1>Title</h1>')
        expect(editor.cssContent).toBe('h1 { color: blue; }')
      })

      it('should handle empty string', () => {
        const { setCode } = useAppStore.getState()

        setCode('some code')
        setCode('')

        const { editor } = useAppStore.getState()
        expect(editor.code).toBe('')
      })

      it('should handle multi-line code', () => {
        const { setCode } = useAppStore.getState()
        const multiLineCode = `
function hello() {
  console.log("Hello");
}
hello();
        `.trim()

        setCode(multiLineCode)

        const { editor } = useAppStore.getState()
        expect(editor.code).toBe(multiLineCode)
      })
    })

    describe('setHtmlContent', () => {
      it('should update HTML content', () => {
        const { setHtmlContent } = useAppStore.getState()

        setHtmlContent('<div id="app">Hello</div>')

        const { editor } = useAppStore.getState()
        expect(editor.htmlContent).toBe('<div id="app">Hello</div>')
      })

      it('should preserve other editor state', () => {
        const { setCode, setHtmlContent, setCssContent } = useAppStore.getState()

        setCode('console.log(1);')
        setCssContent('body { margin: 0; }')
        setHtmlContent('<p>Paragraph</p>')

        const { editor } = useAppStore.getState()
        expect(editor.htmlContent).toBe('<p>Paragraph</p>')
        expect(editor.code).toBe('console.log(1);')
        expect(editor.cssContent).toBe('body { margin: 0; }')
      })

      it('should handle empty HTML', () => {
        const { setHtmlContent } = useAppStore.getState()

        setHtmlContent('<div>Content</div>')
        setHtmlContent('')

        const { editor } = useAppStore.getState()
        expect(editor.htmlContent).toBe('')
      })

      it('should handle complex HTML structures', () => {
        const { setHtmlContent } = useAppStore.getState()
        const complexHTML = `
<div class="container">
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Content</p>
  </main>
</div>
        `.trim()

        setHtmlContent(complexHTML)

        const { editor } = useAppStore.getState()
        expect(editor.htmlContent).toBe(complexHTML)
      })
    })

    describe('setCssContent', () => {
      it('should update CSS content', () => {
        const { setCssContent } = useAppStore.getState()

        setCssContent('body { background: white; }')

        const { editor } = useAppStore.getState()
        expect(editor.cssContent).toBe('body { background: white; }')
      })

      it('should preserve other editor state', () => {
        const { setCode, setHtmlContent, setCssContent } = useAppStore.getState()

        setCode('alert("hi");')
        setHtmlContent('<span>Text</span>')
        setCssContent('.text { font-size: 16px; }')

        const { editor } = useAppStore.getState()
        expect(editor.cssContent).toBe('.text { font-size: 16px; }')
        expect(editor.code).toBe('alert("hi");')
        expect(editor.htmlContent).toBe('<span>Text</span>')
      })

      it('should handle empty CSS', () => {
        const { setCssContent } = useAppStore.getState()

        setCssContent('p { color: red; }')
        setCssContent('')

        const { editor } = useAppStore.getState()
        expect(editor.cssContent).toBe('')
      })

      it('should handle complex CSS with media queries', () => {
        const { setCssContent } = useAppStore.getState()
        const complexCSS = `
.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
        `.trim()

        setCssContent(complexCSS)

        const { editor } = useAppStore.getState()
        expect(editor.cssContent).toBe(complexCSS)
      })
    })
  })

  describe('Preview State Actions', () => {
    describe('setPreviewOutput', () => {
      it('should update preview output', () => {
        const { setPreviewOutput } = useAppStore.getState()

        setPreviewOutput('<div>Preview Content</div>')

        const { preview } = useAppStore.getState()
        expect(preview.output).toBe('<div>Preview Content</div>')
      })

      it('should preserve other preview state', () => {
        const { setPreviewOutput, setPreviewUrl, setPreviewLoading } = useAppStore.getState()

        setPreviewUrl('http://localhost:3000')
        setPreviewLoading(true)
        setPreviewOutput('<h1>Title</h1>')

        const { preview } = useAppStore.getState()
        expect(preview.output).toBe('<h1>Title</h1>')
        expect(preview.url).toBe('http://localhost:3000')
        expect(preview.isLoading).toBe(true)
      })

      it('should handle empty output', () => {
        const { setPreviewOutput } = useAppStore.getState()

        setPreviewOutput('<div>Content</div>')
        setPreviewOutput('')

        const { preview } = useAppStore.getState()
        expect(preview.output).toBe('')
      })
    })

    describe('setPreviewUrl', () => {
      it('should update preview URL', () => {
        const { setPreviewUrl } = useAppStore.getState()

        setPreviewUrl('http://localhost:4000')

        const { preview } = useAppStore.getState()
        expect(preview.url).toBe('http://localhost:4000')
      })

      it('should preserve other preview state', () => {
        const { setPreviewUrl, setPreviewOutput, appendTerminalOutput } = useAppStore.getState()

        setPreviewOutput('<p>Output</p>')
        appendTerminalOutput('Log message')
        setPreviewUrl('http://localhost:5000')

        const { preview } = useAppStore.getState()
        expect(preview.url).toBe('http://localhost:5000')
        expect(preview.output).toBe('<p>Output</p>')
        expect(preview.terminalOutput).toBe('Log message')
      })

      it('should handle empty URL', () => {
        const { setPreviewUrl } = useAppStore.getState()

        setPreviewUrl('http://localhost:3000')
        setPreviewUrl('')

        const { preview } = useAppStore.getState()
        expect(preview.url).toBe('')
      })
    })

    describe('setPreviewLoading', () => {
      it('should set loading to true', () => {
        const { setPreviewLoading } = useAppStore.getState()

        setPreviewLoading(true)

        const { preview } = useAppStore.getState()
        expect(preview.isLoading).toBe(true)
      })

      it('should set loading to false', () => {
        const { setPreviewLoading } = useAppStore.getState()

        setPreviewLoading(true)
        setPreviewLoading(false)

        const { preview } = useAppStore.getState()
        expect(preview.isLoading).toBe(false)
      })

      it('should preserve other preview state', () => {
        const { setPreviewLoading, setPreviewOutput, setPreviewUrl } = useAppStore.getState()

        setPreviewOutput('<div>Output</div>')
        setPreviewUrl('http://localhost:3000')
        setPreviewLoading(true)

        const { preview } = useAppStore.getState()
        expect(preview.isLoading).toBe(true)
        expect(preview.output).toBe('<div>Output</div>')
        expect(preview.url).toBe('http://localhost:3000')
      })
    })

    describe('appendTerminalOutput', () => {
      it('should append output to terminal', () => {
        const { appendTerminalOutput } = useAppStore.getState()

        appendTerminalOutput('First line\n')

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('First line\n')
      })

      it('should concatenate multiple appends', () => {
        const { appendTerminalOutput } = useAppStore.getState()

        appendTerminalOutput('Line 1\n')
        appendTerminalOutput('Line 2\n')
        appendTerminalOutput('Line 3\n')

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('Line 1\nLine 2\nLine 3\n')
      })

      it('should preserve other preview state', () => {
        const { appendTerminalOutput, setPreviewOutput, setPreviewUrl } = useAppStore.getState()

        setPreviewOutput('<div>Preview</div>')
        setPreviewUrl('http://localhost:3000')
        appendTerminalOutput('Server log')

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('Server log')
        expect(preview.output).toBe('<div>Preview</div>')
        expect(preview.url).toBe('http://localhost:3000')
      })

      it('should handle empty string appends', () => {
        const { appendTerminalOutput } = useAppStore.getState()

        appendTerminalOutput('Text')
        appendTerminalOutput('')
        appendTerminalOutput('More text')

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('TextMore text')
      })
    })

    describe('clearTerminalOutput', () => {
      it('should clear terminal output', () => {
        const { appendTerminalOutput, clearTerminalOutput } = useAppStore.getState()

        appendTerminalOutput('Some output')
        clearTerminalOutput()

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('')
      })

      it('should preserve other preview state', () => {
        const { appendTerminalOutput, clearTerminalOutput, setPreviewOutput, setPreviewUrl } =
          useAppStore.getState()

        setPreviewOutput('<div>Output</div>')
        setPreviewUrl('http://localhost:3000')
        appendTerminalOutput('Terminal text')
        clearTerminalOutput()

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('')
        expect(preview.output).toBe('<div>Output</div>')
        expect(preview.url).toBe('http://localhost:3000')
      })

      it('should work when terminal is already empty', () => {
        const { clearTerminalOutput } = useAppStore.getState()

        clearTerminalOutput()

        const { preview } = useAppStore.getState()
        expect(preview.terminalOutput).toBe('')
      })
    })
  })

  describe('resetEditor', () => {
    it('should reset editor state to initial values', () => {
      const { resetEditor, setCode, setHtmlContent, setCssContent } = useAppStore.getState()

      setCode('console.log("test")')
      setHtmlContent('<div>HTML</div>')
      setCssContent('body { margin: 0; }')

      resetEditor()

      const { editor } = useAppStore.getState()
      expect(editor.code).toBe('')
      expect(editor.htmlContent).toBe('')
      expect(editor.cssContent).toBe('')
    })

    it('should reset preview state to initial values', () => {
      const {
        resetEditor,
        setPreviewOutput,
        setPreviewUrl,
        setPreviewLoading,
        appendTerminalOutput,
      } = useAppStore.getState()

      setPreviewOutput('<div>Output</div>')
      setPreviewUrl('http://localhost:3000')
      setPreviewLoading(true)
      appendTerminalOutput('Terminal output')

      resetEditor()

      const { preview } = useAppStore.getState()
      expect(preview.output).toBe('')
      expect(preview.url).toBe('')
      expect(preview.isLoading).toBe(false)
      expect(preview.terminalOutput).toBe('')
    })

    it('should not reset framework selection', () => {
      const { resetEditor, setFramework } = useAppStore.getState()

      setFramework('react', 'frontend')
      resetEditor()

      const { selectedFramework, frameworkType } = useAppStore.getState()
      expect(selectedFramework).toBe('react')
      expect(frameworkType).toBe('frontend')
    })

    it('should not reset view mode', () => {
      const { resetEditor, setViewMode } = useAppStore.getState()

      setViewMode('advanced')
      resetEditor()

      const { viewMode } = useAppStore.getState()
      expect(viewMode).toBe('advanced')
    })
  })

  describe('Full-Stack State Actions', () => {
    describe('setAppMode', () => {
      it('should update app mode to backend', () => {
        const { setAppMode } = useAppStore.getState()

        setAppMode('backend')

        const { appMode } = useAppStore.getState()
        expect(appMode).toBe('backend')
      })

      it('should update app mode to fullstack', () => {
        const { setAppMode } = useAppStore.getState()

        setAppMode('fullstack')

        const { appMode } = useAppStore.getState()
        expect(appMode).toBe('fullstack')
      })

      it('should reset preview when switching app modes', () => {
        const { setAppMode, setPreviewOutput, setPreviewUrl } = useAppStore.getState()

        setPreviewOutput('<div>Test</div>')
        setPreviewUrl('http://localhost:3000')

        setAppMode('backend')

        const { preview } = useAppStore.getState()
        expect(preview.output).toBe('')
        expect(preview.url).toBe('')
        expect(preview.isLoading).toBe(false)
      })

      it('should preserve editor state when switching app modes', () => {
        const { setAppMode, setCode } = useAppStore.getState()

        setCode('console.log("test")')

        setAppMode('fullstack')

        const { editor } = useAppStore.getState()
        expect(editor.code).toBe('console.log("test")')
      })
    })

    describe('setFullStackFrameworks', () => {
      it('should update both frontend and backend frameworks', () => {
        const { setFullStackFrameworks } = useAppStore.getState()

        setFullStackFrameworks('vue', 'fastify')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.frontendFramework).toBe('vue')
        expect(fullstack.backendFramework).toBe('fastify')
      })

      it('should preserve backend URL when changing frameworks', () => {
        const { setFullStackFrameworks, setBackendUrl } = useAppStore.getState()

        setBackendUrl('http://localhost:3001')
        setFullStackFrameworks('svelte', 'nextjs')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.backendUrl).toBe('http://localhost:3001')
        expect(fullstack.frontendFramework).toBe('svelte')
        expect(fullstack.backendFramework).toBe('nextjs')
      })

      it('should reset preview when changing frameworks', () => {
        const { setFullStackFrameworks, setPreviewOutput } = useAppStore.getState()

        setPreviewOutput('<div>Old</div>')
        setFullStackFrameworks('angular', 'sveltekit')

        const { preview } = useAppStore.getState()
        expect(preview.output).toBe('')
      })

      it('should handle all frontend framework combinations', () => {
        const { setFullStackFrameworks } = useAppStore.getState()
        const frontendFrameworks = ['vanilla', 'react', 'vue', 'svelte', 'angular'] as const

        frontendFrameworks.forEach(fw => {
          setFullStackFrameworks(fw, 'express')
          const { fullstack } = useAppStore.getState()
          expect(fullstack.frontendFramework).toBe(fw)
          expect(fullstack.backendFramework).toBe('express')
        })
      })

      it('should handle all backend framework combinations', () => {
        const { setFullStackFrameworks } = useAppStore.getState()
        const backendFrameworks = ['express', 'fastify', 'nextjs', 'sveltekit'] as const

        backendFrameworks.forEach(fw => {
          setFullStackFrameworks('react', fw)
          const { fullstack } = useAppStore.getState()
          expect(fullstack.frontendFramework).toBe('react')
          expect(fullstack.backendFramework).toBe(fw)
        })
      })
    })

    describe('setBackendUrl', () => {
      it('should update backend URL', () => {
        const { setBackendUrl } = useAppStore.getState()

        setBackendUrl('http://localhost:3001')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.backendUrl).toBe('http://localhost:3001')
      })

      it('should preserve framework selections when updating URL', () => {
        const { setBackendUrl, setFullStackFrameworks } = useAppStore.getState()

        setFullStackFrameworks('vue', 'fastify')
        setBackendUrl('http://localhost:4000')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.backendUrl).toBe('http://localhost:4000')
        expect(fullstack.frontendFramework).toBe('vue')
        expect(fullstack.backendFramework).toBe('fastify')
      })

      it('should handle empty URL', () => {
        const { setBackendUrl } = useAppStore.getState()

        setBackendUrl('http://localhost:3001')
        setBackendUrl('')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.backendUrl).toBe('')
      })

      it('should handle URL with custom port', () => {
        const { setBackendUrl } = useAppStore.getState()

        setBackendUrl('http://localhost:8080')

        const { fullstack } = useAppStore.getState()
        expect(fullstack.backendUrl).toBe('http://localhost:8080')
      })
    })
  })

  describe('Complex State Interactions', () => {
    it('should handle rapid state updates', () => {
      const { setCode, setHtmlContent, setCssContent } = useAppStore.getState()

      for (let i = 0; i < 10; i++) {
        setCode(`code${i}`)
        setHtmlContent(`<div>${i}</div>`)
        setCssContent(`body { opacity: ${i / 10}; }`)
      }

      const { editor } = useAppStore.getState()
      expect(editor.code).toBe('code9')
      expect(editor.htmlContent).toBe('<div>9</div>')
      expect(editor.cssContent).toBe('body { opacity: 0.9; }')
    })

    it('should maintain state consistency across multiple operations', () => {
      const store = useAppStore.getState()

      store.setFramework('react', 'frontend')
      store.setViewMode('advanced')
      store.setCode('const App = () => <div>Hello</div>;')
      store.setHtmlContent('<div id="root"></div>')
      store.setCssContent('.root { padding: 20px; }')
      store.setPreviewOutput('<div>Preview</div>')

      const state = useAppStore.getState()
      expect(state.selectedFramework).toBe('react')
      expect(state.frameworkType).toBe('frontend')
      expect(state.viewMode).toBe('advanced')
      expect(state.editor.code).toBe('const App = () => <div>Hello</div>;')
      expect(state.editor.htmlContent).toBe('<div id="root"></div>')
      expect(state.editor.cssContent).toBe('.root { padding: 20px; }')
      expect(state.preview.output).toBe('<div>Preview</div>')
    })

    it('should handle framework switching workflow', () => {
      const store = useAppStore.getState()

      // Start with React
      store.setFramework('react', 'frontend')
      store.setCode('const App = () => <div>React</div>;')
      store.setPreviewOutput('<div>React Preview</div>')

      expect(useAppStore.getState().selectedFramework).toBe('react')
      expect(useAppStore.getState().editor.code).toBe('const App = () => <div>React</div>;')

      // Switch to Vue (preview should reset, code should persist)
      store.setFramework('vue', 'frontend')

      expect(useAppStore.getState().selectedFramework).toBe('vue')
      expect(useAppStore.getState().editor.code).toBe('const App = () => <div>React</div>;')
      expect(useAppStore.getState().preview.output).toBe('')
    })

    it('should handle fullstack mode workflow', () => {
      const store = useAppStore.getState()

      // Switch to fullstack mode
      store.setAppMode('fullstack')
      store.setFullStackFrameworks('react', 'express')
      store.setBackendUrl('http://localhost:3001')
      store.setCode('const App = () => <div>Fullstack</div>;')

      const state = useAppStore.getState()
      expect(state.appMode).toBe('fullstack')
      expect(state.fullstack.frontendFramework).toBe('react')
      expect(state.fullstack.backendFramework).toBe('express')
      expect(state.fullstack.backendUrl).toBe('http://localhost:3001')
      expect(state.editor.code).toBe('const App = () => <div>Fullstack</div>;')
    })

    it('should preserve fullstack state when switching to other modes', () => {
      const store = useAppStore.getState()

      store.setAppMode('fullstack')
      store.setFullStackFrameworks('vue', 'fastify')
      store.setBackendUrl('http://localhost:4000')

      // Switch to frontend mode
      store.setAppMode('frontend')

      // Fullstack state should be preserved
      const { fullstack } = useAppStore.getState()
      expect(fullstack.frontendFramework).toBe('vue')
      expect(fullstack.backendFramework).toBe('fastify')
      expect(fullstack.backendUrl).toBe('http://localhost:4000')
    })
  })
})
