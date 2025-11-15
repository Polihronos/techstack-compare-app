import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FrameworkIcon, Framework } from '../FrameworkIcon'

describe('FrameworkIcon', () => {
  describe('Vanilla JavaScript', () => {
    it('should render Zap icon for vanilla', () => {
      const { container } = render(<FrameworkIcon framework="vanilla" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply yellow color to vanilla icon', () => {
      const { container } = render(<FrameworkIcon framework="vanilla" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-yellow-500')
    })

    it('should apply correct sizing to vanilla icon', () => {
      const { container } = render(<FrameworkIcon framework="vanilla" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4')
    })
  })

  describe('React', () => {
    it('should render React icon', () => {
      const { container } = render(<FrameworkIcon framework="react" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply blue color to React icon', () => {
      const { container } = render(<FrameworkIcon framework="react" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-blue-500')
    })

    it('should apply correct sizing to React icon', () => {
      const { container } = render(<FrameworkIcon framework="react" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('should render React logo SVG path', () => {
      const { container } = render(<FrameworkIcon framework="react" />)

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
      expect(path?.getAttribute('d')).toContain('M14.23 12.004')
    })

    it('should use fill for React icon', () => {
      const { container } = render(<FrameworkIcon framework="react" />)

      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('fill')).toBe('currentColor')
    })
  })

  describe('Vue', () => {
    it('should render Vue icon', () => {
      const { container } = render(<FrameworkIcon framework="vue" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply green color to Vue icon', () => {
      const { container } = render(<FrameworkIcon framework="vue" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-green-500')
    })

    it('should apply correct sizing to Vue icon', () => {
      const { container } = render(<FrameworkIcon framework="vue" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('should render Vue logo SVG path', () => {
      const { container } = render(<FrameworkIcon framework="vue" />)

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
      expect(path?.getAttribute('d')).toContain('M24,1.61H14.06L12,5.16')
    })
  })

  describe('Svelte', () => {
    it('should render Svelte icon', () => {
      const { container } = render(<FrameworkIcon framework="svelte" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply orange color to Svelte icon', () => {
      const { container } = render(<FrameworkIcon framework="svelte" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-orange-500')
    })

    it('should apply correct sizing to Svelte icon', () => {
      const { container } = render(<FrameworkIcon framework="svelte" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('should render Svelte logo SVG path', () => {
      const { container } = render(<FrameworkIcon framework="svelte" />)

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
      expect(path?.getAttribute('d')).toContain('M10.354 21.125')
    })
  })

  describe('Angular', () => {
    it('should render Angular icon', () => {
      const { container } = render(<FrameworkIcon framework="angular" />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should apply red color to Angular icon', () => {
      const { container } = render(<FrameworkIcon framework="angular" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('text-red-500')
    })

    it('should apply correct sizing to Angular icon', () => {
      const { container } = render(<FrameworkIcon framework="angular" />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4')
    })

    it('should render Angular logo SVG path', () => {
      const { container } = render(<FrameworkIcon framework="angular" />)

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
      expect(path?.getAttribute('d')).toContain('M9.931 12.645')
    })
  })

  describe('SVG Properties', () => {
    it('should set viewBox for all framework icons except vanilla', () => {
      const frameworks: Framework[] = ['react', 'vue', 'svelte', 'angular']

      frameworks.forEach((framework) => {
        const { container } = render(<FrameworkIcon framework={framework} />)
        const svg = container.querySelector('svg')
        expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
      })
    })

    it('should use currentColor for fill', () => {
      const frameworks: Framework[] = ['react', 'vue', 'svelte', 'angular']

      frameworks.forEach((framework) => {
        const { container } = render(<FrameworkIcon framework={framework} />)
        const svg = container.querySelector('svg')
        expect(svg?.getAttribute('fill')).toBe('currentColor')
      })
    })
  })

  describe('Icon Rendering', () => {
    it('should render unique icons for each framework', () => {
      const frameworks: Framework[] = ['vanilla', 'react', 'vue', 'svelte', 'angular']

      const icons = frameworks.map((framework) => {
        const { container } = render(<FrameworkIcon framework={framework} />)
        return container.innerHTML
      })

      // Verify all icons are different
      const uniqueIcons = new Set(icons)
      expect(uniqueIcons.size).toBe(frameworks.length)
    })

    it('should render vanilla with Lucide icon class', () => {
      const { container } = render(<FrameworkIcon framework="vanilla" />)

      const icon = container.querySelector('.lucide')
      expect(icon).toBeInTheDocument()
    })

    it('should render all frameworks without errors', () => {
      const frameworks: Framework[] = ['vanilla', 'react', 'vue', 'svelte', 'angular']

      frameworks.forEach((framework) => {
        expect(() => render(<FrameworkIcon framework={framework} />)).not.toThrow()
      })
    })
  })

  describe('Color Scheme', () => {
    it('should use correct brand colors', () => {
      const expectedColors: Record<Framework, string> = {
        vanilla: 'text-yellow-500',
        react: 'text-blue-500',
        vue: 'text-green-500',
        svelte: 'text-orange-500',
        angular: 'text-red-500',
      }

      Object.entries(expectedColors).forEach(([framework, colorClass]) => {
        const { container } = render(<FrameworkIcon framework={framework as Framework} />)
        const icon = container.querySelector('svg')
        expect(icon).toHaveClass(colorClass)
      })
    })
  })

  describe('Sizing', () => {
    it('should apply consistent sizing across all frameworks', () => {
      const frameworks: Framework[] = ['vanilla', 'react', 'vue', 'svelte', 'angular']

      frameworks.forEach((framework) => {
        const { container } = render(<FrameworkIcon framework={framework} />)
        const icon = container.querySelector('svg')
        expect(icon).toHaveClass('w-4', 'h-4')
      })
    })
  })
})
