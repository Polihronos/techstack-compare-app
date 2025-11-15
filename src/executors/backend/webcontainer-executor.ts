import { WebContainer } from '@webcontainer/api';
import type { FileSystemTree } from '@webcontainer/api';
import { BaseBackendExecutor } from '../base';
import type { FileSystemTemplate } from '../../frameworks/types';

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'error';
  data: string;
}

let webcontainerInstance: WebContainer | null = null;
let currentProcess: any = null; // Track the running server process

/**
 * WebContainer Backend Executor
 * Handles execution of backend frameworks in WebContainers
 */
export class WebContainerExecutor extends BaseBackendExecutor {
  // Boot WebContainer (only once)
  private async bootWebContainer(): Promise<WebContainer> {
    // Only run on client-side
    if (typeof window === 'undefined') {
      throw new Error('WebContainer can only run in the browser');
    }

    if (webcontainerInstance) {
      console.log('[WebContainer] Already booted, reusing instance');
      return webcontainerInstance;
    }

    try {
      console.log('[WebContainer] Booting new instance...');
      webcontainerInstance = await WebContainer.boot();
      console.log('[WebContainer] Boot successful');
      return webcontainerInstance;
    } catch (error) {
      console.error('[WebContainer] Boot failed:', error);
      throw new Error('WebContainer initialization failed. Please refresh the page.');
    }
  }

  // Convert file structure to WebContainer format
  private createFileSystemTree(files: Record<string, string>): FileSystemTree {
    const tree: FileSystemTree = {};

    for (const [path, content] of Object.entries(files)) {
      const parts = path.split('/');
      let current: any = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        if (isLast) {
          // It's a file
          current[part] = {
            file: {
              contents: content
            }
          };
        } else {
          // It's a directory
          if (!current[part]) {
            current[part] = {
              directory: {}
            };
          }
          current = current[part].directory;
        }
      }
    }

    return tree;
  }

  // Flatten FileSystemTemplate to Record<string, string>
  private flattenFileSystem(files: FileSystemTemplate, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(files)) {
      const path = prefix ? `${prefix}/${key}` : key;

      if (typeof value === 'string') {
        result[path] = value;
      } else {
        // Recursively flatten nested directories
        Object.assign(result, this.flattenFileSystem(value as FileSystemTemplate, path));
      }
    }

    return result;
  }

  async execute(
    files: FileSystemTemplate,
    onOutput: (text: string) => void,
    onReady: (url: string) => void
  ): Promise<void> {
    try {
      const flatFiles = this.flattenFileSystem(files);
      console.log('[WebContainer] Execute backend called with files:', Object.keys(flatFiles));
      const webcontainer = await this.bootWebContainer();

      // Kill any existing process first
      if (currentProcess) {
        try {
          console.log('[WebContainer] Killing previous process...');
          currentProcess.kill();
          currentProcess = null;
          // Wait a bit for the port to be released
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('[WebContainer] Previous process killed');
        } catch (e) {
          console.log('[WebContainer] Could not kill previous process:', e);
        }
      }

      // Mount files
      console.log('[WebContainer] Mounting files...');
      const fileTree = this.createFileSystemTree(flatFiles);
      await webcontainer.mount(fileTree);
      console.log('[WebContainer] Files mounted');

      // Install dependencies
      console.log('[WebContainer] Installing dependencies...');
      onOutput('📦 Installing dependencies...\n');

      const installProcess = await webcontainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            onOutput(data);
          }
        })
      );

      const installExitCode = await installProcess.exit;
      console.log('[WebContainer] npm install exit code:', installExitCode);
      if (installExitCode !== 0) {
        console.error('[WebContainer] npm install failed');
        throw new Error('Failed to install dependencies');
      }

      // Determine which command to run
      const packageJson = JSON.parse(flatFiles['package.json']);
      const hasDevScript = packageJson.scripts?.dev;
      const hasStartScript = packageJson.scripts?.start;
      const scriptName = hasDevScript ? 'dev' : hasStartScript ? 'start' : null;
      console.log('[WebContainer] Start script:', scriptName ? `npm run ${scriptName}` : 'node server.js (direct)');

      if (!scriptName) {
        // No script defined, try to run server.js directly
        console.log('[WebContainer] Starting server with node server.js...');
        onOutput('\n🚀 Starting server...\n');

        const serverProcess = await webcontainer.spawn('node', ['server.js']);
        currentProcess = serverProcess; // Store the process reference

        serverProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              onOutput(data);
            }
          })
        );

        // Wait for server-ready event
        console.log('[WebContainer] Waiting for server-ready event...');
        this.waitForServerReady(webcontainer, onOutput, onReady);
      } else {
        // Run the dev/start script
        console.log(`[WebContainer] Starting server with npm run ${scriptName}...`);
        onOutput('\n🚀 Starting server...\n');

        const startProcess = await webcontainer.spawn('npm', ['run', scriptName]);
        currentProcess = startProcess; // Store the process reference

        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              onOutput(data);
            }
          })
        );

        // Wait for server-ready event
        console.log('[WebContainer] Waiting for server-ready event...');
        this.waitForServerReady(webcontainer, onOutput, onReady);
      }
    } catch (error) {
      console.error('[WebContainer] Execution error:', error);
      onOutput(`\n❌ Error: ${error instanceof Error ? error.message : 'Execution failed'}\n`);
      throw error;
    }
  }

  private waitForServerReady(
    webcontainer: WebContainer,
    onOutput: (text: string) => void,
    onReady: (url: string) => void
  ): void {
    let unsubscribe: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const handleServerReady = (port: number, url: string) => {
      console.log('[WebContainer] Server ready event received:', port, url);
      onOutput(`\n✅ Server ready at ${url}\n`);
      cleanup();
      onReady(url);
    };

    unsubscribe = webcontainer.on('server-ready', handleServerReady);

    // Timeout after 30 seconds
    timeoutId = setTimeout(() => {
      console.error('[WebContainer] Server startup timeout (30s)');
      cleanup();
      onOutput('\n⏱️  Server startup timeout - server may not have started listening on a port\n');
    }, 30000);
  }

  async cleanup(): Promise<void> {
    // Kill the current process if any
    if (currentProcess) {
      try {
        currentProcess.kill();
        currentProcess = null;
        // Wait for port to be released
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Failed to kill process:', error);
      }
    }
  }

  // Get WebContainer instance (for direct access if needed)
  static getWebContainerInstance(): WebContainer | null {
    return webcontainerInstance;
  }
}

// Singleton instance
export const webContainerExecutor = new WebContainerExecutor();
