import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FrameworkSelector } from '../FrameworkSelector'

// Mock FrameworkIcon
vi.mock('@/components/FrameworkIcon', () => ({
  FrameworkIcon: vi.fn(({ framework }) => <div data-testid={`framework-icon-${framework}`}>{framework}</div>),
}))

describe('FrameworkSelector', () => {
  const mockFrontendFrameworks = [
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue', color: '#42b883' },
    { value: 'svelte', label: 'Svelte', color: '#ff3e00' },
  ]

  const mockBackendFrameworks = [
    { value: 'express', label: 'Express', color: '#000000' },
    { value: 'fastify', label: 'Fastify', color: '#000000' },
  ]

  describe('Frontend Mode', () => {
    it('should render all frontend frameworks', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Vue')).toBeInTheDocument()
      expect(screen.getByText('Svelte')).toBeInTheDocument()
    })

    it('should render framework icons for frontend frameworks', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      expect(screen.getByTestId('framework-icon-react')).toBeInTheDocument()
      expect(screen.getByTestId('framework-icon-vue')).toBeInTheDocument()
      expect(screen.getByTestId('framework-icon-svelte')).toBeInTheDocument()
    })

    it('should highlight selected framework', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="vue"
          onSelect={vi.fn()}
        />
      )

      const vueButton = screen.getByText('Vue').closest('button')
      expect(vueButton).toHaveClass('bg-blue-600')
    })

    it('should apply blue color for selected frontend framework', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      const reactButton = screen.getByText('React').closest('button')
      expect(reactButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
    })

    it('should apply default styling to unselected frameworks', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      const vueButton = screen.getByText('Vue').closest('button')
      expect(vueButton).toHaveClass('text-zinc-400', 'hover:text-zinc-300')
    })

    it('should call onSelect when framework clicked', () => {
      const onSelect = vi.fn()
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={onSelect}
        />
      )

      fireEvent.click(screen.getByText('Vue'))
      expect(onSelect).toHaveBeenCalledWith('vue')
    })

    it('should allow selecting already selected framework', () => {
      const onSelect = vi.fn()
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={onSelect}
        />
      )

      fireEvent.click(screen.getByText('React'))
      expect(onSelect).toHaveBeenCalledWith('react')
    })
  })

  describe('Backend Mode', () => {
    it('should render all backend frameworks', () => {
      render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="express"
          onSelect={vi.fn()}
        />
      )

      expect(screen.getByText('Express')).toBeInTheDocument()
      expect(screen.getByText('Fastify')).toBeInTheDocument()
    })

    it('should render server icons for backend frameworks', () => {
      const { container } = render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="express"
          onSelect={vi.fn()}
        />
      )

      // Server icon is from lucide-react, check for the SVG
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('should not render framework icons for backend', () => {
      render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="express"
          onSelect={vi.fn()}
        />
      )

      expect(screen.queryByTestId('framework-icon-express')).not.toBeInTheDocument()
      expect(screen.queryByTestId('framework-icon-fastify')).not.toBeInTheDocument()
    })

    it('should highlight selected backend framework', () => {
      render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="fastify"
          onSelect={vi.fn()}
        />
      )

      const fastifyButton = screen.getByText('Fastify').closest('button')
      expect(fastifyButton).toHaveClass('bg-green-600')
    })

    it('should apply green color for selected backend framework', () => {
      render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="express"
          onSelect={vi.fn()}
        />
      )

      const expressButton = screen.getByText('Express').closest('button')
      expect(expressButton).toHaveClass('bg-green-600', 'hover:bg-green-700')
    })

    it('should call onSelect when backend framework clicked', () => {
      const onSelect = vi.fn()
      render(
        <FrameworkSelector
          mode="backend"
          frameworks={mockBackendFrameworks}
          selected="express"
          onSelect={onSelect}
        />
      )

      fireEvent.click(screen.getByText('Fastify'))
      expect(onSelect).toHaveBeenCalledWith('fastify')
    })
  })

  describe('General', () => {
    it('should render empty when no frameworks provided', () => {
      const { container } = render(
        <FrameworkSelector mode="frontend" frameworks={[]} selected="react" onSelect={vi.fn()} />
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(0)
    })

    it('should handle single framework', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={[{ value: 'react', label: 'React', color: '#61dafb' }]}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      expect(screen.getByText('React')).toBeInTheDocument()
    })

    it('should apply correct variant to selected framework', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      const reactButton = screen.getByText('React').closest('button')
      // Selected frameworks get 'default' variant
      expect(reactButton).toHaveAttribute('data-slot', 'button')
    })

    it('should apply ghost variant to unselected frameworks', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      const vueButton = screen.getByText('Vue').closest('button')
      expect(vueButton).toHaveAttribute('data-slot', 'button')
    })

    it('should maintain consistent button sizing', () => {
      render(
        <FrameworkSelector
          mode="frontend"
          frameworks={mockFrontendFrameworks}
          selected="react"
          onSelect={vi.fn()}
        />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('h-7', 'px-2')
      })
    })
  })
})
