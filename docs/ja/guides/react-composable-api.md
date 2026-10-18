# React の Composable API で Tiptap を使う

> 原文: [https://tiptap.dev/docs/guides/react-composable-api](https://tiptap.dev/docs/guides/react-composable-api)

Tiptap には宣言的な `<Tiptap>` コンポーネントがあります。エディタのセットアップを簡単にし、すべての子コンポーネントに自動でコンテキストを渡します。この Composable API は、フックを使う `useEditor` + `<EditorContent />` の方式に代わるもので、より React らしい書き方で Tiptap を扱えます。

## Composable API を使う場面

Composable API が向いているのは、次のような場合です。

- より宣言的な、コンポーネント中心の書き方をしたい
- 複数の子コンポーネントからエディタにアクセスする必要がある
- props を手で受け渡すより、コンテキストを自動で管理したい
- 複雑なエディタの UI（ツールバー、メニュー、サイドバー、ブロック）を作る

用途が単純な場合や、より直接的に制御したい場合は、[フックを使う useEditor の方式](../editor/getting-started/install/react.md)のほうが適しているかもしれません。

## インストール

Composable API を使う前に、React プロジェクトに Tiptap をインストールしておいてください。必要な依存関係は、[React のインストールガイド](../editor/getting-started/install/react.md)に従って用意します。

## Tiptap コンポーネントを使う

`<Tiptap>` コンポーネントはルートのプロバイダーです。React のコンテキストを通じて、すべての子コンポーネントからエディタのインスタンスを使えるようにします。

### 基本のセットアップ

新しい React コンポーネントを作り、`@tiptap/react` から `Tiptap` コンポーネントと `useEditor` をインポートします（メニューのコンポーネントは `@tiptap/react/menus` からインポートします）。

```tsx
// src/Editor.tsx
"use client"

import { Tiptap, useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  if (!editor) return null

  return (
    <Tiptap editor={editor}>
      <Tiptap.Content />

      <BubbleMenu editor={editor}>
        <button>Bold</button>
        <button>Italic</button>
      </BubbleMenu>

      <FloatingMenu editor={editor}>
        <button>Add heading</button>
      </FloatingMenu>
    </Tiptap>
  )
}

export default Editor
```

### 使えるサブコンポーネント

| コンポーネント | 説明 |
| --- | --- |
| `Tiptap.Content` | エディタのコンテンツ領域をレンダリングする。`<EditorContent editor={editor} />` の代わりに使う |

メニューのコンポーネントは、`@tiptap/react/menus` から別にインポートします。

## 子コンポーネントからエディタにアクセスする

Composable API の大きな利点の1つは、props のバケツリレーをせずに、子コンポーネントからエディタにアクセスできることです。

### useTiptap フックを使う

`useTiptap` フックは、コンテキストからエディタのインスタンスを返します。

```tsx
import { useTiptap } from '@tiptap/react'

function MenuBar() {
  const { editor } = useTiptap()

  if (!editor) return null

  return (
    <div className="menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
    </div>
  )
}
```

あとは、`<Tiptap>` コンポーネントの中の好きな場所にメニューバーを置きます。

```tsx
<Tiptap editor={editor}>
  <MenuBar />
  <Tiptap.Content />
</Tiptap>
```

### useTiptapState でリアクティブな状態を扱う

パフォーマンスが重要なコンポーネントでは、`useTiptapState` を使ってエディタの状態の特定の部分だけを購読します。関係のない状態が変わったときの不要な再レンダリングを防げます。

```tsx
import { useTiptapState } from '@tiptap/react'

function WordCount() {
  const { editor } = useTiptap()

  const wordCount = useTiptapState((state) => {
    const text = state.editor.state.doc.textContent
    return text.split(/\s+/).filter(Boolean).length
  })

  if (!editor) {
    return null
  }

  return <span>{wordCount} words</span>
}
```

セレクター関数は `EditorStateSnapshot` を受け取ります。コンポーネントが必要とするデータだけを返してください。コンポーネントは、選択した値が変わったときだけ再レンダリングされます。

## SSR（サーバーサイドレンダリング）

Composable API は SSR でも問題なく動きます。エディタのインスタンスはクライアントでしか作られないので、インスタンスができるまでレンダリングを止めておけます。

```tsx
"use client"

import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  if (!editor) {
    return <div className="skeleton">Loading editor...</div>
  }

  return (
    <Tiptap editor={editor}>
      <Tiptap.Content />
    </Tiptap>
  )
}
```

## パフォーマンスについて

Composable API はパフォーマンスを考えて設計されています。

- **コンテキストの自動最適化**: 不要な再レンダリングを防ぐため、エディタのコンテキストはメモ化される
- **必要な分だけの購読**: `useTiptapState` で、必要な状態だけを購読できる

パフォーマンスについてのそのほかのヒントは、[React のパフォーマンスガイド](performance.md)を参照してください。

## 後方互換性

`<Tiptap>` コンポーネントは `EditorContext` を自動で提供します。そのため、既存のコードとの後方互換性のために、その中で `useCurrentEditor` フックを使えます。

```tsx
import { useCurrentEditor } from '@tiptap/react'

function EditorJSONPreview() {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre>
}
```

ただし、新しく書くコードでは `useTiptap()` を使うことをおすすめします。

## API リファレンス

### Tiptap コンポーネント

React のコンテキストを通じてエディタのインスタンスを使えるようにする、ルートのプロバイダーコンポーネントです。

**Props:**

| Prop | 型 | 説明 |
| --- | --- | --- |
| `editor` | `Editor \| null` | `useEditor()` から得たエディタのインスタンス |
| `children` | `ReactNode` | 子コンポーネント |

**例:**

```tsx
<Tiptap editor={editor}>
  <Tiptap.Content />
</Tiptap>
```

### useTiptap フック

Tiptap のコンテキストの値を返します。

**戻り値:**

| プロパティ | 型 | 説明 |
| --- | --- | --- |
| `editor` | `Editor \| null` | エディタのインスタンス |

**例:**

```tsx
const { editor } = useTiptap()

if (!editor) return null
```

### useTiptapState フック

セレクター関数を使って、エディタの状態の一部を購読します。

**シグネチャ:**

```tsx
const value = useTiptapState(selector, equalityFn?)
```

**引数:**

| 引数 | 型 | 説明 |
| --- | --- | --- |
| `selector` | `(state: EditorStateSnapshot) => T` | 状態を選択する関数 |
| `equalityFn` | `(a: T, b: T) => boolean` | 再レンダリングを制御する等価判定の関数（任意） |

**例:**

```tsx
const isBold = useTiptapState((state) =>
  state.editor.isActive('bold')
)
```

## 比較: Composable API とフックを使う方式

| 機能 | Composable API | フックを使う方式 |
| --- | --- | --- |
| セットアップの手間 | 少ない（宣言的なコンポーネント） | 中程度（props を手で受け渡す） |
| コンテキストの管理 | 自動 | EditorContext.Provider で手動 |
| 子コンポーネントからのアクセス | `useTiptap()` で簡単 | props のバケツリレーかコンテキストが必要 |
| SSR への対応 | レンダリングを止める（`if (!editor)`） | 手動で null をチェック |
| パフォーマンス | `useTiptapState` で最適化 | `useEditorState` で最適化 |
| 向いている用途 | 子コンポーネントの多い複雑な UI | 単純な UI や、直接的な制御が必要な場合 |

## 次のステップ

- [React への組み込みを最適化する](performance.md)
- [エディタを設定する](../editor/getting-started/configure.md)
- [エディタにスタイルを付ける](../editor/getting-started/style-editor/index.md)
- [Tiptap の概念をさらに学ぶ](../editor/core-concepts/introduction.md)
