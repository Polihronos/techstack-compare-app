/**
 * Full-Stack Executor
 * Runs backend and frontend together, injecting backend URL into frontend code
 */

import { webContainerExecutor } from '../backend/webcontainer-executor';
import type { FullStackTemplate } from '@/src/frameworks/fullstack/types';
import type { FileSystemTemplate } from '@/src/frameworks/types';

export interface FullStackExecutionCallbacks {
  onBackendOutput: (text: string) => void;
  onBackendReady: (url: string) => void;
  onFrontendReady: (url: string) => void; // Changed: now receives URL instead of HTML
  onError: (error: string) => void;
}

/**
 * Full-Stack Executor Class
 * Coordinates backend and frontend execution
 */
export class FullStackExecutor {
  private backendUrl: string = '';
  private isBackendRunning: boolean = false;
  private backendReadyResolver?: (url: string) => void;

  /**
   * Execute a full-stack template
   *
   * Steps:
   * 1. Start backend server in WebContainer
   * 2. Wait for backend to be ready and get URL
   * 3. Inject backend URL into frontend code
   * 4. Return frontend HTML ready for iframe
   */
  async execute(
    template: FullStackTemplate,
    callbacks: FullStackExecutionCallbacks
  ): Promise<void> {
    try {
      callbacks.onBackendOutput('🚀 Starting full-stack application...\n\n');

      // Step 1: Prepare frontend HTML first
      callbacks.onBackendOutput('🎨 Step 1/2: Preparing frontend...\n');
      const frontendHtml = this.prepareFrontend(template.files.frontend);
      callbacks.onBackendOutput('✅ Frontend HTML generated\n\n');

      // Step 2: Start backend server with frontend HTML
      callbacks.onBackendOutput('📦 Step 2/2: Starting backend server...\n');

      // Create a promise that resolves when backend is ready
      const backendReadyPromise = new Promise<string>((resolve) => {
        this.backendReadyResolver = resolve;
      });

      // Start backend (passes frontend HTML to be served)
      await this.startBackend(template.files.backend, callbacks, frontendHtml);

      // Wait for backend to be ready and get the URL
      callbacks.onBackendOutput('⏳ Waiting for backend to be ready...\n');
      const backendUrl = await backendReadyPromise;
      callbacks.onBackendOutput(`✅ Backend ready at ${backendUrl}\n\n`);

      // Signal that frontend is ready (iframe should navigate to backend URL)
      callbacks.onFrontendReady(backendUrl);

      callbacks.onBackendOutput('\n✅ Full-stack application ready!\n');
      callbacks.onBackendOutput(`🌐 Frontend: ${backendUrl}\n`);
      callbacks.onBackendOutput(`🔗 Backend API: ${backendUrl}/api\n`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      callbacks.onError(errorMessage);
      callbacks.onBackendOutput(`\n❌ Error: ${errorMessage}\n`);
      throw error;
    }
  }

  /**
   * Start backend server in WebContainer
   */
  private async startBackend(
    backendFiles: Record<string, string>,
    callbacks: FullStackExecutionCallbacks,
    frontendHtml: string
  ): Promise<void> {
    // Convert flat file structure to nested FileSystemTemplate
    const fileSystemTree: FileSystemTemplate = {};

    for (const [path, content] of Object.entries(backendFiles)) {
      fileSystemTree[path] = content;
    }

    // Add the frontend HTML as a file that the backend can serve
    fileSystemTree['public/index.html'] = frontendHtml;

    // Start backend using WebContainer executor
    await webContainerExecutor.execute(
      fileSystemTree,
      (output) => {
        callbacks.onBackendOutput(output);
      },
      (url) => {
        this.backendUrl = url;
        this.isBackendRunning = true;
        callbacks.onBackendReady(url);

        // Resolve the promise to signal backend is ready
        if (this.backendReadyResolver) {
          this.backendReadyResolver(url);
        }
      }
    );
  }

  /**
   * Prepare frontend code by injecting backend URL
   * and creating a complete HTML document
   *
   * NOTE: Frontend is served from the SAME origin as backend (no CORS issues)
   * The backend URL placeholder is replaced with empty string since it's same-origin
   */
  private prepareFrontend(frontendFiles: Record<string, string>): string {
    // Get frontend files
    const jsCode = frontendFiles['App.jsx'] || frontendFiles['App.js'] || '';
    const htmlTemplate = frontendFiles['index.html'] || '';
    const cssCode = frontendFiles['styles.css'] || '';

    // Replace __BACKEND_URL__ with empty string since frontend will be served
    // from the same origin as the backend (no CORS issues)
    const processedJsCode = jsCode.replace(/__BACKEND_URL__/g, '');

    // Create complete HTML document
    const html = this.createHtmlDocument(htmlTemplate, processedJsCode, cssCode);

    return html;
  }

  /**
   * Create a complete HTML document with all dependencies
   */
  private createHtmlDocument(
    htmlTemplate: string,
    jsCode: string,
    cssCode: string
  ): string {
    // Default HTML template if none provided
    const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full-Stack App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

    const baseHtml = htmlTemplate || defaultHtml;

    // Inject React CDN (for React templates)
    const withReact = baseHtml.replace(
      '</head>',
      `  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>`
    );

    // Inject CSS
    const withCss = cssCode
      ? withReact.replace('</head>', `  <style>${cssCode}</style>\n</head>`)
      : withReact;

    // Inject JavaScript code
    const withJs = withCss.replace(
      '</body>',
      `  <script type="text/babel">${jsCode}</script>\n</body>`
    );

    return withJs;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.isBackendRunning) {
      await webContainerExecutor.cleanup();
      this.isBackendRunning = false;
      this.backendUrl = '';
    }
  }

  /**
   * Get current backend URL
   */
  getBackendUrl(): string {
    return this.backendUrl;
  }

  /**
   * Check if backend is running
   */
  isRunning(): boolean {
    return this.isBackendRunning;
  }
}

// Singleton instance
export const fullStackExecutor = new FullStackExecutor();
