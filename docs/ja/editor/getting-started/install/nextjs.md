# Next.js

> 原文: [https://tiptap.dev/docs/editor/getting-started/install/nextjs](https://tiptap.dev/docs/editor/getting-started/install/nextjs)

Next.js のプロジェクトに Tiptap を組み込む手順を、順を追って説明します。

### 必要なもの

- マシンにインストールされた [Node](https://nodejs.org/en/download/)
- [React](https://reactjs.org/) の経験

## プロジェクトを作る（任意）

既存の Next.js プロジェクトがあるなら、それを使ってもかまいません。この手順は飛ばしてください。

このガイドでは、`my-tiptap-project` という名前の Next.js プロジェクトを新しく作ります。次のコマンドで、始めるのに必要なものがすべてそろいます。

```bash
# プロジェクトを作る
npx create-next-app my-tiptap-project

# ディレクトリを移動する
cd my-tiptap-project
```

### 依存パッケージをインストールする

標準のひな形ができたので、Tiptap を動かしてみましょう。必要なパッケージは `@tiptap/react`、`@tiptap/pm`、`@tiptap/starter-kit` の3つです。`@tiptap/starter-kit` には、すぐに始めるのに必要な拡張機能がすべて入っています。

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

手順1と2を済ませたら、`npm run dev` でプロジェクトを起動し、お好みのブラウザで [http://localhost:3000/](http://localhost:3000/) を開きます。既存のプロジェクトを使っている場合は、URL が違うかもしれません。

## Tiptap を組み込む

Tiptap を使い始めるには、アプリに新しいコンポーネントを追加します。まず `components/` というディレクトリを作ります。続いて、`Tiptap` という名前のコンポーネントを作ります。次のコード例を `components/Tiptap.jsx` に書いてください。

```jsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
    // SSR の問題を避けるため、サーバー上ではすぐにレンダリングしない
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />
}

export default Tiptap
```

> [!TIP]
> **なぜ immediatelyRender: false なのか**
>
> Next.js はデフォルトでサーバーサイドレンダリングを使います。`immediatelyRender: false` を設定すると、エディタがサーバー上でレンダリングされなくなり、[React のハイドレーション不一致エラー](https://react.dev/errors/418)を避けられます。エディタは、ハイドレーションが終わったあとにクライアント側で初期化されます。`'use client'` ディレクティブによって、このコンポーネントはブラウザでだけ動きます。

### アプリに追加する

次に、`app/page.js`（Pages Router を使っている場合は `pages/index.js`）の中身を次のコード例に置き換え、アプリで `Tiptap` コンポーネントを使います。

```jsx
import Tiptap from '../components/Tiptap'

export default function Home() {
  return <Tiptap />
}
```

これでブラウザに Tiptap が表示されるはずです。よくできました！ :)

## パフォーマンスを最適化する

Tiptap エディタを効率よく組み込むために、[React のパフォーマンスガイド](../../../guides/performance.md)を読むことをおすすめします。アプリの規模が大きくなったときに起こりうる問題を避けられます。

## 次のステップ

- [エディタを設定する](../configure.md)
- [エディタにスタイルを付ける](../style-editor/index.md)
- [Tiptap の基本概念を詳しく知る](../../core-concepts/introduction.md)
- [エディタの状態を永続化する方法を学ぶ](../../core-concepts/persistence.md)
- [独自の拡張機能を作り始める](../../extensions/custom-extensions/index.md)
