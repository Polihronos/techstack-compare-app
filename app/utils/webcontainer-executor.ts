import { WebContainer } from '@webcontainer/api';
import type { FileSystemTree } from '@webcontainer/api';

export interface ExecutionResult {
  url?: string;
  error?: string;
}

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'error';
  data: string;
}

let webcontainerInstance: WebContainer | null = null;
let currentProcess: any = null; // Track the running server process

// Boot WebContainer (only once)
export async function bootWebContainer(): Promise<WebContainer> {
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
function createFileSystemTree(files: Record<string, string>): FileSystemTree {
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

// Execute backend code
export async function executeBackend(
  files: Record<string, string>,
  onOutput?: (output: TerminalOutput) => void
): Promise<ExecutionResult> {
  try {
    console.log('[WebContainer] Execute backend called with files:', Object.keys(files));
    const webcontainer = await bootWebContainer();

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
    const fileTree = createFileSystemTree(files);
    await webcontainer.mount(fileTree);
    console.log('[WebContainer] Files mounted');

    // Install dependencies
    console.log('[WebContainer] Installing dependencies...');
    onOutput?.({ type: 'stdout', data: '📦 Installing dependencies...\n' });

    const installProcess = await webcontainer.spawn('npm', ['install']);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          onOutput?.({ type: 'stdout', data });
        }
      })
    );

    const installExitCode = await installProcess.exit;
    console.log('[WebContainer] npm install exit code:', installExitCode);
    if (installExitCode !== 0) {
      console.error('[WebContainer] npm install failed');
      return {
        error: 'Failed to install dependencies'
      };
    }

    // Determine which command to run
    const packageJson = JSON.parse(files['package.json']);
    const startCommand = packageJson.scripts?.dev || packageJson.scripts?.start;
    console.log('[WebContainer] Start command:', startCommand || 'node server.js (direct)');

    if (!startCommand) {
      // No script defined, try to run server.js directly
      console.log('[WebContainer] Starting server with node server.js...');
      onOutput?.({ type: 'stdout', data: '\n🚀 Starting server...\n' });

      const serverProcess = await webcontainer.spawn('node', ['server.js']);
      currentProcess = serverProcess; // Store the process reference

      serverProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            onOutput?.({ type: 'stdout', data });
          }
        })
      );

      // Wait for server-ready event
      console.log('[WebContainer] Waiting for server-ready event...');
      return new Promise((resolve) => {
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
          onOutput?.({ type: 'stdout', data: `\n✅ Server ready at ${url}\n` });
          cleanup();
          resolve({ url });
        };

        unsubscribe = webcontainer.on('server-ready', handleServerReady);

        // Timeout after 30 seconds
        timeoutId = setTimeout(() => {
          console.error('[WebContainer] Server startup timeout (30s)');
          cleanup();
          resolve({
            error: 'Server startup timeout - server may not have started listening on a port'
          });
        }, 30000);
      });
    } else {
      // Run the dev/start script
      console.log('[WebContainer] Starting server with npm script...');
      onOutput?.({ type: 'stdout', data: '\n🚀 Starting server...\n' });

      const startProcess = await webcontainer.spawn('npm', ['run', startCommand.split(' ')[0]]);
      currentProcess = startProcess; // Store the process reference

      startProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            onOutput?.({ type: 'stdout', data });
          }
        })
      );

      // Wait for server-ready event
      console.log('[WebContainer] Waiting for server-ready event...');
      return new Promise((resolve) => {
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
          onOutput?.({ type: 'stdout', data: `\n✅ Server ready at ${url}\n` });
          cleanup();
          resolve({ url });
        };

        unsubscribe = webcontainer.on('server-ready', handleServerReady);

        // Timeout after 30 seconds
        timeoutId = setTimeout(() => {
          console.error('[WebContainer] Server startup timeout (30s)');
          cleanup();
          resolve({
            error: 'Server startup timeout'
          });
        }, 30000);
      });
    }
  } catch (error) {
    console.error('[WebContainer] Execution error:', error);
    return {
      error: error instanceof Error ? error.message : 'Execution failed'
    };
  }
}

// Stop running processes
export async function stopExecution(): Promise<void> {
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
export function getWebContainerInstance(): WebContainer | null {
  return webcontainerInstance;
}
