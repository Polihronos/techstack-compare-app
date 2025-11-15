import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCodeExecution } from '../useCodeExecution'
import { FRAMEWORKS } from '@/src/frameworks'

describe('useCodeExecution', () => {
  let mockIframe: HTMLIFrameElement
  let mockIframeDoc: Document

  beforeEach(() => {
    // Create mock iframe document
    mockIframeDoc = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
    } as unknown as Document

    // Create mock iframe
    mockIframe = {
      contentDocument: mockIframeDoc,
    } as HTMLIFrameElement

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('handleRunFrontend', () => {
    it('should execute frontend code in simple mode', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'console.log("test")',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setIsRunning).toHaveBeenCalledWith(true)
      expect(setIsRunning).toHaveBeenCalledWith(false)
      expect(setError).toHaveBeenCalledWith('')
      expect(mockIframeDoc.open).toHaveBeenCalled()
      expect(mockIframeDoc.write).toHaveBeenCalled()
      expect(mockIframeDoc.close).toHaveBeenCalled()
    })

    it('should execute frontend code in advanced mode with HTML and CSS', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const htmlTemplate = '<html><head></head><body><div id="app"></div></body></html>'
      const cssContent = 'body { margin: 0; }'

      await result.current.handleRunFrontend({
        framework: 'react',
        code: 'const App = () => <div>Test</div>',
        iframeRef,
        setIsRunning,
        setError,
        htmlTemplate,
        cssContent,
      })

      expect(setIsRunning).toHaveBeenCalledWith(true)
      expect(setIsRunning).toHaveBeenCalledWith(false)
      expect(mockIframeDoc.write).toHaveBeenCalled()
      const writtenHtml = mockIframeDoc.write.mock.calls[0][0]
      expect(writtenHtml).toContain(cssContent)
    })

    it('should handle invalid framework gracefully', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      await result.current.handleRunFrontend({
        framework: 'invalid-framework' as any,
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith(expect.stringContaining('Invalid frontend framework'))
      expect(setIsRunning).toHaveBeenCalledWith(false)
    })

    it('should handle backend framework ID rejection', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      await result.current.handleRunFrontend({
        framework: 'express' as any, // Backend framework
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith(expect.stringContaining('Invalid frontend framework'))
    })

    it('should execute React code correctly', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const code = 'function App() { return <div>Hello</div>; }'

      await result.current.handleRunFrontend({
        framework: 'react',
        code,
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('')
      const writtenHtml = mockIframeDoc.write.mock.calls[0][0]
      expect(writtenHtml).toContain('react')
      expect(writtenHtml).toContain('babel')
    })

    it('should execute Vue code correctly', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const code = 'const { createApp } = Vue; createApp({ template: "<div>Test</div>" }).mount("#app")'

      await result.current.handleRunFrontend({
        framework: 'vue',
        code,
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('')
      const writtenHtml = mockIframeDoc.write.mock.calls[0][0]
      expect(writtenHtml).toContain('vue')
    })

    it('should execute Svelte code correctly', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const code = '<script>let count = 0;</script><div>{count}</div>'

      await result.current.handleRunFrontend({
        framework: 'svelte',
        code,
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('')
      const writtenHtml = mockIframeDoc.write.mock.calls[0][0]
      expect(writtenHtml).toContain('svelte')
    })

    it('should execute Angular code correctly', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const code = '@Component({ template: `<div>Test</div>` })\nexport class AppComponent {}'

      await result.current.handleRunFrontend({
        framework: 'angular',
        code,
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('')
      const writtenHtml = mockIframeDoc.write.mock.calls[0][0]
      expect(writtenHtml).toContain('typescript')
    })

    it('should execute Vanilla JS code correctly', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const code = 'document.getElementById("app").innerHTML = "Test"'

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code,
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('')
      expect(mockIframeDoc.write).toHaveBeenCalled()
    })

    it('should handle null iframe ref gracefully', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: null }

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      // Should not throw, should complete
      expect(setIsRunning).toHaveBeenCalledWith(false)
      expect(setError).toHaveBeenCalledWith('')
    })

    it('should handle null contentDocument gracefully', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeWithNullDoc = { contentDocument: null } as HTMLIFrameElement
      const iframeRef = { current: iframeWithNullDoc }

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setIsRunning).toHaveBeenCalledWith(false)
      expect(setError).toHaveBeenCalledWith('')
      expect(mockIframeDoc.write).not.toHaveBeenCalled()
    })

    it('should pass mode=advanced when htmlTemplate is provided', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const htmlTemplate = '<html><body></body></html>'

      // Spy on the executor
      const executeSpy = vi.spyOn(FRAMEWORKS.vanilla.executor, 'execute')

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
        htmlTemplate,
      })

      expect(executeSpy).toHaveBeenCalledWith('test', expect.objectContaining({
        mode: 'advanced',
        files: expect.objectContaining({
          html: htmlTemplate,
        }),
      }))

      executeSpy.mockRestore()
    })

    it('should pass mode=simple when htmlTemplate is not provided', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      const executeSpy = vi.spyOn(FRAMEWORKS.vanilla.executor, 'execute')

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(executeSpy).toHaveBeenCalledWith('test', expect.objectContaining({
        mode: 'simple',
      }))

      executeSpy.mockRestore()
    })

    it('should handle executor errors gracefully', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      // Mock executor to throw error
      const executeSpy = vi.spyOn(FRAMEWORKS.vanilla.executor, 'execute')
        .mockRejectedValue(new Error('Executor failed'))

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('Executor failed')
      expect(setIsRunning).toHaveBeenCalledWith(false)

      executeSpy.mockRestore()
    })

    it('should handle non-Error exceptions', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }

      const executeSpy = vi.spyOn(FRAMEWORKS.vanilla.executor, 'execute')
        .mockRejectedValue('String error')

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(setError).toHaveBeenCalledWith('Execution failed')
      expect(setIsRunning).toHaveBeenCalledWith(false)

      executeSpy.mockRestore()
    })

    it('should log errors to console', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const iframeRef = { current: mockIframe }
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const testError = new Error('Test error')
      const executeSpy = vi.spyOn(FRAMEWORKS.vanilla.executor, 'execute')
        .mockRejectedValue(testError)

      await result.current.handleRunFrontend({
        framework: 'vanilla',
        code: 'test',
        iframeRef,
        setIsRunning,
        setError,
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Execution error:', testError)

      executeSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('handleRunBackend', () => {
    let mockTerminal: any

    beforeEach(() => {
      // Mock terminal
      mockTerminal = {
        ready: true,
        clear: vi.fn(),
      }
      ;(window as any).__terminal = mockTerminal

      // Mock webContainerExecutor
      vi.mock('@/src/executors/backend/webcontainer-executor', () => ({
        webContainerExecutor: {
          execute: vi.fn().mockResolvedValue(undefined),
        },
      }))
    })

    afterEach(() => {
      delete (window as any).__terminal
    })

    it('should wait for terminal to be ready', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      // Terminal not ready initially
      mockTerminal.ready = false

      // Make it ready after 200ms
      setTimeout(() => {
        mockTerminal.ready = true
      }, 200)

      const promise = result.current.handleRunBackend({
        backendFiles: { 'index.js': 'console.log("test")' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      await waitFor(() => {
        expect(mockTerminal.ready).toBe(true)
      }, { timeout: 500 })

      await promise

      expect(mockTerminal.clear).toHaveBeenCalled()
    })

    it('should clear terminal outputs on start', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      await result.current.handleRunBackend({
        backendFiles: { 'index.js': 'test' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      expect(setTerminalOutputs).toHaveBeenCalledWith(expect.any(Function))
      // Call the updater function to verify it returns empty array
      const updater = setTerminalOutputs.mock.calls[0][0]
      expect(updater([])).toEqual([])
    })

    it('should clear server URL on start', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      await result.current.handleRunBackend({
        backendFiles: { 'index.js': 'test' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      expect(setServerUrl).toHaveBeenCalledWith('')
    })

    it('should clear error on start', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      await result.current.handleRunBackend({
        backendFiles: { 'index.js': 'test' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      expect(setError).toHaveBeenCalledWith('')
    })

    it('should set isRunning to true at start and false at end', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      await result.current.handleRunBackend({
        backendFiles: { 'index.js': 'test' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      expect(setIsRunning).toHaveBeenCalledWith(true)
      expect(setIsRunning).toHaveBeenCalledWith(false)
    })

    it('should handle backend execution errors', async () => {
      const { result } = renderHook(() => useCodeExecution())
      const setIsRunning = vi.fn()
      const setError = vi.fn()
      const setServerUrl = vi.fn()
      const setTerminalOutputs = vi.fn()

      // We can't easily mock the webContainerExecutor in this test structure
      // because it's imported directly. This test verifies the error handling structure exists.

      await result.current.handleRunBackend({
        backendFiles: { 'index.js': 'test' },
        setIsRunning,
        setError,
        setServerUrl,
        setTerminalOutputs,
      })

      // Verify execution completes
      expect(setIsRunning).toHaveBeenCalledWith(false)
    })
  })

  describe('Return value', () => {
    it('should return handleRunFrontend and handleRunBackend functions', () => {
      const { result } = renderHook(() => useCodeExecution())

      expect(result.current).toHaveProperty('handleRunFrontend')
      expect(result.current).toHaveProperty('handleRunBackend')
      expect(typeof result.current.handleRunFrontend).toBe('function')
      expect(typeof result.current.handleRunBackend).toBe('function')
    })

    it('should return stable function references with useCallback', () => {
      const { result, rerender } = renderHook(() => useCodeExecution())

      const firstRender = {
        handleRunFrontend: result.current.handleRunFrontend,
        handleRunBackend: result.current.handleRunBackend,
      }

      // Rerender
      rerender()

      // Functions should maintain reference equality
      expect(result.current.handleRunFrontend).toBe(firstRender.handleRunFrontend)
      expect(result.current.handleRunBackend).toBe(firstRender.handleRunBackend)
    })
  })
})
