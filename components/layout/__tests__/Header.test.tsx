import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  describe('Rendering', () => {
    it('should render title', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Framework Playground')).toBeInTheDocument()
    })

    it('should render subtitle', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Compare and test code across frameworks')).toBeInTheDocument()
    })

    it('should render frontend button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Frontend')).toBeInTheDocument()
    })

    it('should render backend button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Backend')).toBeInTheDocument()
    })

    it('should render full-stack button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Full-Stack')).toBeInTheDocument()
    })

    it('should render docs button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      expect(screen.getByText('Docs')).toBeInTheDocument()
    })
  })

  describe('Frontend Mode', () => {
    it('should highlight frontend button when in frontend mode', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const frontendButton = screen.getByText('Frontend').closest('button')
      expect(frontendButton).toHaveClass('bg-blue-600')
    })

    it('should not highlight backend button when in frontend mode', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const backendButton = screen.getByText('Backend').closest('button')
      expect(backendButton).toHaveClass('text-zinc-400')
    })
  })

  describe('Backend Mode', () => {
    it('should highlight backend button when in backend mode', () => {
      render(<Header mode="backend" onModeChange={vi.fn()} />)

      const backendButton = screen.getByText('Backend').closest('button')
      expect(backendButton).toHaveClass('bg-green-600')
    })

    it('should not highlight frontend button when in backend mode', () => {
      render(<Header mode="backend" onModeChange={vi.fn()} />)

      const frontendButton = screen.getByText('Frontend').closest('button')
      expect(frontendButton).toHaveClass('text-zinc-400')
    })

    it('should not highlight fullstack button when in backend mode', () => {
      render(<Header mode="backend" onModeChange={vi.fn()} />)

      const fullstackButton = screen.getByText('Full-Stack').closest('button')
      expect(fullstackButton).toHaveClass('text-zinc-400')
    })
  })

  describe('Full-Stack Mode', () => {
    it('should highlight fullstack button when in fullstack mode', () => {
      render(<Header mode="fullstack" onModeChange={vi.fn()} />)

      const fullstackButton = screen.getByText('Full-Stack').closest('button')
      expect(fullstackButton).toHaveClass('bg-purple-600')
    })

    it('should not highlight frontend button when in fullstack mode', () => {
      render(<Header mode="fullstack" onModeChange={vi.fn()} />)

      const frontendButton = screen.getByText('Frontend').closest('button')
      expect(frontendButton).toHaveClass('text-zinc-400')
    })

    it('should not highlight backend button when in fullstack mode', () => {
      render(<Header mode="fullstack" onModeChange={vi.fn()} />)

      const backendButton = screen.getByText('Backend').closest('button')
      expect(backendButton).toHaveClass('text-zinc-400')
    })
  })

  describe('Mode Switching', () => {
    it('should call onModeChange with frontend when frontend clicked', () => {
      const onModeChange = vi.fn()
      render(<Header mode="backend" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Frontend'))
      expect(onModeChange).toHaveBeenCalledWith('frontend')
    })

    it('should call onModeChange with backend when backend clicked', () => {
      const onModeChange = vi.fn()
      render(<Header mode="frontend" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Backend'))
      expect(onModeChange).toHaveBeenCalledWith('backend')
    })

    it('should call onModeChange with fullstack when fullstack clicked', () => {
      const onModeChange = vi.fn()
      render(<Header mode="frontend" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Full-Stack'))
      expect(onModeChange).toHaveBeenCalledWith('fullstack')
    })

    it('should allow clicking already selected mode', () => {
      const onModeChange = vi.fn()
      render(<Header mode="frontend" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Frontend'))
      expect(onModeChange).toHaveBeenCalledWith('frontend')
    })

    it('should switch from backend to fullstack', () => {
      const onModeChange = vi.fn()
      render(<Header mode="backend" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Full-Stack'))
      expect(onModeChange).toHaveBeenCalledWith('fullstack')
    })

    it('should switch from fullstack to frontend', () => {
      const onModeChange = vi.fn()
      render(<Header mode="fullstack" onModeChange={onModeChange} />)

      fireEvent.click(screen.getByText('Frontend'))
      expect(onModeChange).toHaveBeenCalledWith('frontend')
    })
  })

  describe('Documentation', () => {
    it('should open docs in new window when clicked', () => {
      const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null)
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      fireEvent.click(screen.getByText('Docs'))
      expect(windowOpen).toHaveBeenCalledWith('/docs/index.html', '_blank')

      windowOpen.mockRestore()
    })
  })

  describe('Icons', () => {
    it('should render sparkles icon', () => {
      const { container } = render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should render monitor icon in frontend button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const frontendButton = screen.getByText('Frontend').closest('button')
      const icon = frontendButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render server icon in backend button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const backendButton = screen.getByText('Backend').closest('button')
      const icon = backendButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render layers icon in fullstack button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const fullstackButton = screen.getByText('Full-Stack').closest('button')
      const icon = fullstackButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render book icon in docs button', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const docsButton = screen.getByText('Docs').closest('button')
      const icon = docsButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct header styling', () => {
      const { container } = render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const header = container.querySelector('header')
      expect(header).toHaveClass('bg-zinc-900')
      expect(header).toHaveClass('border-b')
    })

    it('should apply blue color to frontend when selected', () => {
      render(<Header mode="frontend" onModeChange={vi.fn()} />)

      const button = screen.getByText('Frontend').closest('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
    })

    it('should apply green color to backend when selected', () => {
      render(<Header mode="backend" onModeChange={vi.fn()} />)

      const button = screen.getByText('Backend').closest('button')
      expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700')
    })

    it('should apply purple color to fullstack when selected', () => {
      render(<Header mode="fullstack" onModeChange={vi.fn()} />)

      const button = screen.getByText('Full-Stack').closest('button')
      expect(button).toHaveClass('bg-purple-600', 'hover:bg-purple-700')
    })
  })
})
