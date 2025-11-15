import { vi } from 'vitest'

/**
 * Mock XTerm.js terminal for testing
 */
export class MockTerminal {
  onData = vi.fn((callback: (data: string) => void) => ({ dispose: vi.fn() }))
  onResize = vi.fn((callback: (data: { cols: number; rows: number }) => void) => ({ dispose: vi.fn() }))
  write = vi.fn()
  writeln = vi.fn()
  clear = vi.fn()
  reset = vi.fn()
  open = vi.fn()
  dispose = vi.fn()
  loadAddon = vi.fn()
  focus = vi.fn()
  blur = vi.fn()

  rows = 24
  cols = 80
}

export class MockFitAddon {
  fit = vi.fn()
  dispose = vi.fn()
}

// Mock the @xterm/xterm package
vi.mock('@xterm/xterm', () => ({
  Terminal: MockTerminal,
}))

// Mock the @xterm/addon-fit package
vi.mock('@xterm/addon-fit', () => ({
  FitAddon: MockFitAddon,
}))
