# Quill から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-quill](https://tiptap.dev/docs/guides/migrate-from-quill)

Tiptap は Quill の代替として広く使われており、Quill からの移行は難しくありません。このガイドでは、Quill の Delta 形式から Tiptap の拡張機能の仕組みへスムーズに移る手順を説明します。

## コンテンツの移行

### HTML コンテンツの互換性

Quill はコンテンツの保存に Delta 形式を使っているので、Tiptap で使うには HTML に変換する必要があります。

```ts
// まず Quill の Delta を HTML に変換する
const quill = new Quill('#temp-editor')
quill.setContents(existingDeltaContent)
const htmlContent = quill.root.innerHTML

// HTML コンテンツを Tiptap で使う
const editor = new Editor({
  content: htmlContent,
  extensions: [StarterKit],
})
```

Quill から出力した HTML がすでにあるなら、そのまま使えます。

```ts
// 既存の Quill の HTML コンテンツ
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

Quill の初期化処理を Tiptap に置き換えます。

```ts
// Quill（移行前）
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, false] }],
    ],
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

Tiptap はモジュール式の拡張機能の仕組みを採用しており、Quill のモジュールの仕組みに似ています。機能ごとに独立した拡張機能になっており、それぞれ設定やカスタマイズができます。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### Quill の主なモジュールに相当する拡張機能

| Quill の機能 | Tiptap の拡張機能 | 備考 |
| --------------------- | --------------------------------------- | ---------------------- |
| 太字 | `Bold`                                  | StarterKit に含まれる |
| 斜体 | `Italic`                                | StarterKit に含まれる |
| 下線 | `Underline`                             | StarterKit に含まれる |
| リンク | `Link`                                  | StarterKit に含まれる |
| 画像 | `Image`                                 | 別途追加 |
| リスト（箇条書き／番号付き） | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| 見出し | `Heading`                               | StarterKit に含まれる |
| 引用 | `Blockquote`                            | StarterKit に含まれる |
| コードブロック | `CodeBlock`                             | StarterKit に含まれる |
| 取り消し線 | `Strike`                                | StarterKit に含まれる |
| 文字色 | `TextStyle`, `Color`                    | 別途追加 |
| 背景色 | `TextStyle`, `Highlight`                | 別途追加 |
| 配置 | `TextAlign`                             | 別途追加 |

### 拡張機能の設定

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

const editor = new Editor({
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color.configure({
      types: [TextStyle.name, ListItem.name],
    }),
  ],
})
```

### カスタム拡張機能

Quill で自作したモジュールや Blot は、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

Quill のツールバー設定は、Tiptap では独自の UI コンポーネントに置き換わります。

```tsx
// Quill のツールバー設定
toolbar: [
  ['bold', 'italic', 'underline'],
  ['link', 'image'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [1, 2, 3, false] }],
]

// Tiptap での同等の実装（React の例）
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <div className="toolbar-group">
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

      <div className="toolbar-group">
        <button
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'active' : ''}
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Image URL')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
        >
          Image
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
        >
          Numbered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
        >
          Bullet List
        </button>
      </div>

      <div className="toolbar-group">
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value)
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
          value={
            editor.isActive('heading', { level: 1 })
              ? 1
              : editor.isActive('heading', { level: 2 })
                ? 2
                : editor.isActive('heading', { level: 3 })
                  ? 3
                  : 0
          }
        >
          <option value={0}>Normal</option>
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
        </select>
      </div>
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントを使ってください。

- すぐに使えるコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### バブルツールバー（Quill の bubble テーマ）

Quill の bubble テーマは、Tiptap の BubbleMenu で再現できます。

```tsx
import { BubbleMenu, useEditor } from '@tiptap/react'

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
        <button
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'active' : ''}
        >
          Link
        </button>
      </BubbleMenu>
    </>
  )
}
```

## 移行チェックリスト

- [ ] Tiptap のパッケージをインストールする
- [ ] Quill の Delta コンテンツを HTML に変換する
- [ ] Quill の初期化処理を Tiptap のセットアップに置き換える
- [ ] Quill のモジュールを Tiptap の拡張機能に対応づける
- [ ] ツールバー設定を独自の UI コンポーネントに移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラと API 呼び出しを更新する
- [ ] bubble テーマを使っている場合は、バブルメニューの動作をテストする
- [ ] 画像のアップロードと扱いを確認する
- [ ] 書式とスタイルの機能をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
