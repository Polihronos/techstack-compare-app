import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock next/dynamic to load components synchronously
vi.mock('next/dynamic', () => ({
  default: () => {
    // Return the mocked Monaco editor directly
    const MockMonaco = ({ value, onChange, language, theme, options }: any) => (
      <div data-testid="monaco-editor" data-language={language} data-theme={theme}>
        <textarea
          data-testid="monaco-textarea"
          value={value}
          onChange={(e: any) => onChange?.(e.target.value)}
        />
        <div data-testid="monaco-options">{JSON.stringify(options)}</div>
      </div>
    )
    return MockMonaco
  },
}))

// Mock @monaco-editor/react
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange, language, theme, options }: any) => (
    <div data-testid="monaco-editor" data-language={language} data-theme={theme}>
      <textarea
        data-testid="monaco-textarea"
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
      />
      <div data-testid="monaco-options">{JSON.stringify(options)}</div>
    </div>
  ),
}))

// Mock FileExplorer
vi.mock('../FileExplorer', () => ({
  FileExplorer: vi.fn(({ files, selectedFile, onFileSelect }) => (
    <div data-testid="file-explorer">
      {Object.keys(files).map((filename) => (
        <button
          key={filename}
          data-testid={`file-${filename}`}
          onClick={() => onFileSelect(filename)}
          className={selectedFile === filename ? 'selected' : ''}
        >
          {filename}
        </button>
      ))}
    </div>
  )),
}))

// Import after mocks
import { EditorPanel } from '../EditorPanel'

// Mock FrameworkSelector
vi.mock('../FrameworkSelector', () => ({
  FrameworkSelector: vi.fn(({ mode, frameworks, selected, onSelect }) => (
    <div data-testid={`framework-selector-${mode}`}>
      <select
        data-testid="framework-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        {frameworks.map((fw: any) => (
          <option key={fw.value} value={fw.value}>
            {fw.label}
          </option>
        ))}
      </select>
    </div>
  )),
}))

