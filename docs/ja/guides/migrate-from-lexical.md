# Lexical から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-lexical](https://tiptap.dev/docs/guides/migrate-from-lexical)

Lexical のエディタを、Tiptap のようなより優れた選択肢に置き換えましょう。Lexical から Tiptap への移行は難しくありません。このガイドでは、Lexical のノード中心のアーキテクチャから Tiptap の拡張機能の仕組みへ移る手順を説明します。

## コンテンツの移行

### HTML コンテンツの互換性

Lexical は独自の JSON 構造を使っているので、Tiptap で使うには変換が必要です。Lexical のコンテンツは HTML にシリアライズできます。

```ts
// Lexical の JSON を HTML に変換する
import { $generateHtmlFromNodes } from '@lexical/html'
import { $getRoot } from 'lexical'

// Lexical のエディタインスタンスがある前提
const htmlContent = editor.update(() => {
  const root = $getRoot()
  return $generateHtmlFromNodes(editor, root)
})

// HTML コンテンツを Tiptap で使う
const tiptapEditor = new Editor({
  content: htmlContent,
  extensions: [StarterKit],
})
```

Lexical から出力した HTML がすでにあるなら、そのまま使えます。

```ts
// 既存の Lexical の HTML コンテンツ
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

Lexical のエディタを Tiptap に置き換えます。

```tsx
// Lexical（移行前）
import { createEditor } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

const initialConfig = {
  namespace: 'MyEditor',
  theme: {},
  onError: console.error,
}

function MyLexicalEditor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
      />
    </LexicalComposer>
  )
}

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

Tiptap はモジュール式の拡張機能の仕組みを採用しており、Lexical のノードとプラグインのアーキテクチャに似ています。機能ごとに独立した拡張機能になっていて、それぞれわかりやすい API を備えています。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### Lexical の主なプラグインに相当する拡張機能

| Lexical のプラグイン／ノード | Tiptap の拡張機能 | 備考 |
| -------------------- | --------------------------------------- | ---------------------- |
| `@lexical/rich-text` | `Bold`, `Italic`                        | StarterKit に含まれる |
| `@lexical/link`      | `Link`                                  | StarterKit に含まれる |
| `@lexical/list`      | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| `@lexical/code`      | `Code`, `CodeBlock`                     | StarterKit に含まれる |
| `@lexical/table`     | `Table`                                 | 別途追加 |
| `HeadingNode`        | `Heading`                               | StarterKit に含まれる |
| `QuoteNode`          | `Blockquote`                            | StarterKit に含まれる |
| `ImageNode`          | `Image`                                 | 別途追加 |
| `@lexical/history`   | `History`                               | StarterKit に含まれる |
| `@lexical/text`      | `TextStyle`, `Color`                    | 別途追加 |

### 拡張機能の設定

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

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
    TextStyle,
    Color.configure({
      types: [TextStyle.name],
    }),
  ],
})
```

### カスタム拡張機能

Lexical で自作したノードやプラグインは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

Lexical のツールバープラグインは、Tiptap では独自の UI コンポーネントに置き換わります。

```tsx
// Lexical のツールバー（移行前）
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FORMAT_TEXT_COMMAND } from 'lexical'

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  return (
    <div>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
      >
        Bold
      </button>
    </div>
  )
}

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
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントを使ってください。

- すぐに使えるコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### フローティングツールバー

Lexical のフローティングツールバーは、Tiptap の BubbleMenu で再現できます。

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

### ノードビュー（カスタムノード）

Lexical のカスタムノードは、Tiptap の[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)に置き換えられます。

```tsx
// Lexical のカスタムノード（移行前）
class ImageNode extends DecoratorNode {
  static getType() {
    return 'image'
  }

  createDOM() {
    const img = document.createElement('img')
    img.src = this.__src
    return img
  }
}

// Tiptap のノードビュー（移行後）
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

const ImageComponent = ({ node }) => {
  return <img src={node.attrs.src} />
}

const CustomImage = Node.create({
  name: 'customImage',

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
})
```

## 移行チェックリスト

- [ ] Tiptap のパッケージをインストールする
- [ ] Lexical の JSON コンテンツを HTML に変換する
- [ ] Lexical エディタの初期化処理を Tiptap のセットアップに置き換える
- [ ] Lexical のプラグインを Tiptap の拡張機能に対応づける
- [ ] カスタムノードを[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)に移行する
- [ ] ツールバープラグインを Tiptap の UI コンポーネントに移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラとコマンドのディスパッチ処理を更新する
- [ ] フローティングツールバーの動作をテストする
- [ ] 表を使っている場合は、表の機能を確認する
- [ ] 履歴（元に戻す／やり直す）の動作をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
