import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e.spec.ts'],
    globals: true,
    root: './',
    environmentMatchGlobs: [['src/infra/http/controllers/**', 'prisma']],
  },
  plugins: [tsConfigPaths()],
})
