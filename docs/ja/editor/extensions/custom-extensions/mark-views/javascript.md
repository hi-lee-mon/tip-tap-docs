# JavaScript でマークビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views/javascript](https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views/javascript)

Vue や React を使わずに開発してきた人には、こうしたフレームワークは大げさに感じられるかもしれません。安心してください。マークビューは Vanilla JavaScript でも書けます。知っておくべきことは少しだけです。順に説明します。

## JavaScript でマークビューをレンダリングする

エディタ内でマークビューをレンダリングする手順は次のとおりです。

1. [マーク拡張機能を作る](../create-new/mark.md)
2. `addMarkView()` で新しいマークビューを登録する
3. レンダリング関数を書く
4. [新しいマーク拡張機能を使うよう Tiptap を設定する](../../../getting-started/configure.md)

マーク拡張機能は、たとえば次のようになります。

```ts
import { Mark } from '@tiptap/core'

export default Mark.create({
  // ほかのオプション...
  addMarkView() {
    return ({ mark, HTMLAttributes }) => {
      const dom = document.createElement('b')
      const contentDOM = document.createElement('span')

      dom.appendChild(contentDOM)

      return {
        dom,
        contentDOM,
      }
    }
  },
})
```

わかりましたか？ 実際に動かしてみましょう。下の例はコピーして、そのまま作り始める土台にしてかまいません。

[デモを開く](https://embed.tiptap.dev/preview/GuideMarkViews/JavaScript)

このマークビューは、エディタとのやり取りもしています。次は、その仕組みを説明します。

## マークの属性にアクセスする

エディタはレンダリング関数に便利なものをいくつか渡します。そのひとつが `mark` プロパティで、これを使うとマークビューの中からマークの属性にアクセスできます。たとえば、マーク拡張機能に `color` という名前の [属性を追加した](../extend-existing.md#attributes) とします。その属性には次のようにアクセスできます。

```ts
addMarkView() {
  return ({ mark }) => {
    console.log(mark.attrs.color)
  }
}
```

## 編集可能なコンテンツを追加する

マークは、エディタ内のテキストの一部を囲むものです。マークの中身を編集可能にしたい場合は、`contentDOM` 要素に `contenteditable` 属性を付けます。

```ts
addMarkView() {
  return ({ mark, HTMLAttributes }) => {
    const dom = document.createElement('b')
    const contentDOM = document.createElement('span')

    contentDOM.contentEditable = 'true'
    dom.appendChild(contentDOM)

    return {
      dom,
      contentDOM,
    }
  }
}
```

わかりましたか？ マークビュー用のコンテナと、コンテンツ用のコンテナをそれぞれ返しさえすれば、あとは何をしてもかまいません。

## マークビューの属性を更新する

マークビューの属性を更新したい場合は、MarkView インスタンスの `updateAttributes` メソッドを呼び出します。

```ts
markView.updateAttributes({
  id: 'new-id',
  color: 'blue',
})
```
