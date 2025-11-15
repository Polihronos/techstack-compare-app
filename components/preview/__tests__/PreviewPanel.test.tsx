import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PreviewPanel } from '../PreviewPanel'
import { createRef } from 'react'

// Mock next/dynamic for Terminal
vi.mock('next/dynamic', () => ({
  default: (fn: any) => {
    // Return a simple mock component
    return () => <div data-testid="terminal">Terminal</div>
  },
}))

// Mock BrowserChrome
vi.mock('../BrowserChrome', () => ({
  BrowserChrome: ({ url, isRefreshing, onRefresh }: any) => (
    <div data-testid="browser-chrome">
      <div data-testid="browser-url">{url}</div>
      <div data-testid="browser-refreshing">{String(isRefreshing)}</div>
      <button data-testid="browser-refresh-btn" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  ),
}))

// Mock Resizable components
vi.mock('@/components/ui/resizable', () => ({
  ResizablePanelGroup: ({ children, direction }: any) => (
    <div data-testid="resizable-panel-group" data-direction={direction}>
      {children}
    </div>
  ),
  ResizablePanel: ({ children, defaultSize }: any) => (
    <div data-testid="resizable-panel" data-size={defaultSize}>
      {children}
    </div>
  ),
  ResizableHandle: ({ withHandle }: any) => <div data-testid="resizable-handle" />,
}))

