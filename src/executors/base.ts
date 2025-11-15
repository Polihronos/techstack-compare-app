/**
 * Base executor interfaces and abstract classes
 */

import type {
  FrameworkExecutor,
  BackendExecutor,
  ExecutionOptions,
  FileSystemTemplate,
} from '../frameworks/types';

/**
 * Abstract base class for frontend framework executors
 */
export abstract class BaseFrontendExecutor implements FrameworkExecutor {
  abstract execute(code: string, options: ExecutionOptions): Promise<string>;

  /**
   * Helper to create a complete HTML document
   */
  protected createHTMLDocument(params: {
    html?: string;
    css?: string;
    bodyContent: string;
    headScripts?: string[];
    bodyScripts?: string[];
  }): string {
    const { html, css, bodyContent, headScripts = [], bodyScripts = [] } = params;

    const styleTag = css ? `<style>${css}</style>` : '';
    const customHTML = html || '<div id="root"></div>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  ${styleTag}
  ${headScripts.join('\n  ')}
</head>
<body>
  ${customHTML}
  ${bodyContent}
  ${bodyScripts.join('\n  ')}
</body>
</html>`;
  }

  /**
   * Helper to create a script tag
   */
  protected createScriptTag(content: string, type: string = 'module'): string {
    return `<script type="${type}">${content}</script>`;
  }

  /**
   * Helper to create a script tag with src
   */
  protected createExternalScript(src: string, attrs: Record<string, string> = {}): string {
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<script src="${src}" ${attrString}></script>`;
  }
}

/**
 * Abstract base class for backend framework executors
 */
export abstract class BaseBackendExecutor implements BackendExecutor {
  abstract execute(
    files: FileSystemTemplate,
    onOutput: (text: string) => void,
    onReady: (url: string) => void
  ): Promise<void>;

  abstract cleanup(): Promise<void>;
}
