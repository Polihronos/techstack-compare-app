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

    // Replace Svelte internal imports with empty implementations
    compiledCode = compiledCode
      .replace(/import\s+{[^}]*}\s+from\s+['"]svelte\/internal[^'"]*['"];?/g, '')
      .replace(/import\s+{[^}]*}\s+from\s+['"]svelte[^'"]*['"];?/g, '');

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
