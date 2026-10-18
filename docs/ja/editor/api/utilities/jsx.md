# JSX

> 原文: [https://tiptap.dev/docs/editor/api/utilities/jsx](https://tiptap.dev/docs/editor/api/utilities/jsx)

カスタム拡張機能を作るときは、HTML へのレンダリング方法を定義する必要がよくあります。通常は `renderHTML` 関数を定義し、タグ名・属性・コンテンツホールを含む ProseMirror のレンダリング配列を返します。

Tiptap の JSX レンダラーを使うと、拡張機能のレンダリング方法を JSX で定義できます。

[デモを開く](https://embed.tiptap.dev/preview/Examples/JSX)

## 拡張機能で JSX を使う

拡張機能で JSX を使うには、Vite や Webpack のように **JSX** や **TSX** ファイルを扱えるバンドラーが必要です。Next.js、Remix、Nuxt など、たいていのフレームワークは最初から対応しているはずです。

特に設定しなければ、React の JSX ランタイムが使われます。Tiptap の拡張機能のように React 以外の環境で JSX を使おうとすると、これが問題になります。

対処するには、ファイルの先頭にコメントを書き、バンドラーが使う JSX ランタイムを指定します。Tiptap は `@tiptap/core` に独自のランタイムを用意しています（訳注: 原文では "bundler" ですが、文脈上は JSX ランタイムを指します）。

```jsx
/** @jsxImportSource @tiptap/core */

// ここにコードを書く
```

## `renderHTML` 関数の中で JSX を書く

これでバンドラーが Tiptap 用の JSX を扱えるようになったので、`renderHTML` 関数の中で JSX を使えます。

```jsx
/** @jsxImportSource @tiptap/core */

import { Node } from '@tiptap/core'

const MyNode = Node.create({
  // ... ノードの設定

  renderHTML({ HTMLAttributes }) {
    return (
      <div {...HTMLAttributes}>
        <p>This is your custom node. And here is your content hole:</p>
        <slot />
      </div>
    )
  }
})
```

`<slot />` タグは、JSX で ProseMirror のコンテンツホールを定義するためのものです。編集できるコンテンツは、この位置にレンダリングされます。

**注意:** 内部で React や Vue などのコンポーネントライブラリを使っているわけではありません。そのため、フックや状態などライブラリ固有の機能には対応していません。
