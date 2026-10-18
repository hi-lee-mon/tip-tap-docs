# MarkdownManager API

> 原文: [https://tiptap.dev/docs/editor/markdown/api/markdown-manager](https://tiptap.dev/docs/editor/markdown/api/markdown-manager)

`MarkdownManager` クラスは単体で使えるクラスです。Markdown コンテンツを Tiptap のドキュメントモデルにパースする機能と、ドキュメントモデルを Markdown にシリアライズする機能を提供します。

## メソッド

### コンストラクター

```typescript
new MarkdownManager(options?: {
  marked?: typeof marked,
  markedOptions?: MarkedOptions,
  indentation?: {
    style?: 'space' | 'tab',
    size?: number,
  },
})
```

### `MarkdownManager.hasMarked()`

`marked` ライブラリが使えるかどうかに応じて、`true` または `false` を返します。

- **戻り値**: `boolean`

```js
const manager = new MarkdownManager()
manager.hasMarked() // true または false
```

### `MarkdownManager.registerExtension()`

Markdown コンテンツのパースとシリアライズに使う Tiptap 拡張機能を登録します。

- **戻り値**: `void`
- **パラメーター**:
  - `extension`: 登録する Tiptap 拡張機能

```js
const manager = new MarkdownManager()
manager.registerExtension(MyCustomExtension)
```

### `MarkdownManager.parse()`

Markdown 文字列をパースして Tiptap ドキュメントにします。

- **戻り値**: `JSON` - JSON 形式の Tiptap ドキュメント
- **パラメーター**:
  - `markdown`: パースする Markdown コンテンツの文字列

```js
const manager = new MarkdownManager()
const doc = manager.parse('# Hello World')
```

Markdown のパースでは、連続する空の段落が失われません。通常の空行による区切りに、必要に応じて `&nbsp;` の目印を組み合わせるからです。たとえば、連続する空の段落のうち最初のものは空行で表し、同じ並びの2つ目以降の空の段落は `&nbsp;` で表します。こうすることで、JSON に戻す往復変換のあとも空の段落が残ります。

### `MarkdownManager.serialize()`

Tiptap ドキュメントや JSON コンテンツを Markdown 文字列にシリアライズします。

- **戻り値**: `string` - シリアライズした Markdown 文字列
- **パラメーター**:
  - `content`: シリアライズする Tiptap ドキュメントまたは JSON コンテンツ

```js
const manager = new MarkdownManager()
const markdown = manager.serialize(doc)
```

### `MarkdownManager.renderNodeToMarkdown()`

ProseMirror のノード1つを、Markdown の表現にレンダリングします。

- **戻り値**: `string` - 指定したノードの Markdown 文字列
- **パラメーター**:
  - **node**: レンダリングする ProseMirror のノード
  - **parentNode**:（省略可）親の ProseMirror ノード
  - **index**:（省略可）親の中でのノードのインデックス
  - **level**:（省略可）ノードの入れ子の深さ

```
const manager = new MarkdownManager()
const markdown = manager.renderNodeToMarkdown(node)
```

レンダラーは、兄弟ノードの情報を `RenderContext.previousNode` で拡張機能に渡します。同じ階層の直前のノードに応じて処理を変えたいとき、たとえば連続する空の段落を残したいときに役立ちます。

### `MarkdownManager.renderNodes()`

ProseMirror のノードの配列をレンダリングし、1つにつなげた Markdown の表現を返します。

- **戻り値**: `string` - 指定したノードをつなげた Markdown 文字列
- **パラメーター**:
  - **nodes**: レンダリングする ProseMirror のノードの配列
  - **parentNode**:（省略可）親の ProseMirror ノード
  - **separator**:（省略可）レンダリングしたノードの間に入れる文字列。デフォルトは `''`
  - **level**:（省略可）ノードの入れ子の深さ。デフォルトは `0`
  - **level**: `number` - ノードの入れ子の深さ。デフォルトは `0`

## プロパティ

### `Markdown.instance`

Markdown コンテンツのパースに使う MarkedJS のインスタンスです。

### `Markdown.indentCharacter`

リストのインデントに使う文字です。デフォルトはスペース（`' '`）です。

### `Markdown.indentString`

リストのインデントに使う文字列です。デフォルトはスペース2つ（`'  '`）です。
