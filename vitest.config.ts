import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}'
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.config.ts',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/.next/**',
        'app/layout.tsx',
        'components/ui/**', // shadcn/ui components
        '**/*-old*/**', // Exclude old backup files
        '**/*.backup.*', // Exclude backup files
        '**/index.ts' // Exclude export-only index files
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 83,
        lines: 90
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
