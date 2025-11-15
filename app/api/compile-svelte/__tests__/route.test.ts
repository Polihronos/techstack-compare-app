import { describe, it, expect, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('/api/compile-svelte', () => {
  const createMockRequest = (body: any): NextRequest => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest
  }

  describe('POST', () => {
    it('should compile valid Svelte code', async () => {
      const code = `<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('compiledJs')
      expect(typeof data.compiledJs).toBe('string')
      expect(data.compiledJs.length).toBeGreaterThan(0)
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

    it('should compile Svelte component with script tag', async () => {
      const code = `<script>
  let name = "World";
</script>

<h1>Hello {name}!</h1>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
    })

    it('should compile Svelte component without script tag', async () => {
      const code = `<div>Simple component</div>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
    })

    it('should compile Svelte component with style tag', async () => {
      const code = `<style>
  button { background: blue; }
</style>

<button>Click me</button>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
    })

    it('should compile Svelte component with reactive statements', async () => {
      const code = `<script>
  let count = 0;
  $: doubled = count * 2;
</script>

<p>{doubled}</p>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
    })

    it('should strip Svelte internal imports from compiled code', async () => {
      const code = `<script>
  let value = 5;
</script>

<div>{value}</div>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      // Compiled code should not have svelte/internal imports
      expect(data.compiledJs).not.toMatch(/from\s+['"]svelte\/internal/)
    })

    it('should strip svelte imports from compiled code', async () => {
      const code = `<div>Test</div>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      // Compiled code should not have svelte imports
      expect(data.compiledJs).not.toMatch(/from\s+['"]svelte/)
    })

    it('should return 500 for invalid Svelte syntax', async () => {
      const code = `<script>
  let unclosed = "string
</script>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
      expect(data.error).toBeDefined()
    })

    it('should include error details on compilation failure', async () => {
      const code = `<script>
  // Invalid syntax
  let x = ;
</script>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
      expect(typeof data.error).toBe('string')
    })

    it('should compile complex Svelte component', async () => {
      const code = `<script>
  export let name = "User";
  let count = 0;

  function increment() {
    count += 1;
  }

  $: message = \`Hello \${name}, count is \${count}\`;
</script>

<div>
  <h1>{message}</h1>
  <button on:click={increment}>
    Increment
  </button>
</div>

<style>
  h1 {
    color: blue;
  }
</style>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
      expect(data.compiledJs.length).toBeGreaterThan(100)
    })

    it('should use client generation mode', async () => {
      const code = `<div>Test</div>`

      const request = createMockRequest({ code })
      const response = await POST(request)

      // Should compile successfully (client mode is valid)
      expect(response.status).toBe(200)
    })

    it('should use injected CSS mode', async () => {
      const code = `<style>
  div { color: red; }
</style>
<div>Styled</div>`

      const request = createMockRequest({ code })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.compiledJs).toBeDefined()
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
  })
})
