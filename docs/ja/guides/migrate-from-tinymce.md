# TinyMCE から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-tinymce](https://tiptap.dev/docs/guides/migrate-from-tinymce)

Tiptap は TinyMCE に代わる強力な選択肢です。TinyMCE から Tiptap への移行は難しくありません。このガイドでは、移行の手順を一つずつ説明します。

## コンテンツの移行

### HTML コンテンツの互換性

TinyMCE は通常コンテンツを HTML で保存するので、Tiptap へはそのまま移行できます。Tiptap は HTML コンテンツを変換せずに直接扱えます。

```ts
// 既存の TinyMCE のコンテンツ
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

TinyMCE の初期化処理を Tiptap に置き換えます。

```ts
// TinyMCE（移行前）
tinymce.init({
  selector: '#editor',
  plugins: 'lists link image table code',
  toolbar: 'undo redo | bold italic | bullist numlist | link image',
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

Tiptap はモジュール式の拡張機能の仕組みを採用しており、TinyMCE のプラグインアーキテクチャに似ています。機能ごとに拡張機能になっていて、それぞれ個別に設定できます。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### TinyMCE の主なプラグインに相当する拡張機能

| TinyMCE のプラグイン | Tiptap の拡張機能 | 備考 |
| -------------- | --------------------------------------- | ---------------------- |
| `lists`        | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| `link`         | `Link`                                  | StarterKit に含まれる |
| `image`        | `Image`                                 | 別途追加 |
| `table`        | `Table`                                 | 別途追加 |
| `code`         | `Code`, `CodeBlock`                     | StarterKit に含まれる |
| `textcolor`    | `TextStyle`, `Color`                    | 別途追加 |
| `fontsize`     | `TextStyle`, `FontSize`                 | 別途追加 |
| `align`        | `TextAlign`                             | 別途追加 |

### 拡張機能の設定

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

const editor = new Editor({
  extensions: [
    StarterKit,
    // 拡張機能を追加して設定する
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
  ],
})
```

### カスタム拡張機能

TinyMCE で自作したプラグインは、Tiptap のカスタム拡張機能として作り直せます。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

TinyMCE のツールバー設定は、Tiptap では独自の UI コンポーネントに置き換わります。

```tsx
// TinyMCE のツールバー設定
toolbar: 'undo redo | bold italic | bullist numlist'

// Tiptap での同等の実装（React の例）
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        Undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        Redo
      </button>
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
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントの利用を検討してください。

- すぐに使えるツールバーやメニューのコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### メニュー

TinyMCE のコンテキストメニューは、Tiptap の BubbleMenu と FloatingMenu に置き換えられます。

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

## 移行チェックリスト

- [ ] Tiptap のパッケージをインストールする
- [ ] TinyMCE の初期化処理を Tiptap のセットアップに置き換える
- [ ] TinyMCE のプラグインを Tiptap の拡張機能に対応づける
- [ ] ツールバー設定を独自の UI コンポーネントに移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラと API 呼び出しを更新する
- [ ] すべてのユースケースで念入りにテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
