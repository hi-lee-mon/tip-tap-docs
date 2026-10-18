import { test } from 'node:test'
import assert from 'node:assert/strict'
import { convertMdx, toOutputPath } from './convert.mjs'

const ctx = {
  relPath: 'editor/getting-started/install/react.mdx',
  outputs: new Set([
    'editor/getting-started/configure.md',
    'editor/core-concepts/introduction.md',
    'editor/extensions/custom-extensions/index.md',
    'guides/performance.md',
  ]),
}

const frontmatter = `---
title: React
meta:
  title: React | Tiptap Editor Docs
  description: Learn how to integrate.
  category: Editor
---
`

test('frontmatter の title が見出しになり、出典リンクが付く', () => {
  const out = convertMdx(frontmatter + '\nBody', ctx)
  assert.match(out, /^# React\n/)
  assert.match(out, /https:\/\/tiptap\.dev\/docs\/editor\/getting-started\/install\/react/)
  assert.doesNotMatch(out, /category: Editor/)
})

test('コードブロックの外の import 行は消え、中の import 行は残る', () => {
  const src = `${frontmatter}
import { Callout } from '@/components/ui/Callout'

\`\`\`js
import { Editor } from '@tiptap/core'
\`\`\`
`
  const out = convertMdx(src, ctx)
  assert.doesNotMatch(out, /components\/ui\/Callout/)
  assert.match(out, /import \{ Editor \} from '@tiptap\/core'/)
})

test('Callout は種類に応じた注記ブロックになり、タイトルは太字になる', () => {
  const src = `${frontmatter}
<Callout title="More details" variant="hint">
    Read [this](/guides/performance).

    Second line.
</Callout>
`
  const out = convertMdx(src, ctx)
  assert.match(out, /> \[!TIP\]\n> \*\*More details\*\*\n>\n> Read \[this\]\(\.\.\/\.\.\/\.\.\/guides\/performance\.md\)\.\n>\n> Second line\.\n/)
})

test('Callout の variant と注記の種類の対応', () => {
  for (const [variant, kind] of [['hint', 'TIP'], ['info', 'NOTE'], ['warning', 'WARNING'], ['default', 'NOTE']]) {
    const out = convertMdx(`${frontmatter}\n<Callout variant="${variant}">\nX\n</Callout>\n`, ctx)
    assert.match(out, new RegExp(`> \\[!${kind}\\]`))
  }
})

test('Callout の中のコードブロックも注記ブロックに入る', () => {
  const src = `${frontmatter}
<Callout variant="info">
  Text
  \`\`\`js
  const a = 1
  \`\`\`
</Callout>
`
  const out = convertMdx(src, ctx)
  assert.match(out, /> Text\n> ```js\n> const a = 1\n> ```\n/)
})

test('コードブロックの中の JSX は変換しない', () => {
  const src = `${frontmatter}
\`\`\`jsx
<Callout variant="info">keep</Callout>
<CodeDemo path="/x" />
\`\`\`
`
  const out = convertMdx(src, ctx)
  assert.match(out, /<Callout variant="info">keep<\/Callout>/)
  assert.match(out, /<CodeDemo path="\/x" \/>/)
})

test('CodeDemo は path・isPro・src に応じたデモへのリンクになる', () => {
  const out = convertMdx(
    `${frontmatter}
<CodeDemo path="/Examples/Default" />

<CodeDemo isPro path="/Extensions/Export" />

<CodeDemo src="https://embed.tiptap.dev/preview/Markdown/Full" />

<CodeDemo
  path="/Nodes/Twitch"
  isLarge
/>
`,
    ctx,
  )
  assert.match(out, /\[デモを開く\]\(https:\/\/embed\.tiptap\.dev\/preview\/Examples\/Default\)/)
  assert.match(out, /\[デモを開く\]\(https:\/\/embed-pro\.tiptap\.dev\/preview\/Extensions\/Export\)/)
  assert.match(out, /\[デモを開く\]\(https:\/\/embed\.tiptap\.dev\/preview\/Markdown\/Full\)/)
  assert.match(out, /\[デモを開く\]\(https:\/\/embed\.tiptap\.dev\/preview\/Nodes\/Twitch\)/)
  assert.doesNotMatch(out, /isLarge/)
})

test('CodeDemo の属性に入れ子の JSX があっても、部品全体が1つのリンクになる', () => {
  const out = convertMdx(
    `${frontmatter}
<CodeDemo
  path="/Nodes/Twitch"
  externalIcon={<Twitch className="size-6" />}
  externalTitle="Interactive Demo"
/>

After
`,
    ctx,
  )
  assert.match(out, /\[デモを開く\]\(https:\/\/embed\.tiptap\.dev\/preview\/Nodes\/Twitch\)\n\nAfter/)
  assert.doesNotMatch(out, /externalTitle/)
})

test('Checklist はチェックボックスの箇条書きになる', () => {
  const out = convertMdx(
    `${frontmatter}
<Checklist>
  <CheckboxItem>Install Tiptap packages</CheckboxItem>
  <CheckboxItem>Test list functionality</CheckboxItem>
</Checklist>
`,
    ctx,
  )
  assert.match(out, /- \[ \] Install Tiptap packages\n- \[ \] Test list functionality\n/)
  assert.doesNotMatch(out, /Checklist/)
})

test('EnterpriseCalloutAuto は消える', () => {
  const out = convertMdx(`${frontmatter}\n<EnterpriseCalloutAuto variant="migration" renderMode="sidebar" disableWaitlist/>\n\nText\n`, ctx)
  assert.doesNotMatch(out, /EnterpriseCalloutAuto/)
  assert.match(out, /Text/)
})

test('翻訳対象のページへのリンクは相対パスになる（index とアンカーも扱う）', () => {
  const out = convertMdx(
    `${frontmatter}
- [Configure](/editor/getting-started/configure)
- [Concepts](/editor/core-concepts/introduction#schema)
- [Custom](/editor/extensions/custom-extensions)
`,
    ctx,
  )
  assert.match(out, /\[Configure\]\(\.\.\/configure\.md\)/)
  assert.match(out, /\[Concepts\]\(\.\.\/\.\.\/core-concepts\/introduction\.md#schema\)/)
  assert.match(out, /\[Custom\]\(\.\.\/\.\.\/extensions\/custom-extensions\/index\.md\)/)
})

test('翻訳対象外のサイト内リンクは公式サイトの URL になる', () => {
  const out = convertMdx(
    `${frontmatter}
[Vue](/editor/getting-started/install/vue3) and [Collab](/collaboration/getting-started/overview)
<Link href="/ui-components/overview">x</Link>
`,
    ctx,
  )
  assert.match(out, /\[Vue\]\(https:\/\/tiptap\.dev\/docs\/editor\/getting-started\/install\/vue3\)/)
  assert.match(out, /\[Collab\]\(https:\/\/tiptap\.dev\/docs\/collaboration\/getting-started\/overview\)/)
  assert.match(out, /href="https:\/\/tiptap\.dev\/docs\/ui-components\/overview"/)
})

test('同じページ内のアンカーリンクと外部リンクはそのまま', () => {
  const out = convertMdx(`${frontmatter}\n[a](#usage) [b](https://example.com/x)\n`, ctx)
  assert.match(out, /\[a\]\(#usage\) \[b\]\(https:\/\/example\.com\/x\)/)
})

test('toOutputPath は拡張子を .md にする', () => {
  assert.equal(toOutputPath('editor/a/index.mdx'), 'editor/a/index.md')
})
