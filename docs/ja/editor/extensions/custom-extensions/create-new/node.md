# Node API

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node)

Tiptap の強みは柔軟性にあります。拡張機能をゼロから自作して、ニーズに合わせた独自のエディタ体験を作れます。

## ノードを作る

ノードはエディタを組み立てる部品です。ブロックノードにもインラインノードにもできます。参考にするなら [`Paragraph`](../../nodes/paragraph.md)、[`Heading`](../../nodes/heading.md)、[`CodeBlock`](../../nodes/code-block.md) がよい例です。

ノードは [Extension API](extension.md) のオプションとメソッドをすべて引き継ぎ、さらにノード固有のものをいくつか追加しています。

簡単なノード拡張機能を追加して、仕組みを見てみましょう。

```typescript
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },
})
```

コールバック関数を使ってノードを作ることもできます。イベントハンドラーやその他の独自ロジックを定義したいときなど、拡張機能のロジックをカプセル化したい場合に便利です。

```js
import { Node } from '@tiptap/core'

const CustomNode = Node.create(() => {
  // ここでは、スキーマの定義で使う変数や関数を定義できる
  const customVariable = 'foo'

  function onCreate() {}
  function onUpdate() {}

  return {
    name: 'customNode',
    onCreate,
    onUpdate,

    // ここにコードを書く。
  }
})
```

このコードは、`CustomNode` という新しいノード拡張機能を作ります。`addOptions` メソッドではノードのオプションを定義しており、利用者が設定を変えられます。`parseHTML` と `renderHTML` メソッドでは、ノードを HTML からどうパースし、HTML としてどうレンダリングするかを定義しています。

エディタへの組み込み方はほかの拡張機能と同じで、`extensions` 配列に追加します。

```typescript
import { Editor } from '@tiptap/core'

new Editor({
  extensions: [CustomNode],
})

// React や Vue を使う場合

const editor = useEditor({
  extensions: [CustomNode],
})
```

ここからは、ノードで使えるオプションとメソッドを詳しく説明します。

## ノードのオプション

ノードを作るときは、利用者が設定できるオプションを定義できます。オプションを使って、ノードの振る舞いや見た目をカスタマイズできます。

### `parseHTML`

`parseHTML` メソッドでは、マークを HTML からどうパースするかを定義します。マークの属性を表すオブジェクトの配列を返してください（訳注: この項から `addAttributes` の項までは、原文でも Mark API のページと同じ説明・コード例になっています）。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.parseDOM) の `parseDOM` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => {
          return {
            class: node.getAttribute('class'),
          }
        },
      },
    ]
  },
})
```

これは、貼り付けイベントで HTML コンテンツをマークにパースするときに使われます。

### `renderHTML`

`renderHTML` メソッドでは、マークを HTML としてどうレンダリングするかを定義します。マークの HTML 表現を表す配列を返してください。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.toDOM) の `toDOM` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
})
```

これは、コピーイベントでマークを HTML としてレンダリングするときに使われます。詳しくは [既存の拡張機能を拡張する](../extend-existing.md#render-html) ガイドを参照してください。

### `addAttributes`

`addAttributes` メソッドでは、マークの独自の属性を定義します。属性名とデフォルト値を持つオブジェクトを返してください。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.attrs) の `attrs` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  addAttributes() {
    return {
      customAttribute: {
        default: 'value',
        parseHTML: (element) => element.getAttribute('data-custom-attribute'),
      },
    }
  },
})
```

詳しくは [既存の拡張機能を拡張する](../extend-existing.md#attributes) ガイドを参照してください。

### `topNode`

このノードを最上位のノード（doc）にするかどうかを定義します。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.topNode) の `topNode` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  topNode: true,
})
```

### `content`

このノードのコンテンツ式です。書き方は [スキーマのガイド](../../../../guides/invalid-schema.md#a-note-on-content-types) で説明しています。指定しない場合、ノードはコンテンツを一切持てません。

詳しくは [ProseMirror のドキュメント](https://prosemirror.net/docs/guide/#schema.content_expressions) を参照してください。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  content: 'block+',
})
```

### `marks`

このノードの中で使えるマークです。マーク名やグループ名をスペース区切りで並べた文字列を指定できます。`"_"` を指定するとすべてのマークを明示的に許可し、`""` を指定するとマークを禁止します。指定しない場合、インラインコンテンツを持つノードはすべてのマークを許可し、それ以外のノードはマークを許可しません。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.marks) の `marks` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  marks: 'strong em',
})
```

### `group`

このノードが属するグループです。複数ある場合はスペースで区切ります。グループ名は、スキーマのコンテンツ式から参照できます。

