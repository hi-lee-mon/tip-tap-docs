# Mark API

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/mark](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/mark)

Tiptap の強みは柔軟性にあります。拡張機能をゼロから自作して、ニーズに合わせた独自のエディタ体験を作れます。

## マークを作る

マークは、Tiptap でテキストにインラインの書式を付けるために使います。太字、斜体、下線などがよくある例です。

マークは [Extension API](extension.md) のオプションとメソッドをすべて引き継ぎ、さらにマーク固有のものをいくつか追加しています。

簡単なマーク拡張機能を追加して、仕組みを見てみましょう。

```typescript
import { Mark } from '@tiptap/core'

const HighlightMark = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },
})
```

コールバック関数を使ってマークを作ることもできます。イベントハンドラーやその他の独自ロジックを定義したいときなど、拡張機能のロジックをカプセル化したい場合に便利です。

```js
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create(() => {
  // 拡張機能の中で使う変数や関数を定義する
  const customVariable = 'foo'

  function onCreate() {}
  function onUpdate() {}

  return {
    name: 'customMark',
    onCreate,
    onUpdate,

    // ここにコードを書く。
  }
})
```

このコードは、`HighlightMark` という新しいマーク拡張機能を作ります。`addOptions` メソッドではマークのオプションを定義しており、利用者が設定を変えられます。`parseHTML` と `renderHTML` メソッドでは、マークを HTML からどうパースし、HTML としてどうレンダリングするかを定義しています。

エディタへの組み込み方はほかの拡張機能と同じで、`extensions` 配列に追加します。

```typescript
import { Editor } from '@tiptap/core'

new Editor({
  extensions: [HighlightMark],
})

// React や Vue を使う場合

const editor = useEditor({
  extensions: [HighlightMark],
})
```

ここからは、マークで使えるオプションとメソッドを詳しく説明します。

## マークのオプション

マーク拡張機能を作るときは、利用者が設定できるオプションを定義できます。オプションを使って、マークの振る舞いや見た目をカスタマイズできます。

### `parseHTML`

`parseHTML` メソッドでは、マークを HTML からどうパースするかを定義します。マークの属性を表すオブジェクトの配列を返してください。

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

### `keepOnSplit`

デフォルトでは、ノードを分割するとコンテンツからマークが外れます。`keepOnSplit` を `true` にすると、新しいノードにもマークが残ります。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  keepOnSplit: true,
})
```

### `inclusive`

デフォルトでは、マークは inclusive ではありません。つまり、ノードの先頭や末尾には適用されません。`inclusive` を `true` にすると、ノードの先頭や末尾にもマークを適用できるようになります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) の `inclusive` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  inclusive: true,
})
```

### `excludes`

デフォルトでは、マークはほかのマークを排除しません。このマークを適用したときに排除するマークの一覧を定義できます。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) の `excludes` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  excludes: ['bold', 'italic'],
})
```

### `exitable`

デフォルトでは、マークは exitable ではありません。つまり、マークの先頭で Backspace を押しても外れません。`exitable` を `true` にすると、この操作でマークを外せるようになります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.exitable) の `exitable` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  exitable: true,
})
```

### `group`

デフォルトでは、マークはグループに属さず、個別に適用されます。マークにグループを定義すると、同じグループのマークは一度に 1 つしか適用できなくなります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.group) の `group` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  group: 'textStyle',
})
```

### `spanning`

デフォルトでは、マークは複数のノードにまたがりません。`spanning` を `true` にすると、複数のノードにまたがれるようになります。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.spanning) の `spanning` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  spanning: true,
})
```

### `code`

デフォルトでは、マークはコードマークとして扱われません。`code` を `true` にすると、コードマークとして扱われます。

[ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.MarkSpec.code) の `code` 属性に対応します。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  code: true,
})
```

### `clearable`

デフォルトでは、マークは `unsetAllMarks` コマンドで外せます。`clearable` を `false` にすると、`unsetAllMarks` でマークが外れないよう保護できます。`unsetMark` コマンドには影響しません。このオプションに従うのは `unsetAllMarks` だけです。

コールバック関数を使い、エディタの状態に応じてマークを外せるかどうかを動的に決めることもできます。

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  // このマークは unsetAllMarks では外れない
  clearable: false,
})
```

```typescript
const CustomMark = Mark.create({
  name: 'customMark',

  // マークを外せるかどうかを動的に決める
  clearable: () => {
    return editor.state.doc.textContent.length < 100
  },
})
```

デフォルトは `true` です。

### `addDecorations`

マークは [Extension API](extension.md#adddecorations) から `addDecorations` フックを引き継いでいます。これを使うと、**表示専用** の [デコレーション](../../../core-concepts/decorations.md)（ハイライト、検索結果、注釈、軽量なウィジェットなど）を追加できます。デコレーションはエディタ上にレンダリングされますが、ドキュメントを変更することもシリアライズされることもありません。詳しくは [デコレーションのガイド](../../../core-concepts/decorations.md) と [API リファレンス](../../../api/decorations.md) を参照してください。
