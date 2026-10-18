# カスタムノードビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views)

ノードビューは、カスタマイズ好き（とパン好き）にとって、スライスパン以来の大発明です（訳注: 英語の慣用句 "the best thing since sliced bread"「画期的なもの」をもじった表現）。ノードビューを使うと、エディタにインタラクティブなノードを追加できます。文字どおり何でも作れます。JavaScript で書けるものなら、エディタの中で使えます。

ノードビューはエディタ内での体験を良くするのに最適ですが、読み取り専用の Tiptap インスタンスでも使えます。ノードビューは意図的に HTML 出力と切り離されているので、エディタ内の体験 _と_ 出力の両方を自由に制御できます。

## ノードビューの種類

何を作りたいかによって、ノードビューの動きは少しずつ異なり、それぞれに固有の機能と落とし穴があります。いちばん大事なのは「カスタムノードをどんな見た目にしたいか」です。

### 編集可能なテキスト

ノードビューは、通常のノードと同じように編集可能なテキストを持てます。仕組みはシンプルです。カーソルは通常のノードで期待するとおりに動き、既存のコマンドもこうしたノードで問題なく使えます。

```html
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>text</node-view>
  <p>text</p>
</div>
```

[`TaskItem`](../../nodes/task-item.md) ノードはこの方式で動いています。

### 編集できないテキスト

ノードには、編集できないテキストも含められます。こうしたテキストにはカーソルが入りませんが、そもそも入ってほしくない場面で使うものです。

Tiptap は、こうした要素にデフォルトで `contenteditable="false"` を付けます。

```html
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view contenteditable="false">text</node-view>
  <p>text</p>
</div>
```

編集されては困るメンションは、この方式でレンダリングできます。ユーザーはメンションを追加・削除できますが、1 文字ずつは消せません。

Statamic は、自社の Bard エディタでこの方式を使っています。Bard エディタは Tiptap の中で複雑なモジュールをレンダリングしており、モジュールごとに独自のテキスト入力を持てます。

### 混在するコンテンツ

編集できないテキストと編集可能なテキストを混在させることもできます。複雑なものを作りつつ、編集可能な部分では太字や斜体などのマークも使えるので便利です。

**ただし**、ノードビューの中に編集できないテキストを含む要素がほかにもあると、カーソルがそこへ飛ぶことがあります。これは、ノードビューの該当部分に手動で `contenteditable="false"` を付けることで改善できます。

```html
<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>
    <div contenteditable="false">non-editable text</div>
    <div>editable text</div>
  </node-view>
  <p>text</p>
</div>
```

## マークアップ

では、[エディタのコンテンツを取得](../../../../guides/output-json-html.md) するとどうなるでしょうか。HTML を扱う場合は、ノードをどうシリアライズするかを Tiptap に教える必要があります。

エディタは、レンダリングされた JavaScript のノードをエクスポート **しません**。多くの場合、そもそもそれは望まれていないはずです。

たとえば、ユーザーが動画プレイヤーを追加して見た目（自動再生、コントロールなど）を設定できるノードビューがあるとします。設定用の UI はエディタ内にあればよく、エディタの出力には不要です。出力に含めたいのは、おそらく動画プレイヤーだけでしょう。

わかっています、そう簡単な話ではありません。ただ、エディタ内のレンダリングも出力も、すべて自分で制御できるということは覚えておいてください。

> [!WARNING]
> **JSON で保存する場合は？**
>
> この話は JSON には当てはまりません。JSON ではすべてがオブジェクトとして保存されるので、
> JSON との相互「変換」を設定する必要はありません。

### HTML をレンダリングする

さて、インタラクティブなノードビューを持つノードを用意できたので、次は出力を制御します。ノードビューがかなり複雑でも、レンダリングする HTML はシンプルでかまいません。

```js
renderHTML({ HTMLAttributes }) {
  return ['my-custom-node', mergeAttributes(HTMLAttributes)]
},

// 出力: <my-custom-node count="1"></my-custom-node>
```

HTML からコンテンツを復元しやすいよう、ほかと区別できるものにしてください。`<div>` のような汎用的なマークアップで済ませたい場合は、`data-type="my-custom-node"` を付けることを検討してください。

### HTML をパースする

コンテンツの復元も同じです。どんなマークアップを受け取るかを設定でき、それはノードビューのマークアップとまったく無関係なものでもかまいません。復元したい情報がすべて含まれてさえいれば十分です。

[`addAttributes`](../extend-existing.md#attributes) で登録した属性は、自動的に復元されます。

```js
// 入力: <my-custom-node count="1"></my-custom-node>

parseHTML() {
  return [{
    tag: 'my-custom-node',
  }]
},
```

### JavaScript/Vue/React をレンダリングする

では、実際の JavaScript/Vue/React のコードをレンダリングしたい場合はどうすればよいでしょうか。その場合は [Static Renderer](../../../api/utilities/static-renderer.md) を使います。このユーティリティを使うと、Editor インスタンスなしでコンテンツを HTML、Markdown、React コンポーネントとしてレンダリングできます。
