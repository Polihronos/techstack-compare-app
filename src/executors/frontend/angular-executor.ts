import { BaseFrontendExecutor } from '../base';
import type { ExecutionOptions } from '../../frameworks/types';

export class AngularExecutor extends BaseFrontendExecutor {
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

    const angularScript = this.createAngularExecutionScript(code);

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${css}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

    // Remove external script references to avoid 404 errors
    html = html.replace(/<script\s+src="[^"]*"[^>]*><\/script>/gi, '');

    // Find </body> and insert Angular script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      html = html.slice(0, bodyEndIndex) + angularScript + '\n' + html.slice(bodyEndIndex);
    }

    return html;
  }

  private executeSimple(code: string): string {
    const angularScript = this.createAngularExecutionScript(code);

    return this.createHTMLDocument({
      bodyContent: `<div id="app"></div>
  ${angularScript}`,
    });
  }

  private createAngularExecutionScript(code: string): string {
    // Base64 encode the TypeScript code
    const codeEncoded = btoa(unescape(encodeURIComponent(code)));

    return `
  <script src="https://unpkg.com/typescript@latest/lib/typescript.js"></script>
  <script>
    (function() {
      try {
        // Decode the TypeScript code
        const tsCode = decodeURIComponent(escape(atob('${codeEncoded}')));

        // Extract template
        const templateMatch = tsCode.match(/template:\\s*\`([^\`]*)\`/s);
        const template = templateMatch ? templateMatch[1] : '<div>No template found</div>';

        // Extract class - find the export class line and capture until the last closing brace
        const classStartIndex = tsCode.indexOf('export class');
        let classBody = '';

        if (classStartIndex !== -1) {
          const afterExport = tsCode.substring(classStartIndex);
          const firstBrace = afterExport.indexOf('{');

          if (firstBrace !== -1) {
            // Find matching closing brace
            let braceCount = 1;
            let i = firstBrace + 1;

            while (i < afterExport.length && braceCount > 0) {
              if (afterExport[i] === '{') braceCount++;
              if (afterExport[i] === '}') braceCount--;
              i++;
            }

            classBody = afterExport.substring(firstBrace + 1, i - 1).trim();
          }
        }

        // Transpile the entire class definition to JavaScript
        const fullClassCode = 'class Component {\\n' + classBody + '\\n}';
        const jsCode = window.ts.transpile(fullClassCode);

        // Evaluate to create the class
        eval(jsCode);

        // Add rendering and event handling to prototype
        Component.prototype.render = function() {
          let html = template;

          // Replace {{ interpolations }}
          const interpolations = html.match(/\\{\\{\\s*([^}]+)\\s*\\}\\}/g);
          if (interpolations) {
            interpolations.forEach(interp => {
              const prop = interp.replace(/\\{\\{\\s*/, '').replace(/\\s*\\}\\}/, '');
              html = html.replace(interp, this[prop] !== undefined ? this[prop] : '');
            });
          }

          document.getElementById('app').innerHTML = html;
        };

        Component.prototype.attachEvents = function() {
          const app = document.getElementById('app');

          // Handle (click) events - find all buttons with (click) attribute
          const elements = app.querySelectorAll('[\\\\(click\\\\)]');

          elements.forEach((el) => {
            const attr = el.getAttribute('(click)');

            if (attr) {
              // Remove () from method name like "increment()" -> "increment"
              const methodName = attr.replace('()', '');

              // Remove old listeners by cloning and replacing
              const newEl = el.cloneNode(true);
              el.parentNode.replaceChild(newEl, el);

              // Add click listener
              newEl.addEventListener('click', () => {
                if (typeof this[methodName] === 'function') {
                  this[methodName].call(this);
                  this.render();
                  this.attachEvents();
                }
              });
            }
          });
        };

        // Create and mount component
        const component = new Component();
        component.render();
        component.attachEvents();

      } catch (error) {
        console.error('Angular execution error:', error);
        document.getElementById('app').innerHTML =
          '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '<br><br>Stack: ' + error.stack + '</div>';
      }
    })();
  </script>`;
  }
}
