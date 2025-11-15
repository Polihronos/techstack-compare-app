import { describe, it, expect, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('/api/compile-angular', () => {
  const createMockRequest = (body: any): NextRequest => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest
  }

  describe('POST', () => {
    it('should extract template and class body from Angular component', async () => {
      const code = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<div>Hello Angular</div>\`
})
export class AppComponent {}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('template')
      expect(data).toHaveProperty('classBody')
      expect(data.template).toBe('<div>Hello Angular</div>')
      expect(data.classBody).toBe('')
    })

    it('should return 400 when code is missing', async () => {
      const request = createMockRequest({})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('No code provided')
    })

    it('should return 400 when code is null', async () => {
      const request = createMockRequest({ code: null })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
    })

    it('should return 400 when code is empty string', async () => {
      const request = createMockRequest({ code: '' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
    })

    it('should extract multiline template', async () => {
      const code = `@Component({
  template: \`
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  \`
})
export class AppComponent {}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toContain('<h1>Title</h1>')
      expect(data.template).toContain('<p>Content</p>')
    })

    it('should extract class body with properties', async () => {
      const code = `@Component({
  template: \`<div>{{ message }}</div>\`
})
export class AppComponent {
  message = 'Hello World';
  count = 0;
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.classBody).toContain("message = 'Hello World'")
      expect(data.classBody).toContain('count = 0')
    })

    it('should extract class body with methods', async () => {
      const code = `@Component({
  template: \`<button (click)="increment()">Click</button>\`
})
export class AppComponent {
  count = 0;

  increment() {
    this.count++;
  }
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.classBody).toContain('increment()')
      expect(data.classBody).toContain('this.count++')
    })

    it('should handle component without class body', async () => {
      const code = `@Component({
  template: \`<div>Simple</div>\`
})
export class AppComponent {}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<div>Simple</div>')
      expect(data.classBody).toBe('')
    })

    it('should provide fallback template when template not found', async () => {
      const code = `export class AppComponent {
  message = 'Hello';
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<div>No template found</div>')
    })

    it('should handle nested braces in class body', async () => {
      const code = `@Component({
  template: \`<div>Test</div>\`
})
export class AppComponent {
  data = { name: 'Test', value: 123 };

  getData() {
    return { result: true };
  }
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.classBody).toContain('{ name: \'Test\', value: 123 }')
      expect(data.classBody).toContain('{ result: true }')
    })

    it('should handle interpolation in template', async () => {
      const code = `@Component({
  template: \`<div>{{ title }}</div>\`
})
export class AppComponent {
  title = 'My Title';
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<div>{{ title }}</div>')
    })

    it('should handle event bindings in template', async () => {
      const code = `@Component({
  template: \`<button (click)="handleClick()">Click</button>\`
})
export class AppComponent {
  handleClick() {
    console.log('Clicked');
  }
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<button (click)="handleClick()">Click</button>')
    })

    it('should handle property bindings in template', async () => {
      const code = `@Component({
  template: \`<img [src]="imageUrl" />\`
})
export class AppComponent {
  imageUrl = 'https://example.com/image.jpg';
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<img [src]="imageUrl" />')
    })

    it('should handle complex component with lifecycle hooks', async () => {
      const code = `@Component({
  template: \`
    <div>
      <h1>{{ title }}</h1>
      <button (click)="increment()">{{ count }}</button>
    </div>
  \`
})
export class AppComponent {
  title = 'Counter';
  count = 0;

  increment() {
    this.count++;
  }

  ngOnInit() {
    console.log('Initialized');
  }
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toContain('<h1>{{ title }}</h1>')
      expect(data.classBody).toContain('increment()')
      expect(data.classBody).toContain('ngOnInit()')
    })

    it('should handle component with constructor', async () => {
      const code = `@Component({
  template: \`<div>Test</div>\`
})
export class AppComponent {
  message: string;

  constructor() {
    this.message = 'Hello';
  }
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.classBody).toContain('constructor()')
      expect(data.classBody).toContain("this.message = 'Hello'")
    })

    it('should trim class body whitespace', async () => {
      const code = `@Component({
  template: \`<div>Test</div>\`
})
export class AppComponent {
  value = 123;
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Class body should be trimmed
      expect(data.classBody).toBe('value = 123;')
    })

    it('should handle component with different class names', async () => {
      const code = `@Component({
  template: \`<div>Test</div>\`
})
export class MyCustomComponent {
  data = 'test';
}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.classBody).toContain('data = \'test\'')
    })

    it('should return 500 and error details on processing failure', async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error('Processing failed')),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Processing failed')
      expect(data).toHaveProperty('details')
    })

    it('should handle JSON parsing errors gracefully', async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
    })

    it('should handle template with special characters', async () => {
      const code = `@Component({
  template: \`<div>"Quoted" & <special> characters</div>\`
})
export class AppComponent {}`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.template).toBe('<div>"Quoted" & <special> characters</div>')
    })
  })
})
