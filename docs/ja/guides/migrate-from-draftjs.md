# Draft.js から Tiptap へ移行する

> 原文: [https://tiptap.dev/docs/guides/migrate-from-draftjs](https://tiptap.dev/docs/guides/migrate-from-draftjs)

Tiptap は Draft.js の代替として広く使われており、Draft.js からの移行は難しくありません。このガイドでは、Draft.js のイミュータブルな状態モデルから Tiptap の拡張機能の仕組みへ移る手順を説明します。

## コンテンツの移行

### HTML コンテンツの互換性

Draft.js は ContentState を使っているので、Tiptap で使うには HTML に変換する必要があります。

```ts
// Draft.js の ContentState を HTML に変換する
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// ContentState がある場合
const htmlContent = stateToHTML(contentState)

// raw state（JSON）がある場合
const contentState = convertFromRaw(rawContentState)
const htmlContent = stateToHTML(contentState)

// HTML コンテンツを Tiptap で使う
const editor = new Editor({
  content: htmlContent,
  extensions: [StarterKit],
})
```

Draft.js から出力した HTML がすでにあるなら、そのまま使えます。

```ts
// 既存の Draft.js の HTML コンテンツ
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

Draft.js のエディタを Tiptap に置き換えます。

```tsx
// Draft.js（移行前）
import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'

function MyDraftEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      handleKeyCommand={handleKeyCommand}
    />
  )
}

// Tiptap（移行後）
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function MyTiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  return <EditorContent editor={editor} />
}
```

## 拡張機能

### Tiptap の拡張機能の仕組み

Tiptap はモジュール式の拡張機能の仕組みを採用しており、Draft.js のエンティティとデコレーターの仕組みに似ています。機能ごとに独立した拡張機能になっていて、それぞれわかりやすい API を備えています。

[StarterKit](../editor/extensions/functionality/starterkit.md) は基本的な拡張機能をひとまとめにしたものです。必要に応じて、ほかの拡張機能を追加したり外したりできます。

利用できる拡張機能はすべて[拡張機能ガイド](../editor/extensions/overview.md)で確認できます。独自の機能や HTML 要素に対応したい場合は、[拡張機能を自作](../editor/extensions/custom-extensions/index.md)してください。

### Draft.js の主な機能に相当する拡張機能

| Draft.js の機能 | Tiptap の拡張機能 | 備考 |
| ---------------------- | ------------------------- | ---------------------- |
| 太字のインラインスタイル | `Bold`                    | StarterKit に含まれる |
| 斜体のインラインスタイル | `Italic`                  | StarterKit に含まれる |
| 下線のインラインスタイル | `Underline`               | StarterKit に含まれる |
| コードのインラインスタイル | `Code`                    | StarterKit に含まれる |
| リンクのエンティティ | `Link`                    | StarterKit に含まれる |
| 画像のエンティティ | `Image`                   | 別途追加 |
| 見出しブロック | `Heading`                 | StarterKit に含まれる |
| 引用ブロック | `Blockquote`              | StarterKit に含まれる |
| コードブロック | `CodeBlock`               | StarterKit に含まれる |
| 箇条書きリスト | `BulletList`, `ListItem`  | StarterKit に含まれる |
| 番号付きリスト | `OrderedList`, `ListItem` | StarterKit に含まれる |

### 拡張機能の設定

```ts
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    TextStyle,
    Color.configure({
      types: [TextStyle.name],
    }),
    Highlight.configure({
      multicolor: true,
    }),
  ],
})
```

### カスタム拡張機能

Draft.js で自作したエンティティやデコレーターは、Tiptap のカスタム拡張機能として作り直します。詳しい手順は[カスタム拡張機能ガイド](../editor/extensions/custom-extensions/index.md)を参照してください。

## UI の実装

### ツールバーの実装

Draft.js の RichUtils を使ったツールバーは、Tiptap の UI コンポーネントに置き換わります。

```tsx
// Draft.js のツールバー（移行前）
import { RichUtils } from 'draft-js'

function DraftToolbar({ editorState, onChange }) {
  const toggleInlineStyle = (style) => {
    onChange(RichUtils.toggleInlineStyle(editorState, style))
  }

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType))
  }

  return (
    <div>
      <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
      <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
      <button onClick={() => toggleBlockType('header-one')}>H1</button>
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
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
      >
        H1
      </button>
    </div>
  )
}
```

### 既製の UI コンポーネント

開発を速く進めたいなら、Tiptap の既製 UI コンポーネントを使ってください。

- すぐに使えるコンポーネントは [UI コンポーネント](https://tiptap.dev/docs/ui-components/getting-started/overview)にあります
- 実践的な例は[デフォルトのテキストエディタの例](https://tiptap.dev/docs/examples/basics/default-text-editor)で確認できます

### インラインツールバー

Draft.js のインラインスタイル操作に近いインラインツールバーを作れます。

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
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
        >
          Underline
        </button>
      </BubbleMenu>
    </>
  )
}
```

### エンティティの置き換え（ノードビュー）

Draft.js のエンティティは、Tiptap の[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)に置き換えられます。

```tsx
// Draft.js のエンティティ（移行前）
const LinkEntity = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return <a href={url}>{props.children}</a>
}

// Tiptap のノードビュー（移行後）
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

const LinkComponent = ({ node }) => {
  return <a href={node.attrs.href}>{node.textContent}</a>
}

const CustomLink = Node.create({
  name: 'customLink',

  addNodeView() {
    return ReactNodeViewRenderer(LinkComponent)
  },
})
```

## 移行チェックリスト

- [ ] Tiptap のパッケージをインストールする
- [ ] Draft.js の ContentState を HTML に変換する
- [ ] Draft.js のエディタを Tiptap のセットアップに置き換える
- [ ] Draft.js のインラインスタイルを Tiptap のマークに対応づける
- [ ] Draft.js のブロックタイプを Tiptap のノードに対応づける
- [ ] エンティティを[ノードビュー](../editor/extensions/custom-extensions/node-views/index.md)または拡張機能に移行する
- [ ] ツールバーのコンポーネントを Tiptap の UI に移行する
- [ ] コンテンツの互換性をテストする
- [ ] 既存のコンテンツを JSON 形式に変換する（推奨）
- [ ] 足りない機能はカスタム拡張機能として実装する
- [ ] イベントハンドラとキーコマンドを更新する
- [ ] インラインツールバーの動作をテストする
- [ ] リンクと画像の扱いを確認する
- [ ] リストの動作をテストする

## 次のステップ

- [拡張機能の概要](../editor/extensions/overview.md)で、利用できる拡張機能をすべて確認する
- 高度なカスタマイズのために[カスタム拡張機能](../editor/extensions/custom-extensions/index.md)について学ぶ
- 実装のヒントとして[サンプル](https://tiptap.dev/docs/examples)を見る
- 最適化のコツは[パフォーマンスガイド](performance.md)を確認する
