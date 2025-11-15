import { BaseFrontendExecutor } from '../base';
import type { ExecutionOptions } from '../../frameworks/types';

export class ReactExecutor extends BaseFrontendExecutor {
  async execute(code: string, options: ExecutionOptions): Promise<string> {
    const { mode, files } = options;

    // Advanced mode with separate files
    if (mode === 'advanced' && files?.html && files?.css) {
      return this.executeAdvanced(code, files.html, files.css);
    }

    // Simple mode with inline styles
    return this.executeSimple(code);
  }

  private executeAdvanced(code: string, html: string, css: string): string {
    // Remove external CSS references to avoid 404 errors
    html = html.replace(/<link\s+rel="stylesheet"\s+href="[^"]*"[^>]*>/gi, '');

    // Remove external script references to avoid 404 errors (BEFORE adding our CDN scripts)
    html = html.replace(/<script\s+src="[^"]*"[^>]*><\/script>/gi, '');

    // Find </head> and insert CSS + React dependencies before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const headInjection = `\n  <style>\n${css}\n  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n`;
      html = html.slice(0, headEndIndex) + headInjection + html.slice(headEndIndex);
    }

    // Find </body> and insert script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      const scriptTag = `\n  <script type="text/babel">
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
  </script>\n`;
      html = html.slice(0, bodyEndIndex) + scriptTag + html.slice(bodyEndIndex);
    }

    return html;
  }

  private executeSimple(code: string): string {
    return this.createHTMLDocument({
      bodyContent: `<div id="app"></div>`,
      headScripts: [
        this.createExternalScript('https://unpkg.com/react@18/umd/react.production.min.js', { crossorigin: '' }),
        this.createExternalScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', { crossorigin: '' }),
        this.createExternalScript('https://unpkg.com/@babel/standalone/babel.min.js'),
      ],
      bodyScripts: [
        this.createScriptTag(`
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
        `, 'text/babel'),
      ],
    });
  }
}
