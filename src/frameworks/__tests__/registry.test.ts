import { describe, it, expect } from 'vitest'
import {
  FRAMEWORKS,
  getFramework,
  getFrontendFrameworks,
  getBackendFrameworks,
  getAllFrameworkIds,
  hasFramework,
} from '../registry'
import type { FrameworkId } from '../types'

describe('Framework Registry', () => {
  describe('FRAMEWORKS constant', () => {
    it('should contain all expected frameworks', () => {
      const expectedFrameworks = [
        'vanilla',
        'react',
        'vue',
        'svelte',
        'angular',
        'express',
        'fastify',
        'nextjs',
        'sveltekit',
      ]

      expectedFrameworks.forEach(fw => {
        expect(FRAMEWORKS).toHaveProperty(fw)
      })
    })

    it('should have exactly 9 frameworks', () => {
      expect(Object.keys(FRAMEWORKS)).toHaveLength(9)
    })

    it('should have valid framework configurations', () => {
      Object.entries(FRAMEWORKS).forEach(([key, config]) => {
        expect(config).toHaveProperty('id')
        expect(config).toHaveProperty('name')
        expect(config).toHaveProperty('type')
        expect(config).toHaveProperty('description')
        expect(config).toHaveProperty('icon')
        expect(config).toHaveProperty('color')
        expect(config).toHaveProperty('executor')

        expect(config.id).toBe(key)
        expect(['frontend', 'backend']).toContain(config.type)
      })
    })

    it('should have proper frontend framework structure', () => {
      const frontendIds: FrameworkId[] = ['vanilla', 'react', 'vue', 'svelte', 'angular']

      frontendIds.forEach(id => {
        const config = FRAMEWORKS[id]
        expect(config.type).toBe('frontend')
        expect(config).toHaveProperty('simpleTemplate')
        expect(config).toHaveProperty('advancedTemplate')
        expect(config.simpleTemplate).toHaveProperty('code')
        expect(config.simpleTemplate).toHaveProperty('language')
        expect(config.advancedTemplate).toHaveProperty('files')
      })
    })

    it('should have proper backend framework structure', () => {
      const backendIds: FrameworkId[] = ['express', 'fastify', 'nextjs', 'sveltekit']

      backendIds.forEach(id => {
        const config = FRAMEWORKS[id]
        expect(config.type).toBe('backend')
        expect(config).toHaveProperty('advancedTemplate')
        expect(config.simpleTemplate).toBeUndefined()
      })
    })
  })

  describe('getFramework', () => {
    it('should return framework config for valid ID', () => {
      const react = getFramework('react')
      expect(react).toBeDefined()
      expect(react?.id).toBe('react')
      expect(react?.name).toBe('React')
      expect(react?.type).toBe('frontend')
    })

    it('should return framework config for all valid IDs', () => {
      const allIds = Object.keys(FRAMEWORKS) as FrameworkId[]

      allIds.forEach(id => {
        const config = getFramework(id)
        expect(config).toBeDefined()
        expect(config?.id).toBe(id)
      })
    })

    it('should return undefined for invalid ID', () => {
      const result = getFramework('invalid' as FrameworkId)
      expect(result).toBeUndefined()
    })

    it('should return undefined for empty string', () => {
      const result = getFramework('' as FrameworkId)
      expect(result).toBeUndefined()
    })

    it('should return correct config for express backend', () => {
      const express = getFramework('express')
      expect(express).toBeDefined()
      expect(express?.id).toBe('express')
      expect(express?.type).toBe('backend')
      expect(express?.name).toBe('Express.js')
    })
  })

  describe('getFrontendFrameworks', () => {
    it('should return all frontend frameworks', () => {
      const frontendFrameworks = getFrontendFrameworks()
      expect(frontendFrameworks).toHaveLength(5)
    })

    it('should return only frontend type frameworks', () => {
      const frontendFrameworks = getFrontendFrameworks()

      frontendFrameworks.forEach(fw => {
        expect(fw.type).toBe('frontend')
      })
    })

    it('should include all expected frontend frameworks', () => {
      const frontendFrameworks = getFrontendFrameworks()
      const ids = frontendFrameworks.map(fw => fw.id)

      expect(ids).toContain('vanilla')
      expect(ids).toContain('react')
      expect(ids).toContain('vue')
      expect(ids).toContain('svelte')
      expect(ids).toContain('angular')
    })

    it('should not include any backend frameworks', () => {
      const frontendFrameworks = getFrontendFrameworks()
      const ids = frontendFrameworks.map(fw => fw.id)

      expect(ids).not.toContain('express')
      expect(ids).not.toContain('fastify')
      expect(ids).not.toContain('nextjs')
      expect(ids).not.toContain('sveltekit')
    })

    it('should return frameworks with proper frontend structure', () => {
      const frontendFrameworks = getFrontendFrameworks()

      frontendFrameworks.forEach(fw => {
        expect(fw.simpleTemplate).toBeDefined()
        expect(fw.simpleTemplate.code).toBeDefined()
        expect(fw.simpleTemplate.language).toBeDefined()
        expect(fw.advancedTemplate).toBeDefined()
        expect(fw.advancedTemplate.files).toBeDefined()
      })
    })
  })

  describe('getBackendFrameworks', () => {
    it('should return all backend frameworks', () => {
      const backendFrameworks = getBackendFrameworks()
      expect(backendFrameworks).toHaveLength(4)
    })

    it('should return only backend type frameworks', () => {
      const backendFrameworks = getBackendFrameworks()

      backendFrameworks.forEach(fw => {
        expect(fw.type).toBe('backend')
      })
    })

    it('should include all expected backend frameworks', () => {
      const backendFrameworks = getBackendFrameworks()
      const ids = backendFrameworks.map(fw => fw.id)

      expect(ids).toContain('express')
      expect(ids).toContain('fastify')
      expect(ids).toContain('nextjs')
      expect(ids).toContain('sveltekit')
    })

    it('should not include any frontend frameworks', () => {
      const backendFrameworks = getBackendFrameworks()
      const ids = backendFrameworks.map(fw => fw.id)

      expect(ids).not.toContain('vanilla')
      expect(ids).not.toContain('react')
      expect(ids).not.toContain('vue')
      expect(ids).not.toContain('svelte')
      expect(ids).not.toContain('angular')
    })

    it('should return frameworks with backend executor', () => {
      const backendFrameworks = getBackendFrameworks()

      backendFrameworks.forEach(fw => {
        expect(fw.executor).toBeDefined()
        expect(fw.simpleTemplate).toBeUndefined()
      })
    })
  })

  describe('getAllFrameworkIds', () => {
    it('should return all framework IDs', () => {
      const ids = getAllFrameworkIds()
      expect(ids).toHaveLength(9)
    })

    it('should include all expected IDs', () => {
      const ids = getAllFrameworkIds()

      expect(ids).toContain('vanilla')
      expect(ids).toContain('react')
      expect(ids).toContain('vue')
      expect(ids).toContain('svelte')
      expect(ids).toContain('angular')
      expect(ids).toContain('express')
      expect(ids).toContain('fastify')
      expect(ids).toContain('nextjs')
      expect(ids).toContain('sveltekit')
    })

    it('should return strings as IDs', () => {
      const ids = getAllFrameworkIds()

      ids.forEach(id => {
        expect(typeof id).toBe('string')
        expect(id.length).toBeGreaterThan(0)
      })
    })

    it('should match Object.keys of FRAMEWORKS', () => {
      const ids = getAllFrameworkIds()
      const expectedIds = Object.keys(FRAMEWORKS)

      expect(ids).toEqual(expectedIds)
    })
  })

  describe('hasFramework', () => {
    it('should return true for valid framework IDs', () => {
      const validIds = [
        'vanilla',
        'react',
        'vue',
        'svelte',
        'angular',
        'express',
        'fastify',
        'nextjs',
        'sveltekit',
      ]

      validIds.forEach(id => {
        expect(hasFramework(id)).toBe(true)
      })
    })

    it('should return false for invalid framework IDs', () => {
      const invalidIds = ['invalid', 'notaframework', 'react-native', 'ember', '']

      invalidIds.forEach(id => {
        expect(hasFramework(id)).toBe(false)
      })
    })

    it('should work as type guard', () => {
      const testId = 'react'

      if (hasFramework(testId)) {
        // TypeScript should narrow the type here
        const framework = getFramework(testId)
        expect(framework).toBeDefined()
      }
    })

    it('should return false for null and undefined', () => {
      expect(hasFramework(null as any)).toBe(false)
      expect(hasFramework(undefined as any)).toBe(false)
    })

    it('should be case-sensitive', () => {
      expect(hasFramework('React')).toBe(false)
      expect(hasFramework('REACT')).toBe(false)
      expect(hasFramework('react')).toBe(true)
    })
  })

  describe('Integration tests', () => {
    it('should have consistent data between getter functions', () => {
      const frontendFrameworks = getFrontendFrameworks()
      const backendFrameworks = getBackendFrameworks()
      const allIds = getAllFrameworkIds()

      // Total count should match
      expect(frontendFrameworks.length + backendFrameworks.length).toBe(allIds.length)

      // Each frontend framework should be retrievable
      frontendFrameworks.forEach(fw => {
        expect(getFramework(fw.id)).toEqual(fw)
        expect(hasFramework(fw.id)).toBe(true)
      })

      // Each backend framework should be retrievable
      backendFrameworks.forEach(fw => {
        expect(getFramework(fw.id)).toEqual(fw)
        expect(hasFramework(fw.id)).toBe(true)
      })
    })

    it('should not have duplicate framework IDs', () => {
      const allIds = getAllFrameworkIds()
      const uniqueIds = [...new Set(allIds)]

      expect(allIds.length).toBe(uniqueIds.length)
    })

    it('should have unique framework names', () => {
      const allConfigs = Object.values(FRAMEWORKS)
      const names = allConfigs.map(config => config.name)
      const uniqueNames = [...new Set(names)]

      expect(names.length).toBe(uniqueNames.length)
    })
  })
})