describe('EditorPanel', () => {
  const mockFrontendFrameworks = [
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue', color: '#42b883' },
    { value: 'svelte', label: 'Svelte', color: '#ff3e00' },
  ]

  const mockBackendFrameworks = [
    { value: 'express', label: 'Express', color: '#000000' },
    { value: 'fastify', label: 'Fastify', color: '#000000' },
  ]

  const defaultProps = {
    mode: 'frontend' as const,
    selectedFramework: 'react' as any,
    onFrameworkChange: vi.fn(),
    selectedBackendFramework: 'express' as any,
    onBackendFrameworkChange: vi.fn(),
    code: 'const App = () => <div>Test</div>',
    onCodeChange: vi.fn(),
    frontendFrameworks: mockFrontendFrameworks,
    backendFrameworks: mockBackendFrameworks,
    frontendViewMode: 'simple' as const,
    onFrontendViewModeChange: vi.fn(),
    frontendFiles: { 'index.js': 'test', 'styles.css': 'body {}' },
    selectedFrontendFile: 'index.js',
    onFrontendFileSelect: vi.fn(),
    backendFiles: { 'server.js': 'express()' },
    selectedBackendFile: 'server.js',
    onBackendFileSelect: vi.fn(),
  }

  describe('Rendering', () => {
    it('should render editor panel with all main elements', () => {
      render(<EditorPanel {...defaultProps} />)

      expect(screen.getByText('Code Editor')).toBeInTheDocument()
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
      expect(screen.getByTestId('file-explorer')).toBeInTheDocument()
    })

    it('should render file explorer in frontend mode', () => {
      render(<EditorPanel {...defaultProps} mode="frontend" />)

      expect(screen.getByTestId('file-explorer')).toBeInTheDocument()
    })

    it('should render file explorer in backend mode', () => {
      render(<EditorPanel {...defaultProps} mode="backend" />)

      expect(screen.getByTestId('file-explorer')).toBeInTheDocument()
    })

    it('should display correct editor title', () => {
      render(<EditorPanel {...defaultProps} />)

      expect(screen.getByText('Code Editor')).toBeInTheDocument()
    })
  })

  describe('Frontend Mode', () => {
    it('should render frontend framework selector', () => {
      render(<EditorPanel {...defaultProps} mode="frontend" />)

      expect(screen.getByTestId('framework-selector-frontend')).toBeInTheDocument()
    })

    it('should render view mode toggle in frontend mode', () => {
      render(<EditorPanel {...defaultProps} mode="frontend" />)

      expect(screen.getByText('Simple')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
    })

    it('should highlight simple mode when selected', () => {
      render(<EditorPanel {...defaultProps} frontendViewMode="simple" />)

      const simpleButton = screen.getByText('Simple').closest('button')
      expect(simpleButton).toHaveClass('bg-zinc-700', 'text-white')
    })

    it('should highlight advanced mode when selected', () => {
      render(<EditorPanel {...defaultProps} frontendViewMode="advanced" />)

      const advancedButton = screen.getByText('Advanced').closest('button')
      expect(advancedButton).toHaveClass('bg-zinc-700', 'text-white')
    })

    it('should call onFrontendViewModeChange when simple clicked', () => {
      const onFrontendViewModeChange = vi.fn()
      render(
        <EditorPanel
          {...defaultProps}
          frontendViewMode="advanced"
          onFrontendViewModeChange={onFrontendViewModeChange}
        />
      )

      fireEvent.click(screen.getByText('Simple'))
      expect(onFrontendViewModeChange).toHaveBeenCalledWith('simple')
    })

    it('should call onFrontendViewModeChange when advanced clicked', () => {
      const onFrontendViewModeChange = vi.fn()
      render(
        <EditorPanel
          {...defaultProps}
          frontendViewMode="simple"
          onFrontendViewModeChange={onFrontendViewModeChange}
        />
      )

      fireEvent.click(screen.getByText('Advanced'))
      expect(onFrontendViewModeChange).toHaveBeenCalledWith('advanced')
    })

    it('should use frontend files for file explorer', () => {
      render(<EditorPanel {...defaultProps} mode="frontend" />)

      expect(screen.getByTestId('file-index.js')).toBeInTheDocument()
      expect(screen.getByTestId('file-styles.css')).toBeInTheDocument()
    })

    it('should use selected frontend file', () => {
      render(<EditorPanel {...defaultProps} selectedFrontendFile="styles.css" />)

      const fileButton = screen.getByTestId('file-styles.css')
      expect(fileButton).toHaveClass('selected')
    })

    it('should call onFrontendFileSelect when file clicked', () => {
      const onFrontendFileSelect = vi.fn()
      render(<EditorPanel {...defaultProps} onFrontendFileSelect={onFrontendFileSelect} />)

      fireEvent.click(screen.getByTestId('file-styles.css'))
      expect(onFrontendFileSelect).toHaveBeenCalledWith('styles.css')
    })
  })

  describe('Backend Mode', () => {
    it('should render backend framework selector', () => {
      render(<EditorPanel {...defaultProps} mode="backend" />)

      expect(screen.getByTestId('framework-selector-backend')).toBeInTheDocument()
    })

    it('should not render view mode toggle in backend mode', () => {
      render(<EditorPanel {...defaultProps} mode="backend" />)

      expect(screen.queryByText('Simple')).not.toBeInTheDocument()
      expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
    })

    it('should use backend files for file explorer', () => {
      render(<EditorPanel {...defaultProps} mode="backend" />)

      expect(screen.getByTestId('file-server.js')).toBeInTheDocument()
    })

    it('should use selected backend file', () => {
      render(<EditorPanel {...defaultProps} mode="backend" selectedBackendFile="server.js" />)

      const fileButton = screen.getByTestId('file-server.js')
      expect(fileButton).toHaveClass('selected')
    })

    it('should call onBackendFileSelect when file clicked', () => {
      const onBackendFileSelect = vi.fn()
      render(<EditorPanel {...defaultProps} mode="backend" onBackendFileSelect={onBackendFileSelect} />)

      fireEvent.click(screen.getByTestId('file-server.js'))
      expect(onBackendFileSelect).toHaveBeenCalledWith('server.js')
    })
  })

  describe('Monaco Editor', () => {
    it('should render Monaco editor with correct value', () => {
      render(<EditorPanel {...defaultProps} code="test code" />)

      const textarea = screen.getByTestId('monaco-textarea')
      expect(textarea).toHaveValue('test code')
    })

    it('should use vs-dark theme', () => {
      render(<EditorPanel {...defaultProps} />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-theme', 'vs-dark')
    })

    it('should detect javascript language for .js files', () => {
      render(<EditorPanel {...defaultProps} selectedFrontendFile="index.js" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'javascript')
    })

    it('should detect typescript language for .ts files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'app.ts': 'const x: number = 1' }}
          selectedFrontendFile="app.ts"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'typescript')
    })

    it('should detect typescript language for .tsx files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'App.tsx': 'const App = () => <div />' }}
          selectedFrontendFile="App.tsx"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'typescript')
    })

    it('should detect html language for .html files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'index.html': '<div></div>' }}
          selectedFrontendFile="index.html"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'html')
    })

    it('should detect css language for .css files', () => {
      render(<EditorPanel {...defaultProps} selectedFrontendFile="styles.css" />)

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'css')
    })

    it('should detect json language for .json files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'package.json': '{}' }}
          selectedFrontendFile="package.json"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'json')
    })

    it('should detect markdown language for .md files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'README.md': '# Title' }}
          selectedFrontendFile="README.md"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'markdown')
    })

    it('should detect html language for .svelte files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'App.svelte': '<div></div>' }}
          selectedFrontendFile="App.svelte"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'html')
    })

    it('should detect html language for .vue files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'App.vue': '<template></template>' }}
          selectedFrontendFile="App.vue"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'html')
    })

    it('should default to javascript for unknown extensions', () => {
      render(
        <EditorPanel
          {...defaultProps}
          frontendFiles={{ 'unknown.xyz': 'test' }}
          selectedFrontendFile="unknown.xyz"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'javascript')
    })

    it('should call onCodeChange when editor value changes', () => {
      const onCodeChange = vi.fn()
      render(<EditorPanel {...defaultProps} onCodeChange={onCodeChange} />)

      const textarea = screen.getByTestId('monaco-textarea')
      fireEvent.change(textarea, { target: { value: 'new code' } })

      expect(onCodeChange).toHaveBeenCalledWith('new code')
    })

    it('should handle empty code change', () => {
      const onCodeChange = vi.fn()
      render(<EditorPanel {...defaultProps} onCodeChange={onCodeChange} />)

      const textarea = screen.getByTestId('monaco-textarea')
      fireEvent.change(textarea, { target: { value: '' } })

      expect(onCodeChange).toHaveBeenCalledWith('')
    })

    it('should pass correct editor options', () => {
      render(<EditorPanel {...defaultProps} />)

      const optionsDiv = screen.getByTestId('monaco-options')
      const options = JSON.parse(optionsDiv.textContent || '{}')

      expect(options).toEqual({
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      })
    })
  })

  describe('Framework Selection', () => {
    it('should call onFrameworkChange in frontend mode', () => {
      const onFrameworkChange = vi.fn()
      render(<EditorPanel {...defaultProps} mode="frontend" onFrameworkChange={onFrameworkChange} />)

      const select = screen.getByTestId('framework-select')
      fireEvent.change(select, { target: { value: 'vue' } })

      expect(onFrameworkChange).toHaveBeenCalledWith('vue')
    })

    it('should call onBackendFrameworkChange in backend mode', () => {
      const onBackendFrameworkChange = vi.fn()
      render(
        <EditorPanel {...defaultProps} mode="backend" onBackendFrameworkChange={onBackendFrameworkChange} />
      )

      const select = screen.getByTestId('framework-select')
      fireEvent.change(select, { target: { value: 'fastify' } })

      expect(onBackendFrameworkChange).toHaveBeenCalledWith('fastify')
    })
  })

  describe('File Explorer', () => {
    it('should render file explorer with frontend files', () => {
      const frontendFiles = {
        'index.js': 'code1',
        'App.jsx': 'code2',
        'styles.css': 'code3',
      }
      render(<EditorPanel {...defaultProps} frontendFiles={frontendFiles} />)

      expect(screen.getByTestId('file-index.js')).toBeInTheDocument()
      expect(screen.getByTestId('file-App.jsx')).toBeInTheDocument()
      expect(screen.getByTestId('file-styles.css')).toBeInTheDocument()
    })

    it('should render file explorer with backend files', () => {
      const backendFiles = {
        'server.js': 'code1',
        'routes.js': 'code2',
      }
      render(<EditorPanel {...defaultProps} mode="backend" backendFiles={backendFiles} />)

      expect(screen.getByTestId('file-server.js')).toBeInTheDocument()
      expect(screen.getByTestId('file-routes.js')).toBeInTheDocument()
    })
  })

  describe('Language Detection', () => {
    it('should use correct language for backend .js files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          mode="backend"
          backendFiles={{ 'server.js': 'test' }}
          selectedBackendFile="server.js"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'javascript')
    })

    it('should use correct language for backend .ts files', () => {
      render(
        <EditorPanel
          {...defaultProps}
          mode="backend"
          backendFiles={{ 'server.ts': 'test' }}
          selectedBackendFile="server.ts"
        />
      )

      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'typescript')
    })
  })
})
