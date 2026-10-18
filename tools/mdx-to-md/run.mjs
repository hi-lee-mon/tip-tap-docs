// 使い方: node tools/mdx-to-md/run.mjs <tiptap-docs の src/content> <出力先>
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { convertMdx, toOutputPath } from './convert.mjs'

const SECTIONS = ['editor', 'guides']

// 対象外の理由は docs/adr/20261018-1240-tiptap-docs-ja-translation.md を参照
const EXCLUDED = new Set([
  'editor/getting-started/install/alpine.mdx',
  'editor/getting-started/install/nuxt.mdx',
  'editor/getting-started/install/php.mdx',
  'editor/getting-started/install/svelte.mdx',
  'editor/getting-started/install/vanilla-javascript.mdx',
  'editor/getting-started/install/vue2.mdx',
  'editor/getting-started/install/vue3.mdx',
  'editor/api/utilities/tiptap-for-php.mdx',
  'editor/extensions/functionality/drag-handle-vue.mdx',
  'editor/extensions/custom-extensions/node-views/vue.mdx',
  'editor/extensions/custom-extensions/mark-views/vue.mdx',
  'guides/decorations-vanilla.mdx',
  'guides/decorations-vue.mdx',
])

const [contentDir, outDir] = process.argv.slice(2)
if (!contentDir || !outDir) {
  console.error('usage: node run.mjs <content-dir> <out-dir>')
  process.exit(1)
}

const relPaths = SECTIONS.flatMap((s) =>
  readdirSync(join(contentDir, s), { recursive: true })
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => join(s, f)),
).filter((p) => !EXCLUDED.has(p))

const outputs = new Set(relPaths.map(toOutputPath))

for (const relPath of relPaths) {
  const md = convertMdx(readFileSync(join(contentDir, relPath), 'utf8'), { relPath, outputs })
  const dest = join(outDir, toOutputPath(relPath))
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, md)
}

console.log(`${relPaths.length} files -> ${relative(process.cwd(), outDir) || outDir}`)
