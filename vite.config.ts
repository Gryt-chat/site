import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    }),
    react(),
  ],
})
