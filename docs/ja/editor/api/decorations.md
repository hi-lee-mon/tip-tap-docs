# デコレーション API

> 原文: [https://tiptap.dev/docs/editor/api/decorations](https://tiptap.dev/docs/editor/api/decorations)

デコレーションは、ドキュメント内の位置や範囲に付ける表示専用の目印です。拡張機能が宣言し、ドキュメントを変更することもシリアライズされることもありません。概念、例、デコレーションを使うべき場面については[デコレーションのガイド](../core-concepts/decorations.md)を読んでください。このページは API リファレンスです。

## `addDecorations`

すべての拡張機能（ノードとマークを含む）が持つライフサイクルフックです。拡張機能が提供するデコレーションを表す `DecorationSpec` を返します。デコレーションがなければ `null` を返します。全拡張機能の宣言は、Tiptap 内部のデコレーションマネージャーが 1 つの ProseMirror プラグインにまとめます。

ほかの拡張機能のフックと同じく、`addDecorations()` の `this` には `{ name, options, storage, editor, type, parent }` がバインドされます。

```ts
import { Decoration, Extension } from '@tiptap/core'

const MyExtension = Extension.create({
  name: 'myExtension',

  addDecorations() {
    return {
      create: ({ editor, state, view }) => [Decoration.Inline(1, 5, { class: 'highlight' })],
    }
  },
})
```

### `DecorationSpec`

`DecorationSpec` は、`update` の戦略によって形が決まる判別共用体です。どの戦略でも、初期化と強制更新には `create` を使います。

| プロパティ        | 型                                                                   | 説明                                                                                                         |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `update`        | `'document' \| 'changedRanges' \| 'manual'`                            | デコレーションの更新方法を決める。デフォルトは `'document'`。                                                          |
| `create`        | `(props: { editor; state; view }) => Decoration[]`           | **必須。** デコレーション一式を組み立てる。初期化と `updateDecorations()` で使われる。                               |
| `shouldUpdate`  | `(props: { editor; tr; oldState; newState }) => boolean`               | `document` と `changedRanges` で省略可。`false` を返すと、作り直さずにマッピングだけ行う。デフォルトは `tr.docChanged`。 |
| `createInRange` | `(props: { editor; state; view; from; to }) => Decoration[]` | `changedRanges` でのみ必須。渡されたブロック単位の範囲内に起点を持つデコレーションを返す。            |

> [!WARNING]
> **状態は editor.state ではなく引数の state から読む**
>
> `create()` と `createInRange()` の中では、ドキュメントを必ず `editor.state` ではなく引数の
> `state` から読んでください。トランザクションの途中では、エディタのビューの状態はまだ更新されて
> いないため、`editor.state` はトランザクション前のドキュメントを指しています。組み立て中の正しい
> 状態は引数の `state` です。`create()` の中で `editor.state` が読まれたことを検出すると、
> Tiptap は開発時の警告を出します。

> [!WARNING]
> **create と createInRange で例外を投げてはいけない**
>
> `create()` と `createInRange()` は ProseMirror の状態更新サイクルの中で実行されます。ここで例外が
> 投げられると、エディタの状態が不整合になるおそれがあります。失敗しうる処理（正規表現のコンパイル、
> 外部データへのアクセスなど）は try/catch で囲み、失敗したら空の配列を返してください。

### `DecorationUpdateStrategy`

```ts
type DecorationUpdateStrategy = 'document' | 'changedRanges' | 'manual'
```

- `document` は、ドキュメントが変わるたびに `create` で一式を作り直します。これがデフォルトで、常に正しく動きます。
- `changedRanges` は、既存のデコレーションをマッピングし、変更のあったブロック単位の範囲についてだけ `createInRange` を呼びます。ブロック内で完結するデコレーションにだけ使ってください。
- `manual` は、`updateDecorations()` を呼ぶまで現在のデコレーションを保持します。

`shouldUpdate` は `document` と `changedRanges` で使えます。`manual` では使えません。manual のデコレーションは、明示的に求めたときにしか更新されないからです。

> [!WARNING]
> **createInRange の取り決め**
>
> `createInRange` が返してよいのは、開始位置が `[from, to)` の範囲内にあるデコレーション**だけ**です。
> インラインとノードのデコレーションでは `from`、ウィジェットのデコレーションでは `pos` を開始位置と
> します。`to` は範囲に含みません。`to` は次のブロックの開始位置で、そのブロックが作り直しを担うため、
> `to` に起点を持つデコレーションは無視されます。ただし最後のブロックは例外で、ドキュメントの末尾も
> 担当します。範囲外のコンテンツに依存するデコレーションには、代わりに `document` 戦略を使ってください。

戦略の選び方と、changed-range 方式で正しく動かすための制約については「[パフォーマンス](../core-concepts/decorations.md#performance)」を参照してください。

## `Decoration`

`Decoration` は `@tiptap/core` からインポートします。その静的メソッドで、Tiptap に何を表示させるかを表すデコレーションのインスタンスを作ります。作ったインスタンスは `create` と `createInRange` から返します。

3 つのメソッドはいずれも `Decoration`（`InlineDecoration`、`NodeDecoration`、`WidgetDecoration` のどれか）を返します。

| メソッド              | 戻り値             | 説明                                                            |
| ------------------- | ------------------- | ---------------------------------------------------------------------- |
| `Decoration.Node`   | `NodeDecoration`    | 1 つのノードの DOM ラッパーに属性を追加する。                        |
| `Decoration.Inline` | `InlineDecoration`  | インラインコンテンツの範囲を、スタイル付きの span で包む。                      |
| `Decoration.Widget` | `WidgetDecoration`  | 1 つの位置にウィジェット（DOM ノード）を挿入する。`key` は必須。 |

### デコレーションのクラス

`Decoration` は抽象基底クラスで、`InlineDecoration`、`NodeDecoration`、`WidgetDecoration` がこれを継承します。どのインスタンスも `kind`（`'inline' | 'node' | 'widget'`）、`anchor`（開始位置）、ProseMirror のデコレーションに変換する `toPMDecoration(extensionName?)` メソッドを持ちます。

ProseMirror のデコレーションへの変換は Tiptap が行います。

### `Decoration.Node`

```ts
Decoration.Node(
  pos: number,
  to: number,
  attrs?: DecorationAttrs,
  spec?: Record<string, any>,
)
```

**引数**

- `pos` – ノードの開始位置。
- `to` – ノードの終了位置。
- `attrs` – 省略可。`DecorationAttrs` で、`class`、`style`、`nodeName` のほか任意の HTML 属性を指定できる。
- `spec` – 省略可。ProseMirror のデコレーションの spec。

```ts
Decoration.Node(pos, pos + node.nodeSize, { class: 'is-heading' })
```

### `Decoration.Inline`

```ts
Decoration.Inline(
  from: number,
  to: number,
  attrs?: DecorationAttrs,
  spec?: Record<string, any>,
)
```

**引数**

- `from` – インライン範囲の開始位置。
- `to` – インライン範囲の終了位置。
- `attrs` – 省略可。`DecorationAttrs` で、`class`、`style`、`nodeName` のほか任意の HTML 属性を指定できる。
- `spec` – 省略可。ProseMirror のデコレーションの spec。

```ts
Decoration.Inline(matchFrom, matchTo, { class: 'is-match' })
```

### `Decoration.Widget`

```ts
Decoration.Widget(
  pos: number,
  render: (view: EditorView, getPos: () => number | undefined) => HTMLElement,
  options: {
    key: string
    side?: number
    relaxedSide?: boolean
    marks?: readonly Mark[]
    stopEvent?: (e: Event) => boolean
    ignoreSelection?: boolean
    destroy?: (node: Node) => void
    [k: string]: any
  },
)
```

**引数**

- `pos` – ウィジェットをレンダリングする位置。
- `render` – `view` と `getPos` アクセサーを受け取り、`HTMLElement` を返すコールバック。
- `options.key` – **必須。** 安定していて、位置に依存せず、グローバルに一意なキー。「[ウィジェットのキー](../core-concepts/decorations.md#widget-keys)」を参照。1 回の組み立てで同じキーのウィジェットデコレーションが 2 つ見つかると、Tiptap は開発時の警告を出す。
- `options.side` – 省略可。ウィジェットを位置のどちら側に寄せるか（ProseMirror の [`Decoration.widget`](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget) を参照）。
- `options.relaxedSide` – 省略可。DOM の選択範囲がウィジェットのどちら側にあってもよいことにする。
- `options.marks` – 省略可。ウィジェットに適用するマーク。
- `options.stopEvent` – 省略可。`true` を返すと、ウィジェットで発生したイベントを ProseMirror が処理しなくなる。
- `options.ignoreSelection` – 省略可。ウィジェット内の選択範囲の変化を ProseMirror が同期しないようにする。
- `options.destroy` – 省略可。ProseMirror がウィジェットを取り除くときやエディタを破棄するときに、ウィジェットの DOM ノードを引数に呼ばれる。`ReactWidgetRenderer` や `VueWidgetRenderer` で作ったウィジェットでは呼ばれない。フレームワークのレンダラーが自前で後始末をするため。

```ts
Decoration.Widget(
  matchFrom,
  () => {
    const el = document.createElement('span')
    el.textContent = '★'
    return el
  },
  // このウィジェットは状態を持たないので、位置ベースのキーでも問題ない
  { key: `marker-${matchFrom}`, side: -1 },
)
```

> [!WARNING]
> **ウィジェットのキーは安定していて一意でなければならない**
>
> ProseMirror が再描画をまたいでウィジェットの DOM を再利用するのは、キーが前回のレンダリングと
> 一致したときだけです。また、キーはグローバルに一意である必要があります。重複したキーや位置から
> 作ったキーは、ちらつき、状態の消失、クラッシュの原因になります。ルールの全体は
> 「[ウィジェットのキー](../core-concepts/decorations.md#widget-keys)」を参照してください。

## `updateDecorations`

ドキュメント全体のデコレーションを作り直すコマンドです。この更新では、拡張機能の更新方式と `shouldUpdate` を無視します。検索語など、ドキュメントの外にある値を変えたあとに使います。

```ts
editor.commands.updateDecorations() // すべての拡張機能を更新する
editor.commands.updateDecorations('myExtension') // 1 つの拡張機能だけ更新する
```

**引数**

- `extensionName` は省略可能です。拡張機能名を渡すと、その拡張機能だけを更新します。省略すると、すべての拡張機能を更新します。

よくある使い方は「[ストレージ経由で実行時のパラメーターを渡す](../core-concepts/decorations.md#runtime-parameters-via-storage)」パターンを参照してください。

## `ReactWidgetRenderer`

インポート: `import { ReactWidgetRenderer } from '@tiptap/react'`。`create` や `createInRange` から返す `WidgetDecoration` を返します。Tiptap の `ReactRenderer` のポータルの仕組みを再利用するため、コンポーネントはエディタの React ツリーの中に置かれます（コンテキストやフックは通常どおり動きます）。コンポーネントには、追加で `editor` と `getPos` が props として渡されます。

```tsx
import { Extension } from '@tiptap/core'
import { ReactWidgetRenderer } from '@tiptap/react'

function CommentMarker({ editor, getPos, label }: { editor: Editor; getPos: () => number | undefined; label: string }) {
  return <button onClick={() => console.log(getPos())}>{label}</button>
}

const Comments = Extension.create({
  name: 'comments',

  addDecorations() {
    return {
      create: ({ editor, state }) =>
        findComments(state.doc).map(c =>
          ReactWidgetRenderer(CommentMarker, {
            editor,
            pos: c.pos,
            key: `comment-${c.id}`, // ドメインに基づく安定したキー → コンポーネントの状態が保たれる
            props: { label: c.label },
          }),
        ),
    }
  },
})
```

| オプション            | 型                        | 説明                                                                           |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| `editor`          | `Editor`                    | エディタのインスタンス。                                                                  |
| `pos`             | `number`                    | レンダリングするドキュメント内の位置。                                                   |
| `key`             | `string`                    | 安定した一意なキー。「[ウィジェットのキー](../core-concepts/decorations.md#widget-keys)」を参照。 |
| `props`           | `P`                         | コンポーネントに渡す props。                                                             |
| `as`              | `string`                    | ラッパーのタグ。デフォルトは `'span'`。                                                    |
| `className`       | `string`                    | ラッパー要素に付けるクラス。                                                 |
| `side`            | `number`                    | ProseMirror のウィジェットをどちら側に寄せるか。                                                         |
| `relaxedSide`     | `boolean`                   | DOM の選択範囲がウィジェットのどちら側にあってもよいことにする。                                 |
| `marks`           | `readonly Mark[]`           | ウィジェットに適用するマーク。                                                          |
| `stopEvent`       | `(event: Event) => boolean` | 選んだウィジェットのイベントが ProseMirror に届かないようにする。                                |
| `ignoreSelection` | `boolean`                   | ウィジェット内の選択範囲の変化を同期しないようにする。                             |
| `destroy`         | `(node: Node) => void`      | フレームワークのレンダラーが取り除かれたあとに、独自の後始末を実行する。                           |

> [!NOTE]
> **props とレンダラーのキャッシュ**
>
> `create` / `createInRange` が再実行されるたびに、新しい `props` が渡されます（ProseMirror は DOM を
> 再利用するときに `toDOM` を呼ばないため、そこで props を渡すことはできません）。キーごとの
> レンダラーはキャッシュされて再利用されるので、編集をまたいでもコンポーネントの状態が残ります。
> キャッシュはエディタの破棄時に片付けられます。

完全な例は [React でのデコレーションのチュートリアル](../../guides/decorations-react.md)を参照してください。

## `VueWidgetRenderer`

インポート: `import { VueWidgetRenderer } from '@tiptap/vue-3'`（または `'@tiptap/vue-2'`）。考え方は React のレンダラーと同じです。Tiptap の `VueRenderer` を再利用するため、コンポーネントはエディタのアプリのコンテキストを共有します（`provide` / `inject` が使えます）。コンポーネントには、指定した `props` に加えて `editor` と `getPos` が渡されます。

```ts
import { Extension } from '@tiptap/core'
import { VueWidgetRenderer } from '@tiptap/vue-3'
import CommentMarker from './CommentMarker.vue'

const Comments = Extension.create({
  name: 'comments',

  addDecorations() {
    return {
      create: ({ editor, state }) =>
        findComments(state.doc).map(c =>
          VueWidgetRenderer(CommentMarker, {
            editor,
            pos: c.pos,
            key: `comment-${c.id}`,
            props: { label: c.label },
          }),
        ),
    }
  },
})
```

| オプション            | 型                        | 説明                                                                           |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| `editor`          | `Editor`                    | エディタのインスタンス。                                                                  |
| `pos`             | `number`                    | レンダリングするドキュメント内の位置。                                                   |
| `key`             | `string`                    | 安定した一意なキー。「[ウィジェットのキー](../core-concepts/decorations.md#widget-keys)」を参照。 |
| `props`           | `Record<string, any>`       | コンポーネントに渡す props。                                                             |
| `side`            | `number`                    | ProseMirror のウィジェットをどちら側に寄せるか。                                                         |
| `relaxedSide`     | `boolean`                   | DOM の選択範囲がウィジェットのどちら側にあってもよいことにする。                                 |
| `marks`           | `readonly Mark[]`           | ウィジェットに適用するマーク。                                                          |
| `stopEvent`       | `(event: Event) => boolean` | 選んだウィジェットのイベントが ProseMirror に届かないようにする。                                |
| `ignoreSelection` | `boolean`                   | ウィジェット内の選択範囲の変化を同期しないようにする。                             |
| `destroy`         | `(node: Node) => void`      | フレームワークのレンダラーが取り除かれたあとに、独自の後始末を実行する。                           |

> [!WARNING]
> **Vue 固有の要件**
>
> コンポーネントは**ルート要素を 1 つだけレンダリングする**必要があります。`editor` は意図的に
> （`markRaw` で）生のまま渡しています。リアクティブにしないでください。

完全な例は [Vue 3 でのデコレーションのチュートリアル](https://tiptap.dev/docs/guides/decorations-vue)を参照してください。

## `liveWidgetKeys`

インポート: `import { liveWidgetKeys } from '@tiptap/core'`。

```ts
import { liveWidgetKeys } from '@tiptap/core'

const keys = liveWidgetKeys(editor)
```

現在有効なすべてのウィジェットデコレーションのキーを返します。フレームワーク向けのウィジェットレンダラーは、取り壊されるウィジェットが本当に消えたのか、新しい位置に付け替えられただけなのかを、内部でこれを使って判断します（キーがまだ有効なレンダラーを破棄しないためです）。

> [!TIP]
> **上級者向け**
>
> ほとんどのユーザーには `liveWidgetKeys` は不要です。独自のウィジェットレンダラーを作る上級者のために
> 用意されています。

## `createWidgetDecoration`

インポート: `import { createWidgetDecoration } from '@tiptap/core'`。

`ReactWidgetRenderer` と `VueWidgetRenderer` の土台になっている、フレームワークに依存しないヘルパーです。エディタごとのレンダラーのキャッシュ、props の差分検出、props の遅延反映、キーの付け替えに対する保護、ProseMirror のオプションの受け渡しを担います。React でも Vue でもない独自のレンダラーでウィジェットを作りたいときに使います。

```ts
import { createWidgetDecoration } from '@tiptap/core'
import type { WidgetRenderer } from '@tiptap/core'

// 最小限のレンダラー。WidgetRenderer には updateProps と destroy が必要
// element は materialize が ProseMirror に渡すもの
class MyRenderer implements WidgetRenderer {
  element: HTMLElement

  constructor(renderProps: Record<string, any>) {
    // renderProps には props と context（{ editor, getPos }）がマージ済み
    this.element = document.createElement('span')
    this.element.textContent = renderProps.label
  }

  updateProps(props: Record<string, any>) { /* ... */ }
  destroy() { /* ... */ }
}

const WIDGET_CACHE = Symbol('myWidgetCache')

// addDecorations の create() の中で:
createWidgetDecoration<MyRenderer>({
  editor,
  pos,
  key: `my-widget-${id}`,
  props: { label: 'hello' },
  cacheKey: WIDGET_CACHE,
  context: getPos => ({ editor, getPos }),
  create: renderProps => new MyRenderer(renderProps),
  materialize: renderer => renderer.element,
})
```

| オプション         | 型                                              | 説明                                                                                                  |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `editor`       | `Editor`                                          | エディタのインスタンス。レンダラーのキャッシュはここに保存される。                                                     |
| `pos`          | `number`                                          | レンダリングするドキュメント内の位置。                                                                          |
| `key`          | `string`                                          | 安定した一意なキー。「[ウィジェットのキー](../core-concepts/decorations.md#widget-keys)」を参照。                        |
| `props`        | `Record<string, any>`                             | レンダラーに渡す props。レンダリングのたびに `context` とマージされる。                                          |
| `cacheKey`     | `symbol`                                          | レンダラーのキャッシュを保存するときのシンボル。キャッシュが混ざらないよう、フレームワークごとに 1 つ使う。                   |
| `context`      | `(getPos) => Record<string, any>`                 | 毎回のレンダリングにマージする追加の props（`editor` や `getPos` など）。実体化のたびに呼ばれる。     |
| `create`       | `(props) => WidgetRenderer`                       | 最初のマウント時にレンダラーを作る。`props` と `context` はマージ済みの状態で渡される。                          |
| `materialize`  | `(renderer) => HTMLElement`                       | ProseMirror が挿入する要素を返す。                                                                     |
| `side`         | `number`                                          | ProseMirror のウィジェットをどちら側に寄せるか。                                                                                |
| `relaxedSide`  | `boolean`                                         | DOM の選択範囲がウィジェットのどちら側にあってもよいことにする。                                                        |
| `marks`        | `readonly Mark[]`                                 | ウィジェットに適用するマーク。                                                                                 |
| `stopEvent`    | `(event: Event) => boolean`                       | 選んだウィジェットのイベントが ProseMirror に届かないようにする。                                                       |
| `ignoreSelection` | `boolean`                                      | ウィジェット内の選択範囲の変化を同期しないようにする。                                                    |
| `destroy`      | `(node: Node) => void`                            | レンダラーが取り除かれたあとに、独自の後始末を実行する。                                                            |

> [!TIP]
> **上級者向け**
>
> ほとんどのユーザーは `ReactWidgetRenderer` か `VueWidgetRenderer` を使ってください。
> `createWidgetDecoration` は、独自のフレームワーク向けレンダラー（Solid、Svelte など）を作る人のために
> 用意されています。
