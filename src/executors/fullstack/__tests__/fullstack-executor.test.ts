/**
 * Tests for Full-Stack Executor
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FullStackExecutor } from '../fullstack-executor';
import { webContainerExecutor } from '../../backend/webcontainer-executor';
import type { FullStackTemplate } from '@/src/frameworks/fullstack/types';

// Mock the webcontainer executor
vi.mock('../../backend/webcontainer-executor', () => ({
  webContainerExecutor: {
    execute: vi.fn(),
    cleanup: vi.fn(),
  },
}));

describe('FullStackExecutor', () => {
  let executor: FullStackExecutor;
  let mockTemplate: FullStackTemplate;

  beforeEach(() => {
    executor = new FullStackExecutor();

    // Create a mock template
    mockTemplate = {
      id: 'test-template',
      name: 'Test Template',
      description: 'Test full-stack template',
      frontendFramework: 'react',
      backendFramework: 'express',
      files: {
        frontend: {
          'App.jsx': `
            const API_URL = '__BACKEND_URL__';
            fetch(\`\${API_URL}/api/test\`);
          `,
          'index.html': '<html><head></head><body><div id="root"></div></body></html>',
          'styles.css': 'body { margin: 0; }',
        },
        backend: {
          'package.json': JSON.stringify({
            name: 'test-backend',
            type: 'module',
            dependencies: {
              express: '^4.18.2',
            },
          }),
          'server.js': `
            import express from 'express';
            const app = express();
            app.get('/api/test', (req, res) => res.json({ ok: true }));
            app.listen(3001);
          `,
        },
      },
    };

    vi.clearAllMocks();
  });

  afterEach(async () => {
    await executor.cleanup();
  });

  describe('execute', () => {
    it('should start backend before preparing frontend', async () => {
      const mockBackendUrl = 'http://localhost:3001';
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      // Mock webContainerExecutor to call the onReady callback
      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          // Simulate backend startup
          onOutput('Starting server...\n');
          setTimeout(() => {
            onReady(mockBackendUrl);
          }, 100);
        }
      );

      await executor.execute(mockTemplate, callbacks);

      // Verify backend was started with files including frontend HTML
      expect(webContainerExecutor.execute).toHaveBeenCalled();
      const callArgs = vi.mocked(webContainerExecutor.execute).mock.calls[0];
      const filesArg = callArgs[0];

      // Should include backend files
      expect(filesArg).toHaveProperty('package.json');
      expect(filesArg).toHaveProperty('server.js');

      // Should include frontend HTML
      expect(filesArg).toHaveProperty('public/index.html');

      // Verify callbacks were called in correct order
      expect(callbacks.onBackendOutput).toHaveBeenCalled();
      expect(callbacks.onBackendReady).toHaveBeenCalledWith(mockBackendUrl);
      expect(callbacks.onFrontendReady).toHaveBeenCalled();
    });

    it('should pass backend URL to frontend callback', async () => {
      const mockBackendUrl = 'http://test-backend.local:3001';
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          setTimeout(() => onReady(mockBackendUrl), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);

      // Check that frontend URL was passed (same as backend URL)
      expect(callbacks.onFrontendReady).toHaveBeenCalledWith(mockBackendUrl);
    });

    it('should add frontend HTML to backend files', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          // Verify that public/index.html was added to the files
          expect(files).toHaveProperty('public/index.html');
          const html = files['public/index.html'] as string;

          // Verify HTML contains React CDN
          expect(html).toContain('react@18/umd/react.development.js');
          expect(html).toContain('react-dom@18/umd/react-dom.development.js');
          expect(html).toContain('@babel/standalone/babel.min.js');

          setTimeout(() => onReady('http://localhost:3001'), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);
    });

    it('should replace backend URL placeholder with empty string', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          const html = files['public/index.html'] as string;

          // Verify __BACKEND_URL__ was replaced with empty string (same-origin)
          expect(html).not.toContain('__BACKEND_URL__');

          setTimeout(() => onReady('http://localhost:3001'), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);
    });

    it('should pass backend output to callback', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      const testOutput = 'Server starting...\nListening on port 3001\n';

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          onOutput(testOutput);
          setTimeout(() => onReady('http://localhost:3001'), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);

      // Verify output was passed through
      expect(callbacks.onBackendOutput).toHaveBeenCalledWith(
        expect.stringContaining('Starting full-stack application')
      );
      expect(callbacks.onBackendOutput).toHaveBeenCalledWith(testOutput);
    });

    it('should handle backend startup errors', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      const error = new Error('Backend startup failed');
      vi.mocked(webContainerExecutor.execute).mockRejectedValue(error);

      await expect(executor.execute(mockTemplate, callbacks)).rejects.toThrow(
        'Backend startup failed'
      );

      expect(callbacks.onError).toHaveBeenCalledWith('Backend startup failed');
    });

    it('should wait for backend to be ready before preparing frontend', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      const callOrder: string[] = [];

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          // Simulate delayed backend startup
          setTimeout(() => {
            callOrder.push('backend-ready');
            onReady('http://localhost:3001');
          }, 200);
        }
      );

      callbacks.onBackendReady.mockImplementation((url) => {
        callOrder.push('callback-backend-ready');
      });

      callbacks.onFrontendReady.mockImplementation((html) => {
        callOrder.push('frontend-ready');
      });

      await executor.execute(mockTemplate, callbacks);

      // Verify order: backend ready -> callback -> frontend ready
      expect(callOrder).toEqual([
        'backend-ready',
        'callback-backend-ready',
        'frontend-ready',
      ]);
    });
  });

  describe('cleanup', () => {
    it('should cleanup webcontainer when backend is running', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          setTimeout(() => onReady('http://localhost:3001'), 50);
        }
      );

      // Execute to set backend running
      await executor.execute(mockTemplate, callbacks);

      expect(executor.isRunning()).toBe(true);

      // Cleanup
      await executor.cleanup();

      expect(webContainerExecutor.cleanup).toHaveBeenCalled();
      expect(executor.isRunning()).toBe(false);
      expect(executor.getBackendUrl()).toBe('');
    });

    it('should not call webcontainer cleanup if not running', async () => {
      await executor.cleanup();

      expect(webContainerExecutor.cleanup).not.toHaveBeenCalled();
    });
  });

  describe('getBackendUrl', () => {
    it('should return empty string initially', () => {
      expect(executor.getBackendUrl()).toBe('');
    });

    it('should return backend URL after execution', async () => {
      const mockUrl = 'http://localhost:3001';
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          setTimeout(() => onReady(mockUrl), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);

      expect(executor.getBackendUrl()).toBe(mockUrl);
    });
  });

  describe('isRunning', () => {
    it('should return false initially', () => {
      expect(executor.isRunning()).toBe(false);
    });

    it('should return true after execution', async () => {
      const callbacks = {
        onBackendOutput: vi.fn(),
        onBackendReady: vi.fn(),
        onFrontendReady: vi.fn(),
        onError: vi.fn(),
      };

      vi.mocked(webContainerExecutor.execute).mockImplementation(
        async (files, onOutput, onReady) => {
          setTimeout(() => onReady('http://localhost:3001'), 50);
        }
      );

      await executor.execute(mockTemplate, callbacks);

      expect(executor.isRunning()).toBe(true);
    });
  });
});
