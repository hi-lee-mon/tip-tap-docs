# Editor.js から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-editorjs](https://tiptap.dev/docs/guides/migrate-from-editorjs)

Editor.js の置き換え先として、Tiptap は広く使われています。Editor.js から Tiptap への移行は難しくありません。このガイドでは、Editor.js のブロック単位の構造から Tiptap のドキュメントモデルへ移る手順を説明します。

## コンテンツの移行

### HTML コンテンツの互換性

Editor.js はブロック単位の JSON 構造を使っているので、Tiptap で使うには HTML に変換する必要があります。

```ts
// Editor.js のブロックを HTML に変換する
function editorJsToHtml(editorJsData) {
  let html = ''

  editorJsData.blocks.forEach((block) => {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${block.data.text}</p>`
        break
      case 'header':
        html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
        break
      case 'list':
        const listType = block.data.style === 'ordered' ? 'ol' : 'ul'
        const items = block.data.items.map((item) => `<li>${item}</li>`).join('')
        html += `<${listType}>${items}</${listType}>`
        break
      case 'quote':
        html += `<blockquote><p>${block.data.text}</p></blockquote>`
        break
      case 'code':
        html += `<pre><code>${block.data.code}</code></pre>`
        break
      case 'image':
        html += `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" />`
        break
      // 必要に応じてブロックタイプを追加する
    }
  })

  return html
}

// 変換した HTML を Tiptap で使う
const htmlContent = editorJsToHtml(editorJsData)
const editor = new Editor({
  content: htmlContent,
  extensions: [StarterKit],
})
```

Editor.js から出力した HTML がすでにあるなら、そのまま使えます。

```ts
// 既存の Editor.js の HTML コンテンツ
const existingContent = '<p>Hello <strong>world</strong>!</p>'

// Tiptap でそのまま使う
const editor = new Editor({
  content: existingContent,
  extensions: [StarterKit],
})
```

HTML でも問題なく動きますが、パフォーマンスと読みやすさの面から Tiptap の JSON 形式への変換をおすすめします。既存のコンテンツをまとめて変換するなら、[HTML ユーティリティ](../editor/api/utilities/html.md)を使ってプログラムで HTML を JSON に変換してください。

## エディタのセットアップ

### インストール

まず、Tiptap と依存パッケージをインストールします。

```bash
npm install @tiptap/core @tiptap/starter-kit
```

Tiptap は React や Vue など、モダンなフロントエンド UI フレームワークすべてに対応しています。フレームワークごとのインストール手順は[インストールガイド](../editor/getting-started/install/index.md)を参照してください。

### エディタの基本セットアップ

Editor.js の初期化処理を Tiptap に置き換えます。

```ts
// Editor.js（移行前）
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import Image from '@editorjs/image'

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    header: Header,
    list: List,
    quote: Quote,
    code: Code,
    image: Image,
  },
})

// Tiptap（移行後）
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
})
```

## 拡張機能

### Tiptap の拡張機能の仕組み

Tiptap はモジュール式の拡張機能の仕組みを採用しており、Editor.js のツール単位のアプローチとは考え方が異なります。Tiptap は独立したブロックの集まりではなく、ひと続きのドキュメントモデルを扱い、書式や機能は拡張機能が提供します。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### Editor.js の主なツールに相当する拡張機能

| Editor.js のツール | Tiptap の拡張機能 | 備考 |
| --------------------- | --------------------------------------- | ---------------------- |
| `@editorjs/paragraph` | `Paragraph`                             | StarterKit に含まれる |
| `@editorjs/header`    | `Heading`                               | StarterKit に含まれる |
| `@editorjs/list`      | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| `@editorjs/quote`     | `Blockquote`                            | StarterKit に含まれる |
| `@editorjs/code`      | `CodeBlock`                             | StarterKit に含まれる |
| `@editorjs/image`     | `Image`                                 | 別途追加 |
| `@editorjs/table`     | `Table`                                 | 別途追加 |
| `@editorjs/link`      | `Link`                                  | StarterKit に含まれる |
| `@editorjs/marker`    | `Highlight`                             | 別途追加 |
| `@editorjs/delimiter` | `HorizontalRule`                        | StarterKit に含まれる |

### 拡張機能の設定

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Highlight from '@tiptap/extension-highlight'

const editor = new Editor({
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Highlight.configure({
      multicolor: true,
    }),
  ],
})
```

### カスタム拡張機能

Editor.js で自作したツールは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

Editor.js のインラインツールバーは、Tiptap のツールバーコンポーネントで再現できます。

```tsx
// Tiptap のツールバー（React の例）
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'active' : ''}
      >
        Underline
      </button>
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントを使ってください。

- すぐに使えるコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### インラインツールバー（Editor.js 風）

Editor.js のインラインツールバーは、Tiptap の BubbleMenu で再現できます。

```tsx
import { BubbleMenu } from '@tiptap/react'

function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
  })

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
      </BubbleMenu>
    </>
  )
}
```

### ブロック単位の UI（別のアプローチ）

Editor.js のようなブロック単位の操作感が好みなら、[ブロックエディタのテンプレート](https://tiptap.dev/docs/ui-components/getting-started/overview)（近日公開）を使ってください。Notion のようなブロック単位のテキストエディタの UI が、追加の作業なしで手に入ります。

## 移行チェックリスト

- [ ] Tiptap のパッケージをインストールする
- [ ] Editor.js の JSON コンテンツを HTML に変換する
- [ ] Editor.js の初期化処理を Tiptap のセットアップに置き換える
- [ ] Editor.js のツールを Tiptap の拡張機能に対応づける
- [ ] 自作のツールをカスタム拡張機能または[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)に移行する
- [ ] ツールバーの UI コンポーネントを実装する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラと API 呼び出しを更新する
- [ ] インラインツールバーの動作をテストする
- [ ] 画像のアップロードと扱いを確認する
- [ ] ブロック固有の機能（引用、コードブロックなど）をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
