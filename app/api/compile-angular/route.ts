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
    const classRegex = new RegExp('export class \\w+\\s*\\{([\\s\\S]*?)\\}\\s*$', 'm');
    const classMatch = code.match(classRegex);
    const classBody = classMatch ? classMatch[1].trim() : '';

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
