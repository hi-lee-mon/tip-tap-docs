# 独自のメニューを作る

> 原文: [https://tiptap.dev/docs/editor/getting-started/style-editor/custom-menus](https://tiptap.dev/docs/editor/getting-started/style-editor/custom-menus)

Tiptap は飾り気のない状態で提供されますが、それは良いことです。エディタの見た目を完全に制御できます。

完全な制御というのは文字どおりの意味です。メニューは自分で作れますし、作らなければなりません。ただし、各部分をつなぐ作業は Tiptap が手伝います。

## メニュー

エディタには、コマンドを実行したり、アクティブな状態を付けたりするための、メソッドをつなげて書ける API があります。マークアップは自由に書けます。メニューの配置を簡単にするために、Tiptap はいくつかのユーティリティとコンポーネントを用意しています。以下、代表的な使い方を順に説明します。

### 固定メニュー

固定メニューは、常に同じ場所に置かれるメニューです。たとえば、エディタの上に固定メニューを置くのが定番です。Tiptap に固定メニューは付いていませんが、`<div>` 要素を作って `<button>` 要素を並べれば作れます。テキストを太字や斜体にするなど、ボタンからエディタの[コマンド](../../api/commands/index.md)を実行する方法は、[下の説明](#buttons)を参照してください。

### バブルメニュー

[バブルメニュー](../../extensions/functionality/bubble-menu.md)は、テキストを選択したときに表示されるメニューです。マークアップとスタイルは完全に自由です。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/BubbleMenu?inline=false&hideSource=true)

### フローティングメニュー

[フローティングメニュー](../../extensions/functionality/floatingmenu.md)は、空の行にカーソルを置いたときにエディタ内に表示されます。こちらも、マークアップとスタイルは完全に自由です。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FloatingMenu?inline=false&hideSource=true)

### スラッシュコマンド（開発中）

公式の拡張機能はまだありませんが、「スラッシュコマンド」を使える[実験的な実装](https://tiptap.dev/docs/examples/experiments/slash-commands)があります。スラッシュコマンドでは、新しい行の先頭で `/` を入力するとポップアップメニューが表示されます。

## ボタン

メニューはできました。では、どうやって各部分をつなげばよいのでしょうか。

### コマンド

エディタはもう動いていて、最初のボタンを追加したいとします。必要なのは、クリックハンドラー付きの `<button>` HTML タグです。構成によっては、次の例のようになります。

```html
<button onclick="editor.chain().focus().toggleBold().run()">Bold</button>
```

長いコマンドだと思ったかもしれません。実はこれは[コマンドのチェーン](../../api/commands/index.md)です。順に分解します。

```js
editor.chain().focus().toggleBold().run()
```

1. `editor` は Tiptap のインスタンスです。
2. `chain()` で、複数のコマンドを実行することをエディタに伝えます。
3. `focus()` で、フォーカスをエディタに戻します。
4. `toggleBold()` で、選択したテキストを太字にします。すでに太字なら、太字のマークを外します。
5. `run()` で、チェーンを実行します。

つまりこれは、テキストエディタによくある**太字**ボタンです。

使えるコマンドは、エディタに登録した拡張機能によって決まります。多くの拡張機能には `set…()`、`unset…()`、`toggle…()` のコマンドがあります。実際に使えるコマンドは、拡張機能のドキュメントを読むか、コードエディタの自動補完で確認してください。

### フォーカスを保つ

上の例で、すでに `focus()` コマンドを見ました。ボタンをクリックすると、ブラウザはその DOM 要素にフォーカスを移し、エディタはフォーカスを失います。ユーザーの書く流れを止めないように、メニューのすべてのボタンに `focus()` を付けておくとよいでしょう。

### アクティブな状態

エディタには `isActive()` メソッドがあり、選択したテキストに何かがすでに適用されているかを調べられます。Vue.js では、この関数を使って CSS クラスを切り替えられます。

**重要**: React を使っている場合、パフォーマンスの問題を避けるため、エディタの状態の値は自動ではリアクティブになりません。
つまり `isActive()` は、常にエディタの最初の状態の値を返します。
エディタの状態を購読するには、[こちら](../install/react.md#reacting-to-editor-state-changes)で説明している `useEditorState` フックを使ってください。

```html
<button
  :class="{ 'is-active': editor.isActive('bold') }"
  @click="editor.chain().focus().toggleBold().run()"
>
  Bold
</button>
```

これで、ノードやマークに応じて `.is-active` クラスが切り替わります。特定の属性を調べることもできます。属性の違いを無視する [`Highlight`](../../extensions/marks/highlight.md) マークの例です。

```js
editor.isActive('highlight')
```

指定した属性を比べる例です。

```js
editor.isActive('highlight', { color: '#ffa8a8' })
```

正規表現も使えます。

```js
editor.isActive('textStyle', { color: /.*/ })
```

ノードやマークの種類を問わず、属性だけを調べることもできます。[`TextAlign`](../../extensions/functionality/textalign.md) 拡張機能の例です。

```js
editor.isActive({ textAlign: 'right' })
```

選択範囲が複数のノードやマークにまたがっている場合や、選択範囲の一部にしかマークがない場合、`isActive()` は `false` を返し、何もアクティブでないことを示します。これは意図した動作です。こうすることで、ユーザーは選択範囲にすぐ新しいノードやマークを適用できます。

## 使い心地

使い心地のよい UI を設計するために、いくつか考えておくべき点があります。

### アクセシビリティ

- キーボードでメニューを操作できるようにする
- [title 属性](https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/title)を使う
- [ARIA 属性](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)を使う
- 使えるキーボードショートカットを一覧にする

### アイコン

エディタのメニューの多くは、ボタンにアイコンを使います。いくつかのデモでは、オープンソースのアイコンセット [Remix Icon](https://remixicon.com/) を使っていますが、好きなアイコンセットを使ってかまいません。いくつか候補を挙げます。

- [Remix Icon](https://remixicon.com/#editor)
- [Font Awesome](https://fontawesome.com/icons?c=editors)
- [UI icons](https://www.ibm.com/design/language/iconography/ui-icons/library/)
