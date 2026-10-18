# CKEditor 5 から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-ckeditor5](https://tiptap.dev/docs/guides/migrate-from-ckeditor5)

CKEditor からの乗り換え先として、Tiptap は有力な選択肢です。CKEditor 5 から Tiptap への移行は難しくありません。このガイドでは、スムーズに移行するために知っておくべきことをすべて説明します。

## コンテンツの移行

### HTML コンテンツの互換性

CKEditor 5 は通常 HTML でコンテンツを出力します。Tiptap はこの HTML を変換せずに直接扱えます。

```ts
// 既存の CKEditor 5 のコンテンツ
const existingContent =
  '<p>Hello <strong>world</strong>!</p><ul><li>Item 1</li><li>Item 2</li></ul>'

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

CKEditor 5 の初期化処理を Tiptap に置き換えます。

```ts
// CKEditor 5（移行前）
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'

ClassicEditor.create(document.querySelector('#editor'), {
  plugins: [Essentials, Bold, Italic],
  toolbar: ['bold', 'italic'],
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

Tiptap はモジュール式の拡張機能の仕組みを採用しており、CKEditor 5 のプラグインアーキテクチャとよく似ています。機能ごとに独立した拡張機能になっており、それぞれ設定やカスタマイズができます。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### CKEditor 5 の主なプラグインに相当する拡張機能

| CKEditor 5 のプラグイン | Tiptap の拡張機能 | 備考 |
| ----------------- | --------------------------------------- | ---------------------- |
| `Bold`            | `Bold`                                  | StarterKit に含まれる |
| `Italic`          | `Italic`                                | StarterKit に含まれる |
| `List`            | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| `Link`            | `Link`                                  | StarterKit に含まれる |
| `Image`           | `Image`                                 | 別途追加 |
| `Table`           | `Table`                                 | 別途追加 |
| `CodeBlock`       | `CodeBlock`                             | StarterKit に含まれる |
| `Heading`         | `Heading`                               | StarterKit に含まれる |
| `Blockquote`      | `Blockquote`                            | StarterKit に含まれる |
| `Alignment`       | `TextAlign`                             | 別途追加 |
| `FontColor`       | `TextStyle`, `Color`                    | 別途追加 |
| `FontSize`        | `TextStyle`, `FontSize`                 | 別途追加 |

### 拡張機能の設定

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TextAlign from '@tiptap/extension-text-align'

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
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
})
```

### カスタム拡張機能

CKEditor 5 で自作したプラグインは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

CKEditor 5 のツールバー設定は、Tiptap では独自の UI コンポーネントに置き換わります。

```tsx
// CKEditor 5 のツールバー設定
toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList']

// Tiptap での同等の実装（React の例）
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
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
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
      </select>

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

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'active' : ''}
      >
        Bullet List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'active' : ''}
      >
        Numbered List
      </button>
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントを使ってください。

- すぐに使えるコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### バルーンエディタに相当する機能

CKEditor 5 のバルーンエディタは、Tiptap の BubbleMenu で再現できます。

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
- [ ] CKEditor 5 の初期化処理を Tiptap のセットアップに置き換える
- [ ] CKEditor 5 のプラグインを Tiptap の拡張機能に対応づける
- [ ] ツールバー設定を独自の UI コンポーネントに移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラと API 呼び出しを更新する
- [ ] バルーンメニューやバブルメニューを使っている場合は、その動作をテストする
- [ ] 画像のアップロードと扱いを確認する
- [ ] 表を使っている場合は、表の機能をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
