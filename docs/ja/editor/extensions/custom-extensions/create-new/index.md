# 新しい拡張機能を作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new)

拡張機能はゼロから自作できます。しかも、書き方は前述の既存の拡張機能を拡張する場合と同じです。

### 拡張機能を作る

拡張機能は Tiptap に新しい機能を追加するものです。このドキュメントでは、ノードやマークについても「拡張機能」という言葉を頻繁に使います。ただし、文字どおりの「拡張機能」も存在します。こちらはマークやノードと違ってスキーマに追加はできませんが、機能を足したりエディタの振る舞いを変えたりできます。

参考にするなら、[`TextAlign`](../../functionality/textalign.md) がよい例でしょう。

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  // ここにコードを書く。
})
```

コールバック関数を使って拡張機能を作ることもできます。イベントハンドラーやその他の独自ロジックを定義したいときなど、拡張機能のロジックをカプセル化したい場合に便利です。

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create(() => {
  // 拡張機能の中で使う変数や関数を定義する
  const customVariable = 'foo'

  function onCreate() {}
  function onUpdate() {}

  return {
    name: 'customExtension',
    onCreate,
    onUpdate,

    // ここにコードを書く。
  }
})
```

詳しくは [Extension API](extension.md) を参照してください。

### ノードを作る

ドキュメントを木構造と考えると、[ノード](../../nodes/index.md) はその木に含まれるコンテンツの一種にすぎません。参考にするなら [`Paragraph`](../../nodes/paragraph.md)、[`Heading`](../../nodes/heading.md)、[`CodeBlock`](../../nodes/code-block.md) がよい例です。

```js
import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',

  // ここにコードを書く。
})
```

コールバック関数を使ってノードを作ることもできます。イベントハンドラーやその他の独自ロジックを定義したいときなど、拡張機能のロジックをカプセル化したい場合に便利です。

```js
import { Node } from '@tiptap/core'

const CustomNode = Node.create(() => {
  // 拡張機能の中で使う変数や関数を定義する
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

ノードはブロックである必要はありません。[@メンション](../../nodes/mention.md) のように、テキストと並べてインラインでレンダリングすることもできます。

詳しくは [Node API](node.md) を参照してください。

### マークを作る

[ノード](../../nodes/index.md) にはマークを 1 つ以上適用でき、インラインの書式を付けるのに使います。参考にするなら [`Bold`](../../marks/bold.md)、[`Italic`](../../marks/italic.md)、[`Highlight`](../../marks/highlight.md) がよい例です。

```js
import { Mark } from '@tiptap/core'

const CustomMark = Mark.create({
  name: 'customMark',

  // ここにコードを書く。
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

詳しくは [Mark API](mark.md) を参照してください。

## 単体の拡張機能として公開する

Tiptap 用の拡張機能を自作して公開したい場合は、CLI ツールでプロジェクトのひな形を作れます。
`npm init tiptap-extension` を実行して指示に従うだけです。CLI が新しいフォルダを作り、Rollup で動くビルドスクリプトを含む設定済みのプロジェクトを用意します。

拡張機能をローカルでテストしたい場合は、そのプロジェクトのフォルダで `npm link` を実行し、使う側のプロジェクト（たとえば Vite アプリ）で `npm link YOUR_EXTENSION` を実行します。

## 共有する

すべて問題なく動いたら、ぜひ [コミュニティに共有](https://github.com/ueberdosis/tiptap/issues/819) するか、[awesome-tiptap](https://github.com/ueberdosis/awesome-tiptap) リポジトリに追加してください。