Tiptap はデフォルトで、ノードに 'block' と 'inline' のグループを使います。特定のノードをまとめてスキーマで扱いたい場合は、独自のグループも使えます。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.group) の `group` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  group: 'block',
})
```

### `inline`

インラインノードでは true にしてください（テキストノードでは暗黙に true です）。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.inline) の `inline` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  inline: true,
})
```

### `atom`

true にすると、このノードは [リーフノード](https://prosemirror.net/docs/ref/#model.NodeType.isLeaf) ではないものの、直接編集できるコンテンツを持たず、ビューの中で 1 つの単位として扱うべきであることを示します。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.atom) の `atom` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  atom: true,
})
```

### `selectable`

この種類のノードを [ノード選択](https://prosemirror.net/docs/ref/#state.NodeSelection) で選択できるかどうかを制御します。テキスト以外のノードではデフォルトで true です。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.selectable) の `selectable` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  selectable: false,
})
```

### `draggable`

この種類のノードを、選択せずにドラッグできるかどうかを決めます。デフォルトは false です。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.draggable) の `draggable` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  draggable: true,
})
```

### `code`

このノードがコードを含むことを示します。指定すると、一部のコマンドの振る舞いが変わります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.code) の `code` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  code: true,
})
```

### `whitespace`

このノード内の空白をどうパースするかを制御します。デフォルトは `"normal"` で、[DOM パーサー](https://prosemirror.net/docs/ref/#model.DOMParser) は通常モードでは空白をまとめ、それ以外のモードでは正規化（改行などをスペースに置換）します。`"pre"` を指定すると、パーサーはノード内のスペースをそのまま残します。このオプションを指定せず [`code`](https://prosemirror.net/docs/ref/#model.NodeSpec.code) が true の場合、`whitespace` はデフォルトで `"pre"` になります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) の `whitespace` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  whitespace: 'pre',
})
```

### `linebreakReplacement`

改行に相当するノード（hardBreak など）として、ノードを **1 つだけ** 設定できます。whitespace が "pre" で改行ノードに対応しないブロック（codeBlock など）と、改行ノードに対応するブロック（段落など）の間で変換するとき、改行を取り除く代わりにこのノードを改行として使います。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.linebreakReplacement) の `linebreakReplacement` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  linebreakReplacement: true,
})
```

### `defining`

有効にすると、[`definingAsContext`](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext) と [`definingForContent`](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent) の両方が有効になります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.defining) の `defining` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  defining: true,
})
```

### `isolating`

有効にすると（デフォルトは false）、この種類のノードの両端が境界として扱われ、Backspace やリフト（訳注: ブロックを一段外側へ持ち上げる操作）などの通常の編集操作がそこを越えなくなります。表のセルは、おそらくこれを有効にすべきノードの一例です。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.NodeSpec.isolating) の `isolating` 属性に対応します。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  isolating: true,
})
```

### `addNodeView`（上級）

ノードの中で JavaScript を実行したい高度なケース、たとえば画像の周りに凝ったインターフェースをレンダリングしたい場合は、ノードビューについて学ぶ必要があります。

ノードビューはとても強力ですが、そのぶん複雑です。要点だけ言うと、親となる DOM 要素と、コンテンツをレンダリングする DOM 要素を返す必要があります。次の簡略化した例を見てください。

```js
import Image from '@tiptap/extension-image'

const CustomImage = Image.extend({
  addNodeView() {
    return () => {
      const container = document.createElement('div')

      container.addEventListener('click', (event) => {
        alert('clicked on the container')
      })

      const content = document.createElement('div')
      container.append(content)

      return {
        dom: container,
        contentDOM: content,
      }
    }
  },
})
```

ノードビューについて学ぶことはたくさんあります。詳しくは [ガイドのノードビュー専用のセクション](../node-views/index.md) を参照してください。実際の使用例を見たい場合は、[`TaskItem`](../../nodes/task-item.md) ノードのソースコードを見てください。チェックボックスのレンダリングにノードビューを使っています。

### `addDecorations`

ノードは [Extension API](extension.md#adddecorations) から `addDecorations` フックを引き継いでいます。これを使うと、**表示専用** の [デコレーション](../../../core-concepts/decorations.md)（ハイライト、検索結果、注釈、軽量なウィジェットなど）を追加できます。デコレーションはエディタ上にレンダリングされますが、ドキュメントを変更することもシリアライズされることもありません。

> [!NOTE]
> **デコレーションとノードビューの使い分け**
>
> コンテンツがドキュメントの一部なら [ノードビュー](#addnodeview-advanced) を使います。
> 目印が純粋に見た目だけのもので、ドキュメントの外にあるなら [デコレーション](../../../core-concepts/decorations.md) を使います。
