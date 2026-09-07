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
    /* So `scripts/routeStyles.mjs` can tell which stylesheet each route needs
       and the prerendered HTML can ask for it in the head (GRYT-959).

       Without this every prerendered page shipped only the global stylesheet
       and its own arrived 50–120ms after first paint, so the page rendered
       unstyled and then restyled itself. */
    manifest: true,
  },
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    }),
    react(),
  ],
})
