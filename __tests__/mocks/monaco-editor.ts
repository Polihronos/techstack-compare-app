import { vi } from 'vitest'

/**
 * Mock Monaco Editor for testing
 * Monaco Editor is loaded dynamically and requires a browser environment
 */
export const mockMonacoEditor = {
  editor: {
    create: vi.fn(() => ({
      dispose: vi.fn(),
      getValue: vi.fn(() => ''),
      setValue: vi.fn(),
      getModel: vi.fn(() => null),
      onDidChangeModelContent: vi.fn(() => ({ dispose: vi.fn() })),
      layout: vi.fn(),
      focus: vi.fn(),
      updateOptions: vi.fn(),
    })),
    defineTheme: vi.fn(),
    setTheme: vi.fn(),
  },
  languages: {
    register: vi.fn(),
    setMonarchTokensProvider: vi.fn(),
    setLanguageConfiguration: vi.fn(),
  },
}

// Mock the @monaco-editor/react package
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange, onMount }: any) => {
    // Simulate component behavior
    if (onMount) {
      setTimeout(() => onMount(mockMonacoEditor.editor.create(), mockMonacoEditor), 0)
    }
    return null
  },
  Editor: ({ value, onChange, onMount }: any) => {
    if (onMount) {
      setTimeout(() => onMount(mockMonacoEditor.editor.create(), mockMonacoEditor), 0)
    }
    return null
  },
}))
