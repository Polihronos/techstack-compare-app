export function executeVanillaJS(
  code: string,
  htmlTemplate?: string,
  cssContent?: string
): string {
  // If HTML template is provided (advanced mode), use it
  if (htmlTemplate !== undefined && cssContent !== undefined) {
    // Inject CSS into the HTML template
    let html = htmlTemplate;

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${cssContent}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

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

  // Simple mode - use embedded template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; }
    #app { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
  </script>
</body>
</html>`;
}

export function executeReact(
  code: string,
  htmlTemplate?: string,
  cssContent?: string
): string {
  // If HTML template is provided (advanced mode), use it
  if (htmlTemplate !== undefined && cssContent !== undefined) {
    let html = htmlTemplate;

    // Find </head> and insert CSS + React dependencies before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const headInjection = `\n  <style>\n${cssContent}\n  </style>
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

  // Simple mode - use embedded template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; }
    #app { min-height: 100vh; }
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="app"></div>
  <script type="text/babel">
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
  </script>
</body>
</html>`;
}

export function executeVue(
  code: string,
  htmlTemplate?: string,
  cssContent?: string
): string {
  // If HTML template is provided (advanced mode), use it
  if (htmlTemplate !== undefined && cssContent !== undefined) {
    let html = htmlTemplate;

    // Find </head> and insert CSS + Vue dependencies before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const headInjection = `\n  <style>\n${cssContent}\n  </style>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>\n`;
      html = html.slice(0, headEndIndex) + headInjection + html.slice(headEndIndex);
    }

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

  // Simple mode - use embedded template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; }
    #app { min-height: 100vh; }
  </style>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      ${code}
    } catch (error) {
      document.getElementById('app').innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>';
      console.error(error);
    }
  </script>
</body>
</html>`;
}

export function executeSvelte(
  code: string,
  htmlTemplate?: string,
  cssContent?: string
): string {
  // Use esm.sh which supports .svelte files directly
  const codeEncoded = btoa(unescape(encodeURIComponent(code)));

  // Build the Svelte execution script
  const svelteScript = `
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

  // If HTML template is provided (advanced mode), use it
  if (htmlTemplate !== undefined && cssContent !== undefined) {
    let html = htmlTemplate;

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${cssContent}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

    // Find </body> and insert Svelte script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      html = html.slice(0, bodyEndIndex) + svelteScript + '\n' + html.slice(bodyEndIndex);
    }

    return html;
  }

  // Simple mode - use embedded template
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; }
    #app { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="app"></div>
  ${svelteScript}
</body>
</html>`;

  return html;
}

export async function executeAngular(
  code: string,
  htmlTemplate?: string,
  cssContent?: string
): Promise<string> {
  // Simplified Angular execution - just parse template and create reactive component
  const codeEncoded = btoa(unescape(encodeURIComponent(code)));

  // Build the Angular execution script
  const angularScript = `
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

  // If HTML template is provided (advanced mode), use it
  if (htmlTemplate !== undefined && cssContent !== undefined) {
    let html = htmlTemplate;

    // Find </head> and insert CSS before it
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const cssTag = `\n  <style>\n${cssContent}\n  </style>\n`;
      html = html.slice(0, headEndIndex) + cssTag + html.slice(headEndIndex);
    }

    // Find </body> and insert Angular script before it
    const bodyEndIndex = html.indexOf('</body>');
    if (bodyEndIndex !== -1) {
      html = html.slice(0, bodyEndIndex) + angularScript + '\n' + html.slice(bodyEndIndex);
    }

    return html;
  }

  // Simple mode - use embedded template
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; }
    #app { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="app"></div>
  ${angularScript}
</body>
</html>`;
}
