import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

/**
 * Custom render function for components with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Create a mock iframe element for testing preview functionality
 */
export function createMockIframe() {
  const iframe = document.createElement('iframe')
  iframe.contentWindow = {
    document: {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
    },
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as any

  return iframe
}

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create a mock file for FileExplorer tests
 */
export function createMockFile(name: string, content: string = '') {
  return {
    name,
    content,
    type: 'file' as const,
  }
}

/**
 * Create a mock directory for FileExplorer tests
 */
export function createMockDirectory(name: string, children: any[] = []) {
  return {
    name,
    type: 'directory' as const,
    children,
  }
}

/**
 * Mock console methods to suppress logs during tests
 */
export function suppressConsole() {
  const originalError = console.error
  const originalWarn = console.warn
  const originalLog = console.log

  beforeAll(() => {
    console.error = vi.fn()
    console.warn = vi.fn()
    console.log = vi.fn()
  })

  afterAll(() => {
    console.error = originalError
    console.warn = originalWarn
    console.log = originalLog
  })
}
