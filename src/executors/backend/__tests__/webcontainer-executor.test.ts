import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Create mocks before any imports
const mockProcess = {
  exit: Promise.resolve(0),
  output: {
    pipeTo: vi.fn((stream: any) => {
      // Call the write function with some data
      if (stream && stream.write) {
        stream.write('Installing dependencies...\n')
      }
      return Promise.resolve()
    }),
  },
  kill: vi.fn(),
}

const mockWebContainer = {
  mount: vi.fn().mockResolvedValue(undefined),
  spawn: vi.fn().mockResolvedValue(mockProcess),
  on: vi.fn((event: string, callback: Function) => {
    // Return unsubscribe function
    return vi.fn()
  }),
  teardown: vi.fn().mockResolvedValue(undefined),
}

const mockWebContainerClass = {
  boot: vi.fn().mockResolvedValue(mockWebContainer),
}

// Mock the module
vi.mock('@webcontainer/api', () => ({
  WebContainer: mockWebContainerClass,
}))

// Mock window
global.window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
} as any

// Now import the module after mocks are set up
const { WebContainerExecutor, webContainerExecutor } = await import('../webcontainer-executor')

describe('WebContainerExecutor', () => {
  let executor: WebContainerExecutor
  let mockOnOutput: ReturnType<typeof vi.fn>
  let mockOnReady: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    executor = new WebContainerExecutor()
    mockOnOutput = vi.fn()
    mockOnReady = vi.fn()

    // Reset mock implementations
    mockWebContainer.mount.mockResolvedValue(undefined)
    mockWebContainer.spawn.mockResolvedValue(mockProcess)
    mockWebContainerClass.boot.mockResolvedValue(mockWebContainer)
    mockProcess.kill.mockClear()
  })

  describe('Singleton Pattern', () => {
    it('should export singleton instance', () => {
      expect(webContainerExecutor).toBeInstanceOf(WebContainerExecutor)
    })
  })

  describe('createFileSystemTree', () => {
    it('should convert flat files to tree structure', () => {
      const files = {
        'package.json': '{"name": "test"}',
        'server.js': 'console.log("test")',
      }

      const tree = (executor as any).createFileSystemTree(files)

      expect(tree).toEqual({
        'package.json': {
          file: {
            contents: '{"name": "test"}',
          },
        },
        'server.js': {
          file: {
            contents: 'console.log("test")',
          },
        },
      })
    })

    it('should handle nested directory structure', () => {
      const files = {
        'src/index.js': 'console.log("index")',
        'src/utils/helper.js': 'export const helper = () => {}',
      }

      const tree = (executor as any).createFileSystemTree(files)

      expect(tree.src.directory['index.js']).toEqual({
        file: { contents: 'console.log("index")' },
      })
      expect(tree.src.directory.utils.directory['helper.js']).toEqual({
        file: { contents: 'export const helper = () => {}' },
      })
    })

    it('should handle deeply nested paths', () => {
      const files = {
        'a/b/c/d/file.js': 'content',
      }

      const tree = (executor as any).createFileSystemTree(files)

      expect(tree.a.directory.b.directory.c.directory.d.directory['file.js']).toEqual({
        file: { contents: 'content' },
      })
    })

    it('should handle multiple files in same directory', () => {
      const files = {
        'src/file1.js': 'content1',
        'src/file2.js': 'content2',
      }

      const tree = (executor as any).createFileSystemTree(files)

      expect(Object.keys(tree.src.directory)).toContain('file1.js')
      expect(Object.keys(tree.src.directory)).toContain('file2.js')
    })

    it('should handle empty files object', () => {
      const tree = (executor as any).createFileSystemTree({})
      expect(tree).toEqual({})
    })
  })

  describe('flattenFileSystem', () => {
    it('should flatten simple file structure', () => {
      const files = {
        'package.json': '{"name": "test"}',
        'server.js': 'console.log("test")',
      }

      const flattened = (executor as any).flattenFileSystem(files)
      expect(flattened).toEqual(files)
    })

    it('should flatten nested directory structure', () => {
      const files = {
        'package.json': '{"name": "test"}',
        src: {
          'index.js': 'console.log("index")',
          utils: {
            'helper.js': 'export const helper = () => {}',
          },
        },
      }

      const flattened = (executor as any).flattenFileSystem(files)

      expect(flattened).toEqual({
        'package.json': '{"name": "test"}',
        'src/index.js': 'console.log("index")',
        'src/utils/helper.js': 'export const helper = () => {}',
      })
    })

    it('should handle deeply nested structures', () => {
      const files = {
        a: {
          b: {
            c: {
              'file.js': 'content',
            },
          },
        },
      }

      const flattened = (executor as any).flattenFileSystem(files)
      expect(flattened).toEqual({ 'a/b/c/file.js': 'content' })
    })

    it('should handle empty object', () => {
      const flattened = (executor as any).flattenFileSystem({})
      expect(flattened).toEqual({})
    })
  })

  describe('execute', () => {
    const mockFiles = {
      'package.json': JSON.stringify({
        name: 'test-server',
        scripts: {
          dev: 'node server.js',
        },
      }),
      'server.js': 'console.log("Server running")',
    }

    it('should boot WebContainer', async () => {
      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(mockFiles, mockOnOutput, mockOnReady)

      expect(mockWebContainerClass.boot).toHaveBeenCalled()
    })

    it('should mount files to WebContainer', async () => {
      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(mockFiles, mockOnOutput, mockOnReady)

      expect(mockWebContainer.mount).toHaveBeenCalled()
    })

    it('should install dependencies', async () => {
      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(mockFiles, mockOnOutput, mockOnReady)

      expect(mockWebContainer.spawn).toHaveBeenCalledWith('npm', ['install'])
    })

    it('should throw error if npm install fails', async () => {
      mockWebContainer.spawn.mockResolvedValueOnce({
        exit: Promise.resolve(1),
        output: { pipeTo: vi.fn() },
      })

      await expect(
        executor.execute(mockFiles, mockOnOutput, mockOnReady)
      ).rejects.toThrow('Failed to install dependencies')
    })

    it('should run dev script when available', async () => {
      let spawnCallCount = 0
      mockWebContainer.spawn.mockImplementation(async (cmd: string, args: string[]) => {
        spawnCallCount++
        if (spawnCallCount === 1) {
          // npm install
          return mockProcess
        }
        // npm run dev
        expect(cmd).toBe('npm')
        expect(args).toEqual(['run', 'dev'])
        return mockProcess
      })

      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(mockFiles, mockOnOutput, mockOnReady)

      expect(mockWebContainer.spawn).toHaveBeenCalledWith('npm', ['run', 'dev'])
    })

    it('should run start script when dev not available', async () => {
      const filesWithStart = {
        'package.json': JSON.stringify({
          name: 'test',
          scripts: { start: 'node server.js' },
        }),
        'server.js': 'console.log("test")',
      }

      let spawnCallCount = 0
      mockWebContainer.spawn.mockImplementation(async (cmd: string, args: string[]) => {
        spawnCallCount++
        if (spawnCallCount === 2) {
          expect(args).toEqual(['run', 'start'])
        }
        return mockProcess
      })

      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(filesWithStart, mockOnOutput, mockOnReady)

      expect(mockWebContainer.spawn).toHaveBeenCalledWith('npm', ['run', 'start'])
    })

    it('should run node server.js when no scripts defined', async () => {
      const filesNoScript = {
        'package.json': JSON.stringify({ name: 'test' }),
        'server.js': 'console.log("test")',
      }

      let spawnCallCount = 0
      mockWebContainer.spawn.mockImplementation(async (cmd: string, args: string[]) => {
        spawnCallCount++
        if (spawnCallCount === 2) {
          expect(cmd).toBe('node')
          expect(args).toEqual(['server.js'])
        }
        return mockProcess
      })

      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(filesNoScript, mockOnOutput, mockOnReady)

      expect(mockWebContainer.spawn).toHaveBeenCalledWith('node', ['server.js'])
    })

    it('should call onOutput callback', async () => {
      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await executor.execute(mockFiles, mockOnOutput, mockOnReady)

      expect(mockOnOutput).toHaveBeenCalled()
      expect(mockOnOutput).toHaveBeenCalledWith(expect.stringContaining('Installing dependencies'))
    })

    it('should handle mount errors', async () => {
      mockWebContainer.mount.mockRejectedValueOnce(new Error('Mount failed'))
      mockWebContainer.on.mockImplementation((event: string, callback: Function) => {
        if (event === 'server-ready') {
          setTimeout(() => callback(3000, 'http://localhost:3000'), 10)
        }
        return vi.fn()
      })

      await expect(
        executor.execute(mockFiles, mockOnOutput, mockOnReady)
      ).rejects.toThrow('Mount failed')
    })
  })

  describe('waitForServerReady', () => {
    it('should call onReady when server-ready event fires', (done) => {
      const mockContainer = {
        on: vi.fn((event: string, callback: Function) => {
          if (event === 'server-ready') {
            setTimeout(() => {
              callback(3000, 'http://localhost:3000')
              expect(mockOnReady).toHaveBeenCalledWith('http://localhost:3000')
              done()
            }, 10)
          }
          return vi.fn()
        }),
      } as any

      ;(executor as any).waitForServerReady(mockContainer, mockOnOutput, mockOnReady)
    })

    it('should timeout after 30 seconds', (done) => {
      vi.useFakeTimers()

      const mockContainer = {
        on: vi.fn(() => vi.fn()),
      } as any

      ;(executor as any).waitForServerReady(mockContainer, mockOnOutput, mockOnReady)

      vi.advanceTimersByTime(30000)

      setTimeout(() => {
        expect(mockOnOutput).toHaveBeenCalledWith(expect.stringContaining('timeout'))
        expect(mockOnReady).not.toHaveBeenCalled()
        vi.useRealTimers()
        done()
      }, 0)
    })
  })

})
