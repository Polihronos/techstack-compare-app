import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Extract template from the code
    const templateRegex = new RegExp('template:\\s*`([^`]*)`', 's');
    const templateMatch = code.match(templateRegex);
    const template = templateMatch ? templateMatch[1] : '<div>No template found</div>';

    // Extract component class code (properties and methods)
    // Find the class and extract its body by matching braces
    const classStartMatch = code.match(/export class \w+\s*\{/);
    let classBody = '';

    if (classStartMatch) {
      const startIndex = classStartMatch.index! + classStartMatch[0].length;
      let braceCount = 1;
      let i = startIndex;

      // Find matching closing brace
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        if (code[i] === '}') braceCount--;
        i++;
      }

      // Extract class body (everything between opening and closing braces)
      classBody = code.substring(startIndex, i - 1).trim();
    }

    // Send template and class body as JSON, build script in iframe
    return NextResponse.json({
      template: template,
      classBody: classBody
    });
  } catch (error) {
    console.error('Angular execution error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Execution failed',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
