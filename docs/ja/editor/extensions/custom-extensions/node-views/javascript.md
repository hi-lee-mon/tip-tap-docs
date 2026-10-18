# JavaScript でノードビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/javascript](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/javascript)

Vue や React を使わずに開発してきた人には、こうしたフレームワークは大げさに感じられるかもしれません。安心してください。ノードビューは Vanilla JavaScript でも書けます。知っておくべきことは少しだけです。順に説明します。

## JavaScript でノードビューをレンダリングする

エディタ内でノードビューをレンダリングする手順は次のとおりです。

1. [ノード拡張機能を作る](../create-new/node.md)
2. `addNodeView()` で新しいノードビューを登録する
3. レンダリング関数を書く
4. [新しいノード拡張機能を使うよう Tiptap を設定する](../../../getting-started/configure.md)

ノード拡張機能は、たとえば次のようになります。

```js
import { Node } from '@tiptap/core'

export default Node.create({
  // 設定 …

  addNodeView() {
    return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {
      const dom = document.createElement('div')

      dom.innerHTML = 'Hello, I’m a node view!'

      return {
        dom,
      }
    }
  },
})
```

わかりましたか？ 実際に動かしてみましょう。下の例はコピーして、そのまま作り始める土台にしてかまいません。

[デモを開く](https://embed.tiptap.dev/preview/GuideNodeViews/JavaScript)

このノードビューは、エディタとのやり取りもしています。次は、その仕組みを説明します。

## ノードの属性にアクセスする

エディタはレンダリング関数に便利なものをいくつか渡します。そのひとつが `node` プロパティで、これを使うとノードビューの中からノードの属性にアクセスできます。たとえば、ノード拡張機能に `count` という名前の [属性を追加した](../extend-existing.md#attributes) とします。その属性には次のようにアクセスできます。

```js
addNodeView() {
  return ({ node }) => {
    console.log(node.attrs.count)

    // …
  }
}
```

## ノードの属性を更新する

レンダリング関数に渡される `getPos` プロパティを使えば、ノードビューからノードの属性を更新することもできます。更新後の属性を持つオブジェクトを指定して、新しいトランザクションをディスパッチします。

```js
addNodeView() {
  return ({ editor, node, getPos }) => {
    const { view } = editor

    // ボタンを作り …
    const button = document.createElement('button')
    button.innerHTML = `This button has been clicked ${node.attrs.count} times.`

    // … クリックされたら …
    button.addEventListener('click', () => {
      if (typeof getPos === 'function') {
        // … ドキュメント内の現在の位置に対してトランザクションをディスパッチし …
        view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
          count: node.attrs.count + 1,
        }))

        // … エディタにフォーカスを戻す。
        editor.commands.focus()
      }
    })

    // …
  }
}
```

少し複雑すぎると感じましたか？ プロジェクトですでに [React](react.md) か [Vue](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/vue) を使っているなら、そちらの利用を検討してください。どちらを使っても少し楽になります。

## 編集可能なコンテンツを追加する

ノードビューに編集可能なコンテンツを追加するには、コンテンツ用のコンテナ要素である `contentDOM` を渡す必要があります。編集できないテキストと編集可能なテキストの両方を持つノードビューを簡略化すると、次のようになります。

```js
// ノードビュー用のコンテナを作る
const dom = document.createElement('div')

// テキストを含むほかの要素には `contentEditable = false` を付ける
const label = document.createElement('span')
label.innerHTML = 'Node view'
label.contentEditable = false

// コンテンツ用のコンテナを作る
const content = document.createElement('div')

// すべての要素をノードビューのコンテナに追加する
dom.append(label, content)

return {
  // ノードビューのコンテナと …
  dom,
  // … コンテンツのコンテナを渡す:
  contentDOM: content,
}
```

わかりましたか？ ノードビュー用のコンテナと、コンテンツ用のコンテナをそれぞれ返しさえすれば、あとは何をしてもかまいません。上の例を実際に動かすと次のようになります。

[デモを開く](https://embed.tiptap.dev/preview/GuideNodeViews/JavaScriptContent)

このコンテンツは Tiptap がレンダリングすることに注意してください。つまり、どんな種類のコンテンツを許可するかを指定する必要があります。たとえばノード拡張機能に `content: 'inline*'` と書きます（上の例でもこれを使っています）。
