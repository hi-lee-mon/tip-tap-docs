import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { buildSidebar } from './sidebar.mjs'

const root = resolve(import.meta.dirname, '..')

// 権限設定（名前に key / token を含むファイルの読み取り禁止）で訳せなかったページ
const isExcluded = (relPath: string) => /key|token/.test(relPath)

const SECTIONS: [string, string][] = [
  ['editor/getting-started', 'はじめに'],
  ['editor/core-concepts', 'コア概念'],
  ['editor/extensions', '拡張機能'],
  ['editor/api', 'API'],
  ['editor/markdown', 'Markdown'],
  ['guides', 'ガイド'],
]

const files = ['editor', 'guides']
  .flatMap((s) => readdirSync(join(root, s), { recursive: true }).map((f) => join(s, String(f))))
  .filter((f) => f.endsWith('.md'))

const readTitle = (relPath: string) =>
  readFileSync(join(root, relPath), 'utf8').split('\n')[0].replace(/^#\s*/, '')

export default defineConfig({
  // GitHub Pages ではリポジトリ名のパスの下に公開される
  base: '/tip-tap-docs/',
  lang: 'ja',
  title: 'Tiptap ドキュメント 日本語訳',
  description: 'Tiptap 公式ドキュメント（Editor・Guides）の日本語訳',
  rewrites: { 'README.md': 'index.md' },
  srcExclude: ['**/*key*', '**/*token*'],
  // ADR は docs/ja の外にあり、localhost は手順中に開くアドレスなので、どちらもサイト内には存在しない
  ignoreDeadLinks: [/key/, /token/, /\/adr\//, /LICENSE$/, /^https?:\/\/localhost/],
  themeConfig: {
    nav: [
      { text: '対訳表', link: '/GLOSSARY' },
      { text: '原文（英語）', link: 'https://tiptap.dev/docs/editor/getting-started/overview' },
    ],
    sidebar: buildSidebar(SECTIONS, files, readTitle, isExcluded),
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'このページの内容' },
    docFooter: { prev: '前のページ', next: '次のページ' },
  },
})
