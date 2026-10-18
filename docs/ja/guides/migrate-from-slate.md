# Slate から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-slate](https://tiptap.dev/docs/guides/migrate-from-slate)

Tiptap は Slate の代替として広く使われており、Slate からの移行は難しくありません。このガイドでは、Slate の JSON 構造から Tiptap の拡張機能の仕組みへ移る手順を説明します。

## コンテンツの移行

### HTML コンテンツの互換性

Slate は独自の JSON 構造を使っているので、Tiptap で使うには変換が必要です。まず Slate のコンテンツを HTML にシリアライズします。

```ts
// Slate のシリアライズ機能で Slate の JSON を HTML に変換する
import { serialize } from 'slate-html-serializer'

const rules = [
  {
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p>{children}</p>
          case 'heading-one':
            return <h1>{children}</h1>
          case 'heading-two':
            return <h2>{children}</h2>
          // 必要に応じてブロックタイプを追加する
        }
      }
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          // 必要に応じてマークの種類を追加する
        }
      }
    },
  },
]

const htmlContent = serialize(slateValue, { rules })

// HTML コンテンツを Tiptap で使う
const editor = new Editor({
  content: htmlContent,
  extensions: [StarterKit],
})
```

Slate の構造が単純なら、Tiptap の JSON 形式へ直接対応づけられる場合もあります。

```ts
// Slate から Tiptap の JSON への変換例
function slateToTiptap(slateNodes) {
  return {
    type: 'doc',
    content: slateNodes.map((node) => {
      if (node.type === 'paragraph') {
        return {
          type: 'paragraph',
          content: node.children.map((child) => ({
            type: 'text',
            text: child.text,
            marks: child.bold ? [{ type: 'bold' }] : [],
          })),
        }
      }
      // ほかのノードタイプの対応づけを追加する
    }),
  }
}

const tiptapContent = slateToTiptap(slateValue.document.nodes)
const editor = new Editor({
  content: tiptapContent,
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

Slate のエディタを Tiptap に置き換えます。

```tsx
// Slate（移行前）
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const [editor] = useState(() => withReact(createEditor()))
const [value, setValue] = useState(initialValue)

return (
  <Slate editor={editor} value={value} onChange={setValue}>
    <Editable />
  </Slate>
)

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

Tiptap はモジュール式の拡張機能の仕組みを採用しており、Slate のプラグインの仕組みに似ています。機能ごとに独立した拡張機能になっていて、それぞれわかりやすい API と設定オプションを備えています。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### Slate の主なプラグインに相当する拡張機能

| Slate の概念 | Tiptap の拡張機能 | 備考 |
| ---------------- | --------------------------------------- | ---------------------- |
| 太字のマーク | `Bold`                                  | StarterKit に含まれる |
| 斜体のマーク | `Italic`                                | StarterKit に含まれる |
| 下線のマーク | `Underline`                             | StarterKit に含まれる |
| リンクのマーク | `Link`                                  | StarterKit に含まれる |
| 画像ブロック | `Image`                                 | 別途追加 |
| リストブロック | `BulletList`, `OrderedList`, `ListItem` | StarterKit に含まれる |
| 見出しブロック | `Heading`                               | StarterKit に含まれる |
| 引用ブロック | `Blockquote`                            | StarterKit に含まれる |
| コードブロック | `CodeBlock`                             | StarterKit に含まれる |
| 表ブロック | `Table`                                 | 別途追加 |

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

Slate で自作したプラグインは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

Slate で自作したツールバーコンポーネントは、Tiptap の UI コンポーネントに置き換わります。

```tsx
// Slate のツールバー（移行前）
const Toolbar = () => {
  const editor = useSlate()

  return (
    <div>
      <Button
        active={isMarkActive(editor, 'bold')}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, 'bold')
        }}
      >
        Bold
      </Button>
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

### ホバーツールバー

Slate のホバーツールバーは、Tiptap の BubbleMenu で再現できます。

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

### ノードビュー（カスタム要素）

Slate のカスタム要素は、Tiptap のノードビューに置き換えられます。ノードビューについて詳しくは[公式ガイド](../editor/extensions/custom-extensions/node-views/index.md)を参照してください。

```tsx
// Slate のカスタム要素（移行前）
const ImageElement = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <img src={element.url} />
      {children}
    </div>
  )
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
- [ ] Slate の JSON コンテンツを HTML または Tiptap の JSON に変換する
- [ ] Slate エディタの初期化処理を Tiptap のセットアップに置き換える
- [ ] Slate のプラグインを Tiptap の拡張機能に対応づける
- [ ] カスタム要素を[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)に移行する
- [ ] ツールバーのコンポーネントを Tiptap の UI に移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラと API 呼び出しを更新する
- [ ] ホバーツールバーの動作をテストする
- [ ] カスタム要素のレンダリングを確認する

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
