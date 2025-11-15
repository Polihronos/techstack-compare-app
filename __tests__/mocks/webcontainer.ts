import { vi } from 'vitest'

/**
 * Mock WebContainer API for testing
 * WebContainers require a browser environment and SharedArrayBuffer
 */
export class MockWebContainerProcess {
  exit = Promise.resolve(0)

  output = {
    pipeTo: vi.fn(),
  }

  kill = vi.fn()
}

export class MockWebContainer {
  static boot = vi.fn(async () => new MockWebContainer())

  mount = vi.fn(async () => {})
  spawn = vi.fn(async () => new MockWebContainerProcess())
  on = vi.fn((event: string, callback: Function) => {})
  teardown = vi.fn(async () => {})

  fs = {
    readFile: vi.fn(async () => 'mock file content'),
    writeFile: vi.fn(async () => {}),
    readdir: vi.fn(async () => []),
    rm: vi.fn(async () => {}),
    mkdir: vi.fn(async () => {}),
  }

  path = {
    resolve: vi.fn((...args: string[]) => args.join('/')),
  }
}

// Mock the @webcontainer/api package
vi.mock('@webcontainer/api', () => ({
  WebContainer: MockWebContainer,
}))
