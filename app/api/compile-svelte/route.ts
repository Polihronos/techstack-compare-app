import { NextRequest, NextResponse } from 'next/server';
import { compile } from 'svelte/compiler';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Compile the Svelte component with specific options to avoid imports
    const result = compile(code, {
      generate: 'client',
      dev: false, // Disable dev mode to reduce dependencies
      css: 'injected',
      discloseVersion: false, // Disable version disclosure to avoid imports
    });

    // Get the compiled code
    let compiledCode = result.js.code;

    // Replace ALL Svelte imports (named, namespace, and side-effect imports)
    compiledCode = compiledCode
      // Remove named imports: import { ... } from 'svelte...'
      .replace(/import\s+{[^}]*}\s+from\s+['"]svelte[^'"]*['"];?\n?/g, '')
      // Remove namespace imports: import * as $ from 'svelte...' ($ is not \w)
      .replace(/import\s+\*\s+as\s+[$\w]+\s+from\s+['"]svelte[^'"]*['"];?\n?/g, '')
      // Remove default imports: import $ from 'svelte...'
      .replace(/import\s+[$\w]+\s+from\s+['"]svelte[^'"]*['"];?\n?/g, '')
      // Remove side-effect imports: import 'svelte...'
      .replace(/import\s+['"]svelte[^'"]*['"];?\n?/g, '');

    // Return the compiled JavaScript
    return NextResponse.json({
      compiledJs: compiledCode,
    });
  } catch (error) {
    console.error('Svelte compilation error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Compilation failed',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
