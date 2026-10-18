# React

> 原文: [https://tiptap.dev/docs/editor/getting-started/install/react](https://tiptap.dev/docs/editor/getting-started/install/react)

React のプロジェクトに Tiptap を組み込む方法を説明します。ここでは Vite を使いますが、ほかの構成でも流れはほぼ同じです。

[デモを開く](https://embed.tiptap.dev/preview/Examples/Default)

## React のプロジェクトを作る（任意）

`my-tiptap-project` という名前の React プロジェクトを新しく作るところから始めます。必要なものは [Vite](https://vitejs.dev/guide/) がすべて用意してくれます。

```bash
# npm でプロジェクトを作る
npm create vite@latest my-tiptap-project -- --template react-ts

# または pnpm でプロジェクトを作る
pnpm create vite@latest my-tiptap-project --template react-ts

# または yarn でプロジェクトを作る
yarn create vite my-tiptap-project --template react-ts

# ディレクトリを移動する
cd my-tiptap-project
```

## Tiptap の依存パッケージをインストールする

次に、`@tiptap/react` パッケージ、`@tiptap/pm`（ProseMirror のライブラリ）、`@tiptap/starter-kit` をインストールします。`@tiptap/starter-kit` には、すぐに始めるためのよく使う拡張機能が入っています。

- **@tiptap/react**: Tiptap の React バインディング。Tiptap のコア機能も含みます。
- **@tiptap/pm**: Tiptap が依存する ProseMirror のパッケージ。エディタが動くのに必要です。
- **@tiptap/starter-kit**: よく使う拡張機能のセット。段落、見出し、太字、斜体などの基本機能を提供します。

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

手順1と2を済ませたら、`npm run dev` でプロジェクトを起動し、ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## React アプリに Tiptap を組み込む

> [!TIP]
> **新機能: React Composable API**
>
> Tiptap に、宣言的に書ける `<Tiptap>` コンポーネントが加わりました。コンテキストを自動で管理し、サブコンポーネントも組み込まれています。子コンポーネントが多い複雑な UI に最適です。[詳しく見る →](../../../guides/react-composable-api.md)

Tiptap を使い始めるには、新しいコンポーネントを作ります。名前は `Tiptap` とし、`src/Tiptap.tsx` に次のコードを書きます。

```jsx
// src/Tiptap.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit], // 拡張機能の配列を定義する
    content: '<p>Hello World!</p>', // 最初のコンテンツ
  })

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  )
}

export default Tiptap
```

### アプリに追加する

最後に、`src/App.tsx` の中身を、新しく作った `Tiptap` コンポーネントに置き換えます。

```jsx
import Tiptap from './Tiptap'

const App = () => {
  return (
    <div className="card">
      <Tiptap />
    </div>
  )
}

export default App
```

## EditorContext を使う

Tiptap には `EditorContext` という React のコンテキストがあります。これを使うと、コンポーネントツリーのどこからでもエディタのインスタンスとその状態にアクセスできます。独自のツールバーやメニューなど、エディタとやり取りするコンポーネントを作るときに特に便利です。

```jsx
// src/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { useMemo } from 'react'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit], // 拡張機能の配列を定義する
    content: '<p>Hello World!</p>', // 最初のコンテンツ
  })

  // 不要な再レンダリングを避けるため、プロバイダーの値をメモ化する
  const providerValue = useMemo(() => ({ editor }), [editor])

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </EditorContext.Provider>
  )
}

export default Tiptap
```

### 子コンポーネントでエディタのコンテキストを使う

`EditorProvider` で Tiptap エディタをセットアップした場合は、`useCurrentEditor` フックを使って、どの子コンポーネントからでもエディタのインスタンスにアクセスできます。

```tsx
import { useCurrentEditor } from '@tiptap/react'

const EditorJSONPreview = () => {
  const { editor } = useCurrentEditor()

  return <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre>
}
```

**重要**: `useEditor` フックでエディタをセットアップした場合、この方法は使えません。

これで、ブラウザに最小限の Tiptap の例が表示されるはずです。

## エディタの状態の変化に反応する

エディタの状態の変化に反応するには、`@tiptap/react` の `useEditorState` フックを使います。このフックを使うと、エディタのコンポーネントやその子を再レンダリングさせずに、エディタの状態から情報を取り出せます。

```jsx
import { useEditorState } from '@tiptap/react'

function MyEditorComponent() {
  // ... エディタのセットアップのコード

  const editorState = useEditorState({
    editor,

    // selector 関数で、反応したい状態を選ぶ
    selector: ({ editor }) => {
      if (!editor) return null;

      return {
        isEditable: editor.isEditable,
        currentSelection: editor.state.selection,
        currentContent: editor.getJSON(),
        // ここに状態のプロパティを追加できる。例:
        // isBold: editor.isActive('bold'),
        // isItalic: editor.isActive('italic'),
      };
    },
  });
}
```

## React と Tiptap で SSR を使う

React アプリケーションでは、Tiptap をサーバーサイドレンダリング（SSR）と組み合わせて使えます。ただし、エディタをクライアント側でだけ初期化するには、エディタのインスタンスを作るときに `immediatelyRender` オプションを指定し、
サーバー上でレンダリングされないようにする必要があります。

React のコンポーネントで、SSR 環境に Tiptap をセットアップする例を示します。

```jsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
    // SSR の問題を防ぐため、すぐにはレンダリングしない
    immediatelyRender: false,
  })

  if (!editor) {
    return null // エディタが初期化されるまでレンダリングしない
  }

  return <EditorContent editor={editor} />
}
```

## パフォーマンスを最適化する

Tiptap エディタを効率よく組み込むために、[React のパフォーマンスガイド](../../../guides/performance.md)を読むことをおすすめします。アプリの規模が大きくなったときに起こりうる問題を避けられます。

## 別の方法: Composable React API

Tiptap には、宣言的に書ける `<Tiptap>` コンポーネントもあります。コンテキストを自動で管理し、サブコンポーネントが組み込まれているので、エディタのセットアップが簡単になります。この Composable API は、子コンポーネントが多い複雑な UI に向いています。詳しくは [React Composable API のガイド](../../../guides/react-composable-api.md)を参照してください。

## 次のステップ

- [エディタを設定する](../configure.md)
- [エディタにスタイルを付ける](../style-editor/index.md)
- [Tiptap の基本概念を詳しく知る](../../core-concepts/introduction.md)
- [エディタの状態を永続化する方法を学ぶ](../../core-concepts/persistence.md)
- [独自の拡張機能を作り始める](../../extensions/custom-extensions/index.md)
