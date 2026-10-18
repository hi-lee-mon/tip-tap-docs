# Markdown の使用例

> 原文: [https://tiptap.dev/docs/editor/markdown/examples](https://tiptap.dev/docs/editor/markdown/examples)

Markdown 拡張機能のよくある使い方について、実践的な例とレシピを紹介します。

## 基本の例

### Markdown を読み書きする

Markdown でよく使う操作をまとめた例です。

```typescript
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit, Markdown],
  content: '# Hello World\n\nStart typing...',
  contentType: 'markdown', // 初期コンテンツを Markdown としてパースする
})

// 読み取り: エディタの現在のコンテンツを Markdown にシリアライズする
console.log(editor.getMarkdown())

// 書き込み: Markdown 文字列からエディタのコンテンツを設定する
editor.commands.setContent('# New title\n\nSome *Markdown* content', { contentType: 'markdown' })
```

---

### 貼り付けた Markdown を検出する

貼り付けられた Markdown を自動で検出してパースします。

```typescript
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { Plugin } from '@tiptap/pm/state'

const PasteMarkdown = Extension.create({
  name: 'pasteMarkdown',

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      new Plugin({
        props: {
          handlePaste(view, event, slice) {
            const text = event.clipboardData?.getData('text/plain')

            if (!text) {
              return false
            }

            // テキストが Markdown らしいかを確かめる
            if (editor.markdown && looksLikeMarkdown(text)) {
              const { state, dispatch } = view
              // Markdown マネージャーで、Markdown テキストを Tiptap JSON にパースする
              const json = editor.markdown.parse(text)

              // パースした JSON コンテンツをカーソル位置に挿入する
              editor.commands.insertContent(json)
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})

function looksLikeMarkdown(text: string): boolean {
  // 簡単な経験則: Markdown の記法があるかを確かめる
  return (
    /^#{1,6}\s/.test(text) || // 見出し
    /\*\*[^*]+\*\*/.test(text) || // 太字
    /\[.+\]\(.+\)/.test(text) || // リンク
    /^[-*+]\s/.test(text)
  ) // リスト
}

const editor = new Editor({
  extensions: [StarterKit, Markdown, PasteMarkdown],
})
```

## カスタムトークナイザー

### 下付き文字と上付き文字

`~subscript~` と `^superscript^` に対応させます。

```typescript
import { Mark } from '@tiptap/core'

export const Subscript = Mark.create({
  name: 'subscript',

  parseHTML() {
    return [{ tag: 'sub' }]
  },

  renderHTML() {
    return ['sub', 0]
  },

  markdownTokenName: 'subscript',

  parseMarkdown: (token, helpers) => {
    const content = helpers.parseInline(token.tokens || [])
    return helpers.applyMark('subscript', content)
  },

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [])
    return `~${content}~`
  },

  markdownTokenizer: {
    name: 'subscript',
    level: 'inline',
    start: (src) => src.indexOf('~'),
    tokenize: (src, tokens, lexer) => {
      const match = /^~([^~]+)~/.exec(src)
      if (!match) return undefined

      return {
        type: 'subscript',
        raw: match[0], // マッチ全体: ~text~
        text: match[1], // 中身: text
        tokens: lexer.inlineTokens(match[1]), // 入れ子のインライン書式をパースする
      }
    },
  },
})

export const Superscript = Mark.create({
  name: 'superscript',

  parseHTML() {
    return [{ tag: 'sup' }]
  },

  renderHTML() {
    return ['sup', 0]
  },

  markdownTokenName: 'superscript',

  parseMarkdown: (token, helpers) => {
    const content = helpers.parseInline(token.tokens || [])
    return helpers.applyMark('superscript', content)
  },

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [])
    return `^${content}^`
  },

  markdownTokenizer: {
    name: 'superscript',
    level: 'inline',
    start: (src) => src.indexOf('^'),
    tokenize: (src, tokens, lexer) => {
      const match = /^\^([^^]+)\^/.exec(src)
      if (!match) return undefined

      return {
        type: 'superscript',
        raw: match[0], // マッチ全体: ^text^
        text: match[1], // 中身: text
        tokens: lexer.inlineTokens(match[1]), // 入れ子のインライン書式をパースする
      }
    },
  },
})
```

使い方:

```typescript
editor.commands.setContent('H~2~O and E = mc^2^', { contentType: 'markdown' })
```

## 組み込みの例

### Markdown のリアルタイムプレビュー

エディタの更新を監視すれば、Markdown のリアルタイムプレビューを作れます。

```typescript
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'

const editor = new Editor({
  extensions: [StarterKit, Markdown],
  content: '# Hello',
  onUpdate: ({ editor }) => {
    const markdown = editor.getMarkdown()
    updatePreview(markdown) // プレビューを更新する自前の関数
  },
})

function updatePreview(markdown) {
  document.querySelector('#preview').textContent = markdown
}
```

### 保存と読み込みの流れ

コンテンツを Markdown で保存しておき、必要なときに読み込みます。

```typescript
// データベースやストレージに保存する
async function saveContent() {
  const markdown = editor.getMarkdown()
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content: markdown }),
  })
}

// データベースやストレージから読み込む
async function loadContent() {
  const { content } = await fetch('/api/load').then((r) => r.json())
  editor.commands.setContent(content, { contentType: 'markdown' })
}
```

## サーバーサイドレンダリング

サーバーで Markdown をレンダリングします。

```typescript
import StarterKit from '@tiptap/starter-kit'
import { MarkdownManager } from '@tiptap/markdown'
import { generateHTML } from '@tiptap/html'

const markdownManager = new MarkdownManager({
  extensions: [StarterKit, Markdown], // Markdown 拡張機能を含める
})

// サーバーで Markdown を JSON にパースする
function parseMarkdown(markdown: string) {
  return markdownManager.parse(markdown)
}

// レンダリングのために JSON を HTML に変換する
function renderToHTML(json: JSONContent) {
  // Tiptap JSON から HTML を生成する（ここでは Markdown は関わらない）
  return generateHTML(json, [StarterKit])
}

// 全体の流れ: Markdown → JSON → HTML
function markdownToHTML(markdown: string) {
  const json = parseMarkdown(markdown) // Markdown を JSON にパースする
  return renderToHTML(json) // JSON を HTML にレンダリングする
}

// Express のルートの例
app.get('/document/:id', async (req, res) => {
  const doc = await db.getDocument(req.params.id)
  const json = parseMarkdown(doc.markdown) // 保存済みの Markdown をパースする
  const html = renderToHTML(json) // 表示用に HTML に変換する

  res.render('document', { content: html })
})
```

---

## 高度なパターン

### 大きなドキュメントの遅延読み込み

大きなドキュメントを少しずつ読み込みます。

```typescript
async function loadLargeDocument(documentId: string) {
  // 先にメタデータを読み込む
  const meta = await fetchDocumentMeta(documentId)

  // スケルトンを表示する
  showSkeleton()

  // チャンクに分けて読み込む
  const chunks = await fetchDocumentChunks(documentId, meta.chunkCount)

  // Markdown のチャンクをそれぞれパースし、正しい位置に挿入する
  for (const chunk of chunks) {
    const json = editor.markdown.parse(chunk.markdown) // Markdown を JSON にパースする
    editor.commands.insertContentAt(chunk.position, json) // 指定した位置に挿入する
  }

  hideSkeleton()
}
```
