import { BaseFrontendExecutor } from '../base';
import type { ExecutionOptions } from '../../frameworks/types';

export class VanillaExecutor extends BaseFrontendExecutor {
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

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${css}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

    // Remove external script references to avoid 404 errors
    html = html.replace(/<script\s+src="[^"]*"[^>]*><\/script>/gi, '');

    // Find </body> and insert script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      const scriptTag = `\n  <script>
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
      bodyScripts: [
        this.createScriptTag(`
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
        `, 'text/javascript'),
      ],
    });
  }
}
