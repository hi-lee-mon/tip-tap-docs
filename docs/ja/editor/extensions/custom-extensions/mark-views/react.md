# React でマークビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views/react](https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views/react)

React に慣れていると、Vanilla JavaScript で書くのは面倒に感じるかもしれません。安心してください。マークビューでも普通の React コンポーネントを使えます。知っておくべきことは少しだけです。順に説明します。

## React コンポーネントをレンダリングする

エディタ内で React コンポーネントをレンダリングする手順は次のとおりです。

1. [マーク拡張機能を作る](../create-new/mark.md)
2. React コンポーネントを作る
3. そのコンポーネントを、用意されている `ReactNodeViewRenderer` に渡す
4. `addMarkView()` で登録する
5. [新しいノード拡張機能を使うよう Tiptap を設定する](../../../getting-started/configure.md)

ノード拡張機能は、たとえば次のようになります。

```ts
import { Mark } from '@tiptap/core'
import { ReactMarkViewRenderer } from '@tiptap/react'

import Component from './Component.jsx'

export default Mark.create({
  // オプション…

  addMarkView() {
    return ReactMarkViewRenderer(Component)
  },
})
```

React コンポーネントの例は次のとおりです。

```tsx
import { MarkViewContent, MarkViewRendererProps } from '@tiptap/react'
import React from 'react'

export default (props: MarkViewRendererProps) => {
  const [count, setCount] = React.useState(0)

  return (
    <span className="content" data-test-id="mark-view">
      <MarkViewContent />
      <label contentEditable={false}>
        React component:
        <button
          onClick={() => {
            setCount(count + 1)
          }}
        >
          This button has been clicked {count} times.
        </button>
      </label>
    </span>
  )
}
```

わかりましたか？ 実際に動かしてみましょう。下の例はコピーして、そのまま作り始める土台にしてかまいません。

[デモを開く](https://embed.tiptap.dev/preview/GuideMarkViews/ReactComponent?inline=false&hideSource=false)

## マークビューの属性を更新する

マークビューの属性はとても簡単に更新できます。`MarkViewRendererProps` が提供する `updateAttributes` メソッドを使ってください。

```tsx
import { MarkViewContent, MarkViewRendererProps } from '@tiptap/react'
import React from 'react'

export default (props: MarkViewRendererProps) => {
  return (
    <span id={props.HTMLAttributes.id}>
      <MarkViewContent />
      <button onClick={() => props.updateAttributes({ id: Date.now() })}>Update ID</button>
    </span>
  )
}
```
