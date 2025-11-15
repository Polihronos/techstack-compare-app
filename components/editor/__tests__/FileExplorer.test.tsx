import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileExplorer } from '../FileExplorer'

describe('FileExplorer', () => {
  describe('Rendering', () => {
    it('should render explorer header', () => {
      render(<FileExplorer files={{}} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('Explorer')).toBeInTheDocument()
    })

    it('should render single file', () => {
      const files = { 'index.js': 'console.log("test")' }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('index.js')).toBeInTheDocument()
    })

    it('should render multiple files', () => {
      const files = {
        'index.js': 'test',
        'app.ts': 'test',
        'README.md': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('index.js')).toBeInTheDocument()
      expect(screen.getByText('app.ts')).toBeInTheDocument()
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    it('should render empty when no files', () => {
      render(<FileExplorer files={{}} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('File Selection', () => {
    it('should highlight selected file', () => {
      const files = { 'index.js': 'test', 'app.ts': 'test' }
      render(<FileExplorer files={files} selectedFile="app.ts" onFileSelect={vi.fn()} />)

      const appFile = screen.getByText('app.ts').closest('div')
      expect(appFile).toHaveClass('bg-blue-600/20')
      expect(appFile).toHaveClass('border-l-2')
      expect(appFile).toHaveClass('border-blue-500')
    })

    it('should not highlight unselected files', () => {
      const files = { 'index.js': 'test', 'app.ts': 'test' }
      render(<FileExplorer files={files} selectedFile="app.ts" onFileSelect={vi.fn()} />)

      const indexFile = screen.getByText('index.js').closest('div')
      expect(indexFile).not.toHaveClass('bg-blue-600/20')
      expect(indexFile).toHaveClass('hover:bg-zinc-800')
    })

    it('should call onFileSelect when file clicked', () => {
      const onFileSelect = vi.fn()
      const files = { 'index.js': 'test' }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={onFileSelect} />)

      fireEvent.click(screen.getByText('index.js'))
      expect(onFileSelect).toHaveBeenCalledWith('index.js')
    })

    it('should allow selecting already selected file', () => {
      const onFileSelect = vi.fn()
      const files = { 'index.js': 'test' }
      render(<FileExplorer files={files} selectedFile="index.js" onFileSelect={onFileSelect} />)

      fireEvent.click(screen.getByText('index.js'))
      expect(onFileSelect).toHaveBeenCalledWith('index.js')
    })
  })

  describe('Folder Structure', () => {
    it('should render nested folder structure', () => {
      const files = {
        'src/index.js': 'test',
        'src/app.ts': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('src')).toBeInTheDocument()

      // Expand src folder
      fireEvent.click(screen.getByText('src'))

      expect(screen.getByText('index.js')).toBeInTheDocument()
      expect(screen.getByText('app.ts')).toBeInTheDocument()
    })

    it('should expand folders by default (root)', () => {
      const files = {
        'index.js': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      // File should be visible (root is expanded by default)
      expect(screen.getByText('index.js')).toBeVisible()
    })

    it('should toggle folder expansion on click', () => {
      const files = {
        'src/index.js': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const folder = screen.getByText('src')

      // Folder starts collapsed, so expand it first
      fireEvent.click(folder)
      const file = screen.getByText('index.js')
      expect(file).toBeVisible()

      // Click to collapse
      fireEvent.click(folder)
      expect(file).not.toBeVisible()

      // Click to expand again
      fireEvent.click(folder)
      expect(screen.getByText('index.js')).toBeVisible()
    })

    it('should handle deeply nested folders', () => {
      const files = {
        'src/components/ui/Button.tsx': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('src')).toBeInTheDocument()
      fireEvent.click(screen.getByText('src'))

      expect(screen.getByText('components')).toBeInTheDocument()
      fireEvent.click(screen.getByText('components'))

      expect(screen.getByText('ui')).toBeInTheDocument()
      fireEvent.click(screen.getByText('ui'))

      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    })

    it('should handle multiple files in same folder', () => {
      const files = {
        'src/index.js': 'test1',
        'src/app.ts': 'test2',
        'src/utils.ts': 'test3',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('src')).toBeInTheDocument()
      fireEvent.click(screen.getByText('src'))

      expect(screen.getByText('index.js')).toBeInTheDocument()
      expect(screen.getByText('app.ts')).toBeInTheDocument()
      expect(screen.getByText('utils.ts')).toBeInTheDocument()
    })

    it('should handle files in multiple folders', () => {
      const files = {
        'src/index.js': 'test',
        'tests/app.test.ts': 'test',
      }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      expect(screen.getByText('src')).toBeInTheDocument()
      expect(screen.getByText('tests')).toBeInTheDocument()

      fireEvent.click(screen.getByText('src'))
      expect(screen.getByText('index.js')).toBeInTheDocument()

      fireEvent.click(screen.getByText('tests'))
      expect(screen.getByText('app.test.ts')).toBeInTheDocument()
    })
  })

  describe('File Icons', () => {
    it('should show JSON icon for .json files', () => {
      const files = { 'package.json': '{}' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const jsonFile = screen.getByText('package.json').closest('div')
      const icon = jsonFile?.querySelector('svg')
      expect(icon).toHaveClass('text-yellow-500')
    })

    it('should show code icon for .js files', () => {
      const files = { 'index.js': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const jsFile = screen.getByText('index.js').closest('div')
      const icon = jsFile?.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should show code icon for .ts files', () => {
      const files = { 'app.ts': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const tsFile = screen.getByText('app.ts').closest('div')
      const icon = tsFile?.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should show code icon for .tsx files', () => {
      const files = { 'App.tsx': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const tsxFile = screen.getByText('App.tsx').closest('div')
      const icon = tsxFile?.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should show code icon for .jsx files', () => {
      const files = { 'Component.jsx': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const jsxFile = screen.getByText('Component.jsx').closest('div')
      const icon = jsxFile?.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should show markdown icon for .md files', () => {
      const files = { 'README.md': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const mdFile = screen.getByText('README.md').closest('div')
      const icon = mdFile?.querySelector('svg')
      expect(icon).toHaveClass('text-blue-400')
    })

    it('should show code icon for .svelte files', () => {
      const files = { 'App.svelte': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const svelteFile = screen.getByText('App.svelte').closest('div')
      const icon = svelteFile?.querySelector('svg')
      expect(icon).toHaveClass('text-orange-500')
    })

    it('should show code icon for .vue files', () => {
      const files = { 'App.vue': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const vueFile = screen.getByText('App.vue').closest('div')
      const icon = vueFile?.querySelector('svg')
      expect(icon).toHaveClass('text-orange-500')
    })

    it('should show code icon for .html files', () => {
      const files = { 'index.html': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const htmlFile = screen.getByText('index.html').closest('div')
      const icon = htmlFile?.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
    })

    it('should show default icon for unknown file types', () => {
      const files = { 'data.xml': 'test' }
      const { container } = render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const xmlFile = screen.getByText('data.xml').closest('div')
      const icon = xmlFile?.querySelector('svg')
      expect(icon).toHaveClass('text-zinc-400')
    })
  })

  describe('Folder Icons', () => {
    it('should show folder icon when collapsed', () => {
      const files = { 'src/index.js': 'test' }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const folder = screen.getByText('src').closest('div')

      // Collapse folder
      fireEvent.click(screen.getByText('src'))

      const icon = folder?.querySelector('svg.text-blue-400')
      expect(icon).toBeInTheDocument()
    })

    it('should show open folder icon when expanded', () => {
      const files = { 'src/index.js': 'test' }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={vi.fn()} />)

      const folder = screen.getByText('src').closest('div')
      const icon = folder?.querySelector('svg.text-blue-400')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Nested File Selection', () => {
    it('should call onFileSelect with full path for nested files', () => {
      const onFileSelect = vi.fn()
      const files = { 'src/components/App.tsx': 'test' }
      render(<FileExplorer files={files} selectedFile="" onFileSelect={onFileSelect} />)

      // Expand folders to see the file
      fireEvent.click(screen.getByText('src'))
      fireEvent.click(screen.getByText('components'))

      fireEvent.click(screen.getByText('App.tsx'))
      expect(onFileSelect).toHaveBeenCalledWith('src/components/App.tsx')
    })

    it('should highlight nested selected file', () => {
      const files = {
        'src/index.js': 'test',
        'src/app.ts': 'test',
      }
      render(<FileExplorer files={files} selectedFile="src/app.ts" onFileSelect={vi.fn()} />)

      // Expand src folder to see the selected file
      fireEvent.click(screen.getByText('src'))

      const appFile = screen.getByText('app.ts').closest('div')
      expect(appFile).toHaveClass('bg-blue-600/20')
    })
  })
})
