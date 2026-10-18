# よくある質問

> 原文: [https://tiptap.dev/docs/guides/faq](https://tiptap.dev/docs/guides/faq)

## エディタのコンテンツをテキストフィールドにコピーすると、改行が大量に入る

Tiptap の初期設定では、クリップボード用のテキストシリアライザーが、段落の間に改行を2つ入れて出力します（Markdown で書くときと同じです）。

そのため、貼り付けたコンテンツは次のようになります。

```text
This is a paragraph.

This is another paragraph.
```

おそらく求めているのは、次のような形（段落の間に余分な改行がない形）でしょう。

```text
This is a paragraph.
This is another paragraph.
```

そうするには、`clipboardTextSerializer` の改行を2つから1つに変更します。

次のように設定します。

```js
new Editor({
  // ほかのオプション
  coreExtensionOptions: {
    clipboardTextSerializer: {
      blockSeparator: '\n',
    },
  },
})
```

これで、クリップボード用のシリアライザーはブロックの区切りに改行を1つだけ使います。

## ドラッグ＆ドロップが動かない

`react-dnd` や `react-beautiful-dnd` などのライブラリは、自身をグローバルに登録するため、Tiptap のドラッグ＆ドロップ機能を妨げることがあります。
こうしたライブラリを使っている場合、エディタのドラッグ＆ドロップを正しく動かすには、ライブラリを無効にする（少なくとも、ライブラリが監視する要素を限定する）必要があるかもしれません。

## `parseHTML` と `renderHTML` の両方がある理由

`parseHTML` と `renderHTML` は、逆向きの処理だと考えるとわかりやすいでしょう。

- `parseHTML`: HTML -> JSON。HTML 表現を受け取り、JSON としてパースする
- `renderHTML`: JSON -> HTML。JSON 表現を受け取り、エディタにレンダリングする HTML として出力する

この2つがあるから、Tiptap はコンテンツの表現をこれほど柔軟に扱えます。コンテンツを JSON で定義して HTML としてレンダリングすることも、HTML で定義して JSON にパースすることもできます。

さらに、`parseHTML` と `renderHTML` は別の場面でも使われます。
`renderHTML` は _コピーイベント_ で使われます。エディタからコピーした内容は、クリップボードに入れるために HTML としてシリアライズする必要があるからです。
`parseHTML` は _貼り付けイベント_ で使われます。クリップボードの内容は HTML としてシリアライズされているので、JSON にパースする必要があるからです。

コンテンツを JSON で定義している場合、初回のレンダリングでは `parseHTML` は一切使われず、貼り付けのときにだけ使われます。
一方、エディタ内でコンテンツをどんな HTML で表現するかは `renderHTML` メソッドが決めます。

エディタのビューでは、ノードビューやマークビューで `renderHTML` を上書きでき、ノードやマークを独自にレンダリングできます。

## Tiptap で HTML コンテンツを編集したい

Tiptap は ProseMirror をベースにしていますが、任意の HTML を編集できるエディタではありません。リッチテキストエディタであり、変更を加えるには編集対象の HTML を完全に管理している必要があります。ProseMirror は、コンテンツをスキーマ（Tiptap の拡張機能として指定したノードとマークから作られます）に合う形にパースしようとします。つまり、スキーマに合わないコンテンツは**失われます**。これはトレードオフです。ProseMirror はかなりの範囲の HTML コンテンツを受け付けて構造化された形式にパースできますが、任意の HTML までは確実にパースできません（受け付けるものには寛容に、出力するものには厳格に、という方針です）。
よくある例は、種類の違うマークを `<span class="my-class"><span style="color: red">editable text</span></span>` のように入れ子にしようとする場合です。この2つのマークはこの形では入れ子にできません。マーク同士は包み合えないというルールを守るため、ProseMirror はどちらかを捨てて修正しようとします。これを直すには、エディタに入力する HTML を `<span class="my-class" style="color: red">editable text</span>` のように、1つの要素に複数の属性を持たせた形にします。この形なら、ProseMirror はテキストに2つのマークを適用するものとして正しくパースします。

任意の HTML のパースはそれだけで十分に複雑なため、ProseMirror ではこの挙動を設定で変えられません。パースしようとしている HTML の出どころに応じて、次のどちらかを選べます。

- 初期設定の挙動に任せ、未知のコンテンツは捨てる
- 独自の HTML パーサーで自分で HTML をパースし、ProseMirror が期待する形に合わせる（例: span を統合する）

## ノードビューで React のコンテキストが使えない

ノードビューの中で React のコンテキストを使うには、`EditorContent` コンポーネントをコンテキストのプロバイダーで包みます。そうすると、ノードビューのコンポーネントの中でコンテキストを使えるようになります。

```jsx
import React from 'react'
import { EditorContent } from '@tiptap/react'

const TiptapEditor = ({ editor }) => {
  return (
    <MyContext.Provider value={{ foo: 'bar' }}>
      <EditorContent editor={editor} />
    </MyContext.Provider>
  )
}
```

## React のノードビューを使うと余分な div が入る理由

ProseMirror はノードビューを同期的に生成することを前提にしていますが、React は非同期にしかレンダリングできません。そこで Tiptap は要素を1つ差し込み、あとから React にその要素の中へ非同期にレンダリングさせます。その結果、DOM に包み込みの div ができます。

同じように、`NodeViewContent` を使うと、React が作った要素ができ、その中に ProseMirror がレンダリングします。この要素は React から ProseMirror への受け渡し役として欠かせません。React はレンダリング先の要素を空にするのが標準の挙動なので、ProseMirror がリッチテキストをレンダリングしようとしている要素を React に壊させないようにする必要があるのです。

まとめると、React の仕組み上、この中間の要素をなくすうまい方法はありません。なくしたい場合は、JS のノードビュー API を使うか、より素直なレンダリング方式を持つ Vue を使うことになります。
