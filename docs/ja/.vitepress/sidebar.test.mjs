import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSidebar } from './sidebar.mjs'

const titles = {
  'editor/core-concepts/introduction.md': 'Tiptap の基本概念',
  'editor/core-concepts/schema.md': 'Tiptap のスキーマ',
  'editor/extensions/nodes/index.md': 'ノード',
  'editor/extensions/nodes/heading.md': 'Heading 拡張機能',
  'editor/extensions/overview.md': '拡張機能の概要',
}
const readTitle = (p) => titles[p]

test('セクションごとにグループができ、ページはタイトルとリンクで並ぶ', () => {
  const sidebar = buildSidebar(
    [['editor/core-concepts', 'コア概念']],
    ['editor/core-concepts/schema.md', 'editor/core-concepts/introduction.md'],
    readTitle,
  )
  assert.deepEqual(sidebar, [
    {
      text: 'コア概念',
      collapsed: true,
      items: [
        { text: 'Tiptap の基本概念', link: '/editor/core-concepts/introduction' },
        { text: 'Tiptap のスキーマ', link: '/editor/core-concepts/schema' },
      ],
    },
  ])
})

test('サブフォルダは index.md のタイトルを持つ入れ子のグループになる', () => {
  const [section] = buildSidebar(
    [['editor/extensions', '拡張機能']],
    ['editor/extensions/nodes/heading.md', 'editor/extensions/overview.md', 'editor/extensions/nodes/index.md'],
    readTitle,
  )
  assert.deepEqual(section.items, [
    {
      text: 'ノード',
      link: '/editor/extensions/nodes/',
      collapsed: true,
      items: [{ text: 'Heading 拡張機能', link: '/editor/extensions/nodes/heading' }],
    },
    { text: '拡張機能の概要', link: '/editor/extensions/overview' },
  ])
})

test('除外したページは未翻訳と分かる名前で公式サイトへリンクし、タイトルは読まない', () => {
  const read = []
  const [section] = buildSidebar(
    [['editor/core-concepts', 'コア概念']],
    ['editor/core-concepts/keyboard-shortcuts.md'],
    (p) => (read.push(p), 'x'),
    (p) => p.includes('key'),
  )
  assert.deepEqual(section.items, [
    {
      text: 'keyboard-shortcuts（未翻訳・原文）',
      link: 'https://tiptap.dev/docs/editor/core-concepts/keyboard-shortcuts',
    },
  ])
  assert.deepEqual(read, [])
})
