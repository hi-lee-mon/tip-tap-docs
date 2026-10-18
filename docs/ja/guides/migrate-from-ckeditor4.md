# CKEditor 4 から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-ckeditor4](https://tiptap.dev/docs/guides/migrate-from-ckeditor4)

CKEditor 4 から Tiptap への移行は難しくありません。移行すれば、モダンなアーキテクチャと高い柔軟性が手に入ります。このガイドでは、移行の手順を一つずつ説明します。

## コンテンツの移行

### HTML コンテンツの互換性

CKEditor 4 はコンテンツを HTML で保存するので、Tiptap へはそのまま移行できます。Tiptap は HTML コンテンツを変換せずに直接扱えます。

```ts
// 既存の CKEditor 4 のコンテンツ
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

CKEditor 4 の初期化処理を Tiptap に置き換えます。

```ts
// CKEditor 4（移行前）
CKEDITOR.replace('editor', {
  toolbar: [
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
    { name: 'links', items: ['Link', 'Unlink'] },
  ],
  height: 300,
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

Tiptap は、CKEditor 4 のプラグインアーキテクチャに代わって、モジュール式の拡張機能の仕組みを採用しています。機能ごとに独立した拡張機能になっており、それぞれ設定やカスタマイズができます。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### CKEditor 4 の主なプラグインに相当する拡張機能

| CKEditor 4 のプラグイン | Tiptap の拡張機能 | 備考 |
| ----------------- | --------------------------------------- | ---------------------- |
| `basicstyles`     | `Bold`, `Italic`, `Underline`           | StarterKit に含まれる |
| `list`            | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| `link`            | `Link`                                  | StarterKit に含まれる |
| `image`           | `Image`                                 | 別途追加 |
| `table`           | `Table`                                 | 別途追加 |
| `sourcearea`      | `CodeBlock`                             | StarterKit に含まれる |
| `format`          | `Heading`                               | StarterKit に含まれる |
| `blockquote`      | `Blockquote`                            | StarterKit に含まれる |
| `justify`         | `TextAlign`                             | 別途追加 |
| `colorbutton`     | `TextStyle`, `Color`                    | 別途追加 |
| `font`            | `TextStyle`, `FontSize`                 | 別途追加 |
| `indentlist`      | リスト系の拡張機能に組み込み済み              | StarterKit に含まれる |
| `horizontalrule`  | `HorizontalRule`                        | StarterKit に含まれる |

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
import Underline from '@tiptap/extension-underline'

const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
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

CKEditor 4 で自作したプラグインは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

CKEditor 4 のツールバー設定は、Tiptap では独自の UI コンポーネントに置き換わります。

```tsx
// CKEditor 4 のツールバー設定
toolbar: [
  { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
  { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
  { name: 'links', items: ['Link', 'Unlink'] },
]

// Tiptap での同等の実装（React の例）
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
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        Unlink
      </button>
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントの利用を検討してください。

- すぐに使えるツールバーやメニューのコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

## 移行チェックリスト

1. Tiptap のパッケージをインストールする
2. CKEditor 4 の初期化処理を Tiptap のセットアップに置き換える
3. CKEditor 4 のプラグインを Tiptap の拡張機能に対応づける
4. ツールバー設定を独自の UI コンポーネントに移行する
5. コンテンツの互換性をテストする
6. 既存のコンテンツを JSON 形式に変換する（推奨）
7. 足りない機能はカスタム拡張機能として実装する
8. イベントハンドラと API 呼び出しを更新する
9. 画像を使っている場合は、アップロードと扱いをテストする
10. 表を使っている場合は、表の機能を確認する
11. ユーザー操作をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
