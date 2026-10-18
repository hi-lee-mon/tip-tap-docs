# React でノードビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react)

React に慣れていると、Vanilla JavaScript で書くのは面倒に感じるかもしれません。安心してください。ノードビューでも普通の React コンポーネントを使えます。知っておくべきことは少しだけです。順に説明します。

## React コンポーネントをレンダリングする

エディタ内で React コンポーネントをレンダリングする手順は次のとおりです。

1. [ノード拡張機能を作る](../index.md)
2. React コンポーネントを作る
3. そのコンポーネントを、用意されている `ReactNodeViewRenderer` に渡す
4. `addNodeView()` で登録する
5. [新しいノード拡張機能を使うよう Tiptap を設定する](../../../getting-started/configure.md)

ノード拡張機能は、たとえば次のようになります。

```js
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './Component.jsx'

export default Node.create({
  // 設定 …

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
```

これを動かすには、ちょっとした仕掛けが必要です。でも心配はいりません。すぐに使い始められるラッパーコンポーネントを用意しています。次のように、カスタム React コンポーネントに忘れずに追加してください。

```jsx
<NodeViewWrapper className="react-component">React Component</NodeViewWrapper>
```

わかりましたか？ 実際に動かしてみましょう。下の例はコピーして、そのまま作り始める土台にしてかまいません。

[デモを開く](https://embed.tiptap.dev/preview/GuideNodeViews/ReactComponent?inline=false&hideSource=false)

ただし、このコンポーネントはまだエディタとやり取りしていません。次はエディタとつなげましょう。

## ノードの属性にアクセスする

ノード拡張機能で使う `ReactNodeViewRenderer` は、カスタム React コンポーネントにとても便利なプロパティをいくつか渡します。そのひとつが `node` プロパティです。たとえば、ノード拡張機能に `count` という名前の [属性を追加した](../extend-existing.md#attributes) とします（上の例でもそうしています）。その属性には次のようにアクセスできます。

```js
props.node.attrs.count
```

## ノードの属性を更新する

コンポーネントに渡される `updateAttributes` プロパティを使えば、ノードの中からノードの属性を更新することもできます。更新後の属性を持つオブジェクトを `updateAttributes` に渡します。

```js
export default (props) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  // …
}
```

しかも、これらはすべてリアクティブです。かなりスムーズにやり取りできますよね。

## 編集可能なコンテンツを追加する

`NodeViewContent` というコンポーネントもあり、ノードビューに編集可能なコンテンツを追加するのに使えます。例を示します。

```jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default () => {
  return (
    <NodeViewWrapper className="react-component">
      <span className="label" contentEditable={false}>
        React Component
      </span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}
```

`className` 属性は必須ではありません。削除しても、別のクラス名を渡してもかまいません。次の例で試してみてください。

[デモを開く](https://embed.tiptap.dev/preview/GuideNodeViews/ReactComponentContent?inline=false&hideSource=false)

このコンテンツは Tiptap がレンダリングすることに注意してください。つまり、どんな種類のコンテンツを許可するかを指定する必要があります。たとえばノード拡張機能に `content: 'inline*'` と書きます（上の例でもこれを使っています）。

`NodeViewWrapper` と `NodeViewContent` コンポーネントは `<div>` タグ（インラインノードの場合は `<span>`）をレンダリングしますが、変更もできます。たとえば `<NodeViewContent as="p">` と書けば段落をレンダリングします。ただし制約がひとつあり、このタグは実行中には変えられません。

## ノードビューのデフォルトのコンテンツタグを変える

リーフノード以外のノードビューでは、`ReactNodeViewRenderer` がラッパーの中に編集可能なコンテンツ要素を作ります。この要素はデフォルトで、ブロックノードなら `div`、インラインノードなら `span` です。タグを変えるには `contentDOMElementTag` を使います。

```js
// 編集可能なコンテンツに header タグを使う
return ReactNodeViewRenderer(Component, { contentDOMElementTag: 'header' })
```

## 外側のラッパー要素を変える

`ReactNodeViewRenderer` が作る外側の要素は、デフォルトでブロックノードなら `div`、インラインノードなら `span` です。変えるには `as` オプションを使います。これは、内側の編集可能なコンテンツ要素を制御する `contentDOMElementTag` とは別のオプションです。

```js
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './Component.jsx'

export default Node.create({
  // 設定 …

  addNodeView() {
    return ReactNodeViewRenderer(Component, { as: 'main' })
  },
})
```

## テキストの選択範囲で `selected` を更新する

デフォルトでは、`selected` プロパティが `true` になるのは、ノード自体が `NodeSelection` で選択されたときだけです。atom ノードではこれで十分ですが、テキストコンテンツを持つノードの中にカーソルを置いただけでは `true` になりません。この場合も `selected` に反映させたいときは、`ReactNodeViewRenderer` の `selectedOnTextSelection` オプションを有効にします。

```js
return ReactNodeViewRenderer(Component, { selectedOnTextSelection: true })
```

このオプションを有効にすると、`TextSelection` がノードの範囲内に完全に収まっているとき（たとえばノードのコンテンツ内のどこかにカーソルを置いたとき）にも `selected` が `true` になります。ノードと一部だけ重なる選択範囲は、選択されたとはみなしません。

## ノードの位置を追跡する

コンテンツが変わらずにデコレーションや位置だけが変わっても、ノードビューは再レンダリングされません。ProseMirror は contentDOM 上のデコレーションを独自に処理しますし、`getPos()` クロージャは再レンダリングがなくても、呼び出した時点の位置を常に返します。

レンダリング結果の中で `getPos()` をリアクティブに保つ必要がある場合（たとえば `pos: 42` と表示するドラッグハンドル）は、`trackNodeViewPosition` を有効にします。

```js
return ReactNodeViewRenderer(Component, { trackNodeViewPosition: true })
```

有効にすると、位置がずれるたびにコンポーネントが再レンダリングされます。頻繁な再レンダリングはパフォーマンスに影響するので、慎重に使ってください。

## 使えるプロパティの一覧

受け取れるプロパティの全一覧は次のとおりです。

| プロパティ         | 説明                                                            |
| ------------------ | --------------------------------------------------------------- |
| editor             | エディタのインスタンス                                          |
| node               | 現在のノード                                                    |
| decorations        | デコレーションの配列                                            |
| selected           | 現在のノードビューに `NodeSelection` があるときに `true`。[`selectedOnTextSelection`](#updating-selected-on-a-text-selection) を有効にしている場合は、ノード内に完全に収まる `TextSelection` があるときも `true` |
| extension          | ノード拡張機能へのアクセス（オプションの取得など）              |
| getPos()           | 現在のノードのドキュメント内の位置を取得する                    |
| updateAttributes() | 現在のノードの属性を更新する                                    |
| deleteNode()       | 現在のノードを削除する                                          |

## ドラッグ

ノードビューをドラッグ可能にするには、拡張機能で `draggable: true` を設定し、ドラッグハンドルとして使う DOM 要素に `data-drag-handle` を付けます。
