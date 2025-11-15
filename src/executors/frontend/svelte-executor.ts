import { BaseFrontendExecutor } from '../base';
import type { ExecutionOptions } from '../../frameworks/types';

export class SvelteExecutor extends BaseFrontendExecutor {
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

    const svelteScript = this.createSvelteExecutionScript(code);

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${css}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

    // Remove external script references to avoid 404 errors
    html = html.replace(/<script\s+src="[^"]*"[^>]*><\/script>/gi, '');

    // Find </body> and insert Svelte script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      html = html.slice(0, bodyEndIndex) + svelteScript + '\n' + html.slice(bodyEndIndex);
    }

    return html;
  }

  private executeSimple(code: string): string {
    const svelteScript = this.createSvelteExecutionScript(code);

    return this.createHTMLDocument({
      bodyContent: `<div id="app"></div>
  ${svelteScript}`,
    });
  }

  private createSvelteExecutionScript(code: string): string {
    // Base64 encode the Svelte component code
    const codeEncoded = btoa(unescape(encodeURIComponent(code)));

    return `
  <script type="importmap">
  {
    "imports": {
      "svelte": "https://esm.sh/svelte@5",
      "svelte/": "https://esm.sh/svelte@5/"
    }
  }
  </script>

  <script type="module">
    try {
      // Decode the source code
      const source = decodeURIComponent(escape(atob('${codeEncoded}')));

      // Create a data URL for the Svelte file
      const dataUrl = 'data:text/javascript;charset=utf-8,' +
        encodeURIComponent(\`import { mount } from 'svelte';

// Svelte component source
\${source}

// Auto-mount
mount(Component, { target: document.getElementById('app') });
\`);

      // Use esm.sh to compile and execute
      const esmUrl = 'https://esm.sh/build?alias=svelte:svelte@5&deps=svelte@5';

      // Create blob with component code
      const blob = new Blob([source], { type: 'text/plain' });
      const blobUrl = URL.createObjectURL(blob);

      // Import using esm.sh
      const componentUrl = \`https://esm.sh/svelte@5/compiler\`;

      import(componentUrl).then(compiler => {
        const compiled = compiler.compile(source, {
          generate: 'client',
          dev: false,
          css: 'injected'
        });

        // Create a blob URL for the compiled component code
        const componentBlob = new Blob([compiled.js.code], { type: 'application/javascript' });
        const componentBlobUrl = URL.createObjectURL(componentBlob);

        // Import the compiled component and mount it
        import(componentBlobUrl).then(module => {
          // The default export is the component function
          const ComponentFunc = module.default;

          // Import mount from svelte and use it
          import('svelte').then(svelte => {
            svelte.mount(ComponentFunc, {
              target: document.getElementById('app')
            });
            URL.revokeObjectURL(componentBlobUrl);
          }).catch(err => {
            document.getElementById('app').innerHTML =
              '<div style="color: red; padding: 20px; font-family: monospace;">Mount Error: ' + err.message + '</div>';
            console.error(err);
            URL.revokeObjectURL(componentBlobUrl);
          });
        }).catch(err => {
          document.getElementById('app').innerHTML =
            '<div style="color: red; padding: 20px; font-family: monospace;">Component Load Error: ' + err.message + '</div>';
          console.error(err);
          URL.revokeObjectURL(componentBlobUrl);
        });
      }).catch(error => {
        document.getElementById('app').innerHTML =
          '<div style="color: red; padding: 20px; font-family: monospace;">Compilation Error: ' + error.message + '</div>';
        console.error(error);
      });
    } catch (error) {
      document.getElementById('app').innerHTML =
        '<div style="color: red; padding: 20px; font-family: monospace;">Setup Error: ' + error.message + '</div>';
      console.error(error);
    }
  </script>`;
  }
}