describe('PreviewPanel', () => {
  const defaultProps = {
    mode: 'frontend' as const,
    selectedFramework: 'react' as any,
    error: '',
    isRunning: false,
    autoRun: true,
    onToggleAutoRun: vi.fn(),
    onRefresh: vi.fn(),
    iframeRef: createRef<HTMLIFrameElement>(),
    serverUrl: '',
  }

  describe('Frontend Mode', () => {
    it('should render preview header with title', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Live Preview')).toBeInTheDocument()
    })

    it('should render auto-run toggle button', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Auto-run ON')).toBeInTheDocument()
    })

    it('should show "Auto-run ON" when enabled', () => {
      render(<PreviewPanel {...defaultProps} autoRun={true} />)

      expect(screen.getByText('Auto-run ON')).toBeInTheDocument()
    })

    it('should show "Auto-run OFF" when disabled', () => {
      render(<PreviewPanel {...defaultProps} autoRun={false} />)

      expect(screen.getByText('Auto-run OFF')).toBeInTheDocument()
    })

    it('should call onToggleAutoRun when button clicked', () => {
      const onToggleAutoRun = vi.fn()
      render(<PreviewPanel {...defaultProps} onToggleAutoRun={onToggleAutoRun} />)

      fireEvent.click(screen.getByText('Auto-run ON'))
      expect(onToggleAutoRun).toHaveBeenCalled()
    })

    it('should apply green background when auto-run is on', () => {
      render(<PreviewPanel {...defaultProps} autoRun={true} />)

      const button = screen.getByText('Auto-run ON').closest('button')
      expect(button).toHaveClass('bg-green-600')
    })

    it('should apply default styling when auto-run is off', () => {
      render(<PreviewPanel {...defaultProps} autoRun={false} />)

      const button = screen.getByText('Auto-run OFF').closest('button')
      expect(button).toHaveClass('text-zinc-400')
    })

    it('should render iframe for preview', () => {
      render(<PreviewPanel {...defaultProps} />)

      const iframe = screen.getByTitle('preview')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('sandbox')
    })

    it('should display error message when error exists', () => {
      render(<PreviewPanel {...defaultProps} error="Test error message" />)

      expect(screen.getByText('Error:')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should not display error when no error', () => {
      render(<PreviewPanel {...defaultProps} error="" />)

      expect(screen.queryByText('Error:')).not.toBeInTheDocument()
    })

    it('should render BrowserChrome with correct URL', () => {
      render(<PreviewPanel {...defaultProps} selectedFramework="vue" />)

      expect(screen.getByTestId('browser-url')).toHaveTextContent(
        'https://localhost:3000/preview/vue'
      )
    })

    it('should pass isRunning to BrowserChrome', () => {
      render(<PreviewPanel {...defaultProps} isRunning={true} />)

      expect(screen.getByTestId('browser-refreshing')).toHaveTextContent('true')
    })

    it('should not render terminal in frontend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="frontend" />)

      expect(screen.queryByTestId('terminal')).not.toBeInTheDocument()
    })

    it('should not render resizable panels in frontend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="frontend" />)

      expect(screen.queryByTestId('resizable-panel-group')).not.toBeInTheDocument()
    })
  })

  describe('Backend Mode', () => {
    it('should render run server button', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      expect(screen.getByText('Run Server')).toBeInTheDocument()
    })

    it('should call onRefresh when run server clicked', () => {
      const onRefresh = vi.fn()
      render(<PreviewPanel {...defaultProps} mode="backend" onRefresh={onRefresh} />)

      fireEvent.click(screen.getByText('Run Server'))
      expect(onRefresh).toHaveBeenCalled()
    })

    it('should disable run server button when running', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" isRunning={true} />)

      const button = screen.getByText('Run Server').closest('button')
      expect(button).toBeDisabled()
    })

    it('should show loading spinner when running', () => {
      const { container } = render(<PreviewPanel {...defaultProps} mode="backend" isRunning={true} />)

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should show play icon when not running', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" isRunning={false} />)

      // Button should contain "Run Server" text
      expect(screen.getByText('Run Server')).toBeInTheDocument()
    })

    it('should render resizable panel group in backend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      expect(screen.getByTestId('resizable-panel-group')).toBeInTheDocument()
    })

    it('should render vertical resizable panels', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      const panelGroup = screen.getByTestId('resizable-panel-group')
      expect(panelGroup).toHaveAttribute('data-direction', 'vertical')
    })

    it('should render terminal in backend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      expect(screen.getByTestId('terminal')).toBeInTheDocument()
    })

    it('should show server starting message when no serverUrl', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" serverUrl="" />)

      expect(screen.getByText('Server starting...')).toBeInTheDocument()
      expect(screen.getByText('Preview will appear here when ready')).toBeInTheDocument()
    })

    it('should render iframe when serverUrl exists', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" serverUrl="http://localhost:3001" />)

      const iframe = screen.getByTitle('Backend Preview')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', 'http://localhost:3001')
    })

    it('should display error in backend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" error="Server error" />)

      expect(screen.getByText('Error:')).toBeInTheDocument()
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })

    it('should render terminal header', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      // Terminal appears twice - once in header, once in mock component
      expect(screen.getAllByText('Terminal').length).toBeGreaterThan(0)
    })

    it('should render BrowserChrome with server URL', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" serverUrl="http://localhost:3001" />)

      expect(screen.getByTestId('browser-url')).toHaveTextContent('http://localhost:3001')
    })

    it('should show waiting message in URL when no server', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" serverUrl="" />)

      expect(screen.getByTestId('browser-url')).toHaveTextContent('http://localhost:3001 (waiting...)')
    })

    it('should not render auto-run button in backend mode', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" />)

      expect(screen.queryByText('Auto-run ON')).not.toBeInTheDocument()
      expect(screen.queryByText('Auto-run OFF')).not.toBeInTheDocument()
    })
  })

  describe('BrowserChrome Integration', () => {
    it('should render BrowserChrome component', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByTestId('browser-chrome')).toBeInTheDocument()
    })

    it('should pass refresh callback to BrowserChrome', () => {
      const onRefresh = vi.fn()
      render(<PreviewPanel {...defaultProps} onRefresh={onRefresh} />)

      fireEvent.click(screen.getByTestId('browser-refresh-btn'))
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  describe('Error Display', () => {
    it('should show error with red background in frontend', () => {
      const { container } = render(<PreviewPanel {...defaultProps} error="Test error" />)

      const errorDiv = screen.getByText('Error:').closest('div')?.parentElement
      expect(errorDiv).toHaveClass('bg-red-50')
    })

    it('should show error with dark red background in backend', () => {
      const { container } = render(<PreviewPanel {...defaultProps} mode="backend" error="Test error" />)

      const errorDiv = screen.getByText('Error:').closest('div')?.parentElement
      expect(errorDiv).toHaveClass('bg-red-900/20')
    })

    it('should display error as absolute positioned overlay', () => {
      render(<PreviewPanel {...defaultProps} error="Test error" />)

      const errorDiv = screen.getByText('Error:').closest('div')?.parentElement
      expect(errorDiv).toHaveClass('absolute')
    })
  })

  describe('Iframe Sandbox Attributes', () => {
    it('should set correct sandbox attributes for frontend iframe', () => {
      render(<PreviewPanel {...defaultProps} mode="frontend" />)

      const iframe = screen.getByTitle('preview')
      const sandbox = iframe.getAttribute('sandbox')
      expect(sandbox).toContain('allow-scripts')
      expect(sandbox).toContain('allow-same-origin')
    })

    it('should set correct sandbox attributes for backend iframe', () => {
      render(<PreviewPanel {...defaultProps} mode="backend" serverUrl="http://localhost:3001" />)

      const iframe = screen.getByTitle('Backend Preview')
      const sandbox = iframe.getAttribute('sandbox')
      expect(sandbox).toContain('allow-scripts')
      expect(sandbox).toContain('allow-same-origin')
    })
  })
})
