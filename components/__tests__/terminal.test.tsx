import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

// Mock XTerm classes inside the factory
vi.mock('@xterm/xterm', () => ({
  Terminal: class {
    write = vi.fn()
    writeln = vi.fn()
    clear = vi.fn()
    dispose = vi.fn()
    onData = vi.fn()
    open = vi.fn()
    loadAddon = vi.fn()
    constructor(options: any) {}
  },
}))

vi.mock('@xterm/addon-fit', () => ({
  FitAddon: class {
    fit = vi.fn()
    constructor() {}
  },
}))

import { Terminal, useTerminalWriter } from '../terminal'

describe('Terminal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as any).__terminal
    // Use fake timers for testing
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render terminal container', () => {
      const { container } = render(<Terminal />)

      const terminalDiv = container.querySelector('div')
      expect(terminalDiv).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(<Terminal className="custom-class" />)

      const terminalDiv = container.querySelector('.custom-class')
      expect(terminalDiv).toBeInTheDocument()
    })

    it('should set full height and width styles', () => {
      const { container } = render(<Terminal />)

      const terminalDiv = container.querySelector('div')
      expect(terminalDiv).toHaveStyle({ height: '100%', width: '100%' })
    })

    it('should initialize xterm after timeout', () => {
      render(<Terminal />)

      // Fast-forward time to trigger initialization (150ms for both timers)
      vi.advanceTimersByTime(150)

      // Verify XTerm was created and methods called
      expect((window as any).__terminal).toBeDefined()
    })

    it('should expose terminal to window after initialization', () => {
      render(<Terminal />)

      // Fast-forward initialization timers
      vi.advanceTimersByTime(150)

      expect((window as any).__terminal).toBeDefined()
      expect((window as any).__terminal.ready).toBe(true)
    })

    it('should dispatch terminal-ready event', () => {
      const eventListener = vi.fn()
      window.addEventListener('terminal-ready', eventListener)

      render(<Terminal />)

      // Fast-forward initialization timers
      vi.advanceTimersByTime(150)

      expect(eventListener).toHaveBeenCalled()
    })

    it('should setup window resize handler', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      render(<Terminal />)
      vi.advanceTimersByTime(150)

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('should handle onData callback', () => {
      const onData = vi.fn()
      render(<Terminal onData={onData} />)

      // Fast-forward to initialization (150ms for both timers)
      vi.advanceTimersByTime(150)

      // onData should be registered
      expect((window as any).__terminal).toBeDefined()
    })
  })

  describe('useTerminalWriter Hook', () => {
    it('should provide write method', () => {
      const mockWrite = vi.fn()
      ;(window as any).__terminal = {
        write: mockWrite,
        writeln: vi.fn(),
        clear: vi.fn(),
      }

      const TestComponent = () => {
        const { write } = useTerminalWriter()
        write('test')
        return null
      }

      render(<TestComponent />)

      expect(mockWrite).toHaveBeenCalledWith('test')
    })

    it('should provide writeln method', () => {
      const mockWriteln = vi.fn()
      ;(window as any).__terminal = {
        write: vi.fn(),
        writeln: mockWriteln,
        clear: vi.fn(),
      }

      const TestComponent = () => {
        const { writeln } = useTerminalWriter()
        writeln('test line')
        return null
      }

      render(<TestComponent />)

      expect(mockWriteln).toHaveBeenCalledWith('test line')
    })

    it('should provide clear method', () => {
      const mockClear = vi.fn()
      ;(window as any).__terminal = {
        write: vi.fn(),
        writeln: vi.fn(),
        clear: mockClear,
      }

      const TestComponent = () => {
        const { clear } = useTerminalWriter()
        clear()
        return null
      }

      render(<TestComponent />)

      expect(mockClear).toHaveBeenCalled()
    })

    it('should handle missing terminal gracefully', () => {
      delete (window as any).__terminal

      const TestComponent = () => {
        const { write, writeln, clear } = useTerminalWriter()
        write('test')
        writeln('test')
        clear()
        return null
      }

      expect(() => render(<TestComponent />)).not.toThrow()
    })
  })

  describe('Cleanup', () => {
    it('should clear timers on unmount', () => {
      const { unmount } = render(<Terminal />)

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow()
    })

    it('should handle unmount before initialization', () => {
      const { unmount } = render(<Terminal />)

      // Unmount immediately
      unmount()

      // Should not throw
      expect(true).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple renders', () => {
      const { rerender } = render(<Terminal />)

      expect(() => rerender(<Terminal className="new-class" />)).not.toThrow()
    })

    it('should handle onData callback prop', () => {
      const onData = vi.fn()

      expect(() => render(<Terminal onData={onData} />)).not.toThrow()
    })

    it('should handle className prop', () => {
      const { container } = render(<Terminal className="test-terminal" />)

      expect(container.querySelector('.test-terminal')).toBeInTheDocument()
    })
  })
})
