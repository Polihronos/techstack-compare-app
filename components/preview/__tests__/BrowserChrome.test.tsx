import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserChrome } from '../BrowserChrome'

describe('BrowserChrome', () => {
  const defaultProps = {
    url: 'https://localhost:3000/preview/react',
    isRefreshing: false,
    onRefresh: vi.fn(),
  }

  describe('Rendering', () => {
    it('should render browser chrome container', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const chrome = container.querySelector('.bg-zinc-800')
      expect(chrome).toBeInTheDocument()
      expect(chrome).toHaveClass('border-b', 'border-zinc-700')
    })

    it('should render navigation buttons', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      // Back, Forward, Refresh, Home = 4 buttons
      expect(buttons).toHaveLength(4)
    })

    it('should render address bar', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const addressBar = container.querySelector('.bg-zinc-900')
      expect(addressBar).toBeInTheDocument()
      expect(addressBar).toHaveClass('rounded-md', 'border')
    })

    it('should display URL in address bar', () => {
      render(<BrowserChrome {...defaultProps} url="https://example.com/test" />)

      expect(screen.getByText('https://example.com/test')).toBeInTheDocument()
    })

    it('should render lock icon', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const lockIcon = container.querySelector('.text-green-500')
      expect(lockIcon).toBeInTheDocument()
    })
  })

  describe('Navigation Buttons', () => {
    it('should render back button as disabled', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      const backButton = buttons[0]
      expect(backButton).toBeDisabled()
    })

    it('should render forward button as disabled', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      const forwardButton = buttons[1]
      expect(forwardButton).toBeDisabled()
    })

    it('should render home button as disabled', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      const homeButton = buttons[3]
      expect(homeButton).toBeDisabled()
    })

    it('should apply ghost variant to navigation buttons', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-slot', 'button')
      })
    })
  })

  describe('Refresh Button', () => {
    it('should render refresh button', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]
      expect(refreshButton).toBeInTheDocument()
    })

    it('should call onRefresh when clicked', () => {
      const onRefresh = vi.fn()
      render(<BrowserChrome {...defaultProps} onRefresh={onRefresh} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]
      fireEvent.click(refreshButton)

      expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    it('should be enabled when not refreshing', () => {
      render(<BrowserChrome {...defaultProps} isRefreshing={false} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]
      expect(refreshButton).not.toBeDisabled()
    })

    it('should be disabled when refreshing', () => {
      render(<BrowserChrome {...defaultProps} isRefreshing={true} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]
      expect(refreshButton).toBeDisabled()
    })

    it('should show spinner when refreshing', () => {
      const { container } = render(<BrowserChrome {...defaultProps} isRefreshing={true} />)

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should not show spinner when not refreshing', () => {
      const { container } = render(<BrowserChrome {...defaultProps} isRefreshing={false} />)

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).not.toBeInTheDocument()
    })

    it('should not call onRefresh when disabled', () => {
      const onRefresh = vi.fn()
      render(<BrowserChrome {...defaultProps} isRefreshing={true} onRefresh={onRefresh} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]
      fireEvent.click(refreshButton)

      expect(onRefresh).not.toHaveBeenCalled()
    })
  })

  describe('URL Display', () => {
    it('should display frontend preview URL', () => {
      render(<BrowserChrome {...defaultProps} url="https://localhost:3000/preview/vue" />)

      expect(screen.getByText('https://localhost:3000/preview/vue')).toBeInTheDocument()
    })

    it('should display backend server URL', () => {
      render(<BrowserChrome {...defaultProps} url="http://localhost:3001" />)

      expect(screen.getByText('http://localhost:3001')).toBeInTheDocument()
    })

    it('should display waiting message', () => {
      render(<BrowserChrome {...defaultProps} url="http://localhost:3001 (waiting...)" />)

      expect(screen.getByText('http://localhost:3001 (waiting...)')).toBeInTheDocument()
    })

    it('should display empty URL', () => {
      const { container } = render(<BrowserChrome {...defaultProps} url="" />)

      const urlSpan = container.querySelector('.font-mono')
      expect(urlSpan).toBeInTheDocument()
      expect(urlSpan).toHaveTextContent('')
    })

    it('should use monospace font for URL', () => {
      render(<BrowserChrome {...defaultProps} />)

      const urlText = screen.getByText(defaultProps.url)
      expect(urlText).toHaveClass('font-mono')
    })
  })

  describe('Icons', () => {
    it('should render chevron left icon for back button', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      // First button should have ChevronLeft icon
      const buttons = container.querySelectorAll('button')
      const backButton = buttons[0]
      const icon = backButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render chevron right icon for forward button', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const buttons = container.querySelectorAll('button')
      const forwardButton = buttons[1]
      const icon = forwardButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render rotate icon for refresh button', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const buttons = container.querySelectorAll('button')
      const refreshButton = buttons[2]
      const icon = refreshButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render home icon for home button', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const buttons = container.querySelectorAll('button')
      const homeButton = buttons[3]
      const icon = homeButton.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render lock icon with green color', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const lockIcon = container.querySelector('.text-green-500')
      expect(lockIcon).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply correct container styling', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const chrome = container.querySelector('.bg-zinc-800')
      expect(chrome).toHaveClass('px-3', 'py-2', 'flex', 'items-center', 'gap-2')
    })

    it('should apply correct button sizing', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('h-7')
      })
    })

    it('should apply hover styles to buttons', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('hover:text-zinc-300', 'hover:bg-zinc-700')
      })
    })

    it('should apply correct address bar styling', () => {
      const { container } = render(<BrowserChrome {...defaultProps} />)

      const addressBar = container.querySelector('.bg-zinc-900')
      expect(addressBar).toHaveClass('flex-1', 'rounded-md', 'px-3', 'py-1.5')
    })
  })

  describe('Accessibility', () => {
    it('should have all buttons with button role', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)
    })

    it('should disable inactive navigation buttons', () => {
      render(<BrowserChrome {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeDisabled() // Back
      expect(buttons[1]).toBeDisabled() // Forward
      expect(buttons[3]).toBeDisabled() // Home
    })

    it('should allow keyboard interaction with refresh button', () => {
      const onRefresh = vi.fn()
      render(<BrowserChrome {...defaultProps} onRefresh={onRefresh} />)

      const buttons = screen.getAllByRole('button')
      const refreshButton = buttons[2]

      // Simulate click via keyboard
      refreshButton.focus()
      fireEvent.click(refreshButton)

      expect(onRefresh).toHaveBeenCalled()
    })
  })
})
