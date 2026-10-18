# Extension API

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/extension](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/extension)

Tiptap の強みは柔軟性にあります。拡張機能をゼロから自作して、ニーズに合わせた独自のエディタ体験を作れます。

ノード、マーク、機能の変更のどれを作る場合も、拡張機能の基本構造は同じです。そもそも、Tiptap のすべては拡張機能を土台にしています。

## 拡張機能を作る

拡張機能は Tiptap に新しい機能を追加するものです。このドキュメントでは、ノードやマークについても「拡張機能」という言葉を頻繁に使います。ただし、文字どおりの「拡張機能」も存在します。こちらはマークやノードと違ってスキーマに追加はできませんが、機能を足したりエディタの振る舞いを変えたりできます。

よい例は、エディタのイベントを監視して何かをする拡張機能です。たとえば次のようなものです。

```typescript
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  onUpdate() {
    console.log(this.editor.getJSON())
  },
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

この拡張機能は、エディタの `update` イベントを監視し、エディタの現在の JSON 表現をコンソールに出力します。

エディタには次のように組み込みます。

```typescript
import { Editor } from '@tiptap/core'

const editor = new Editor({
  extensions: [CustomExtension],
})

// React や Vue を使う場合

const editor = useEditor({
  extensions: [CustomExtension],
})
```

extensions 配列には、拡張機能をいくつでも入れられます。拡張機能は配列に並べた順に組み込まれるか、`priority` プロパティに従って並べ替えられます。

拡張機能の基本構造がわかったところで、拡張機能を自作するときに使えるオプションをひとつずつ説明します。

## 拡張機能のオプション

拡張機能を作るときは、利用者が設定できるオプションを定義できます。オプションを使って、拡張機能の振る舞いをカスタマイズしたり、機能を追加したりできます。

### `name`

拡張機能の名前です。エディタの拡張機能マネージャーが、拡張機能を識別するのに使います。

```typescript
const CustomExtension = Extension.create({
  name: 'customExtension',
})
```

拡張機能がノードやマークの場合、名前はエディタのスキーマでノードやマークを識別するのに使われます。そのため、エディタのコンテンツの JSON 表現にも保存されます。詳しくは [コンテンツを JSON で保存する](../../../../guides/output-json-html.md#option-1-json) を参照してください。

### `priority`

priority は、拡張機能を登録する順番を決めます。デフォルトの priority は `100` で、ほとんどの拡張機能がこの値です。priority が高い拡張機能ほど先に読み込まれます。

```js
import Link from '@tiptap/extension-link'

const CustomLink = Link.extend({
  priority: 1000,
})
```

拡張機能を読み込む順番は、次の 2 つに影響します。

1. プラグインの順番（priority が高い拡張機能の ProseMirror プラグインが先に実行される）
2. スキーマの順番

たとえば [`Link`](../../marks/link.md) マークは priority が高いため、`<strong><a href="…">Example</a></strong>` ではなく `<a href="…"><strong>Example</strong></a>` としてレンダリングされます。

### `addOptions`

`addOptions` メソッドでは、拡張機能のオプションを定義します。利用者が設定できるオプションを持つオブジェクトを返してください。

```typescript
type CustomExtensionOptions = {
  customOption: string
}

declare module '@tiptap/core' {
  interface ExtensionOptions {
    customOption: CustomExtensionOptions
  }
}

const CustomExtension = Extension.create<CustomExtensionOptions>({
  name: 'customExtension',

  addOptions() {
    return {
      customOption: 'default value',
    }
  },
})
```

これで、拡張機能を組み込むときに設定を指定できるようになります。

```typescript
const editor = new Editor({
  extensions: [CustomExtension.configure({ customOption: 'new value' })],
})
```

### `addStorage`

`addStorage` メソッドでは、拡張機能のストレージ（実質的にはシンプルな状態管理の仕組み）を定義します。拡張機能が使うストレージを持つオブジェクトを返してください。

```typescript
type CustomExtensionStorage = {
  customValue: string
}

declare module '@tiptap/core' {
  interface ExtensionStorage {
    customExtension: CustomExtensionStorage
  }
}

const CustomExtension = Extension.create<any, CustomExtensionStorage>({
  name: 'customExtension',

  addStorage() {
    return {
      customValue: 'default value',
    }
  },
})
```

これで、拡張機能の中からストレージにアクセスできるようになります。

```typescript
const CustomExtension = Extension.create<any, CustomExtensionStorage>({
  name: 'customExtension',

  addStorage() {
    return {
      customValue: 'default value',
    }
  },

  onUpdate() {
    console.log(this.storage.customValue) // 'default value'
  },
})
```

エディタからもアクセスできます。

```typescript
const editor = new Editor({
  extensions: [CustomExtension],
})

editor.storage.customExtension.customValue // 'default value'
```

> [!NOTE]
> **注意**
>
> `editor.storage` は、拡張機能の名前ごとに名前空間が分かれています。

### `addCommands`

`addCommands` メソッドでは、拡張機能のコマンドを定義します。利用者が実行できるコマンドを持つオブジェクトを返してください。

```typescript
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customExtension: {
      customCommand: () => ReturnType
    }
  }
}

const CustomExtension = Extension.create({
  name: 'customExtension',

  addCommands() {
    return {
      customCommand:
        () =>
        ({ commands }) => {
          return commands.setContent('Custom command executed')
        },
    }
  },
})
```

> [!WARNING]
> **addCommands の中では commands 引数を使う**
>
> `addCommands` の中でほかのコマンドにアクセスするには、渡される `commands` 引数を使ってください。

これで、利用者がコマンドを実行できるようになります。

```typescript
const editor = new Editor({
  extensions: [CustomExtension],
})

editor.commands.customCommand() // 'Custom command executed'
editor.chain().customCommand().run() // 'Custom command executed'
```

### `addKeyboardShortcuts`

`addKeyboardShortcuts` メソッドでは、キーボードショートカットを定義します。利用者が使えるキーボードショートカットを持つオブジェクトを返してください。

```typescript
const CustomExtension = Extension.create({
  name: 'customExtension',

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        console.log('Keyboard shortcut executed')
      },
    }
  },
})
```

これで、利用者がキーボードショートカットを使えるようになります。

### `addInputRules`

入力ルールでは、正規表現を定義してユーザーの入力を監視できます。Markdown のショートカットや、[`Typography`](../../functionality/typography.md) 拡張機能で `(c)` のようなテキストを `©` に変換する（ほかにも多数あります）といった用途に使われます。マークには `markInputRule` ヘルパー関数を、ノードには `nodeInputRule` を使ってください。

デフォルトでは、両側をチルダ 2 つで囲んだテキストが ~~取り消し線付きのテキスト~~ に変換されます。チルダは片側 1 つずつで十分だと考えるなら、次のように入力ルールを上書きできます。

```typescript
import { Extension } from '@tiptap/core'
import { markInputRule } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addInputRules() {
    return [
      markInputRule({
        find: /(?:~)((?:[^~]+))(?:~)$/,
        type: this.editor.schema.marks.strike,
      }),
    ]
  },
})
```

これで `~striked text~` と入力すると、~~striked text~~ に変換されます。

入力ルールについて詳しくは、[入力ルール](../../../api/input-rules.md) のドキュメントを参照してください。

### `addPasteRules`

貼り付けルールは、前述の入力ルールと同じように動きます。ただし、ユーザーの入力を監視するのではなく、貼り付けたコンテンツに適用されます。

正規表現には小さな違いがひとつあります。入力ルールは通常、末尾が `$`（「行末の位置にあること」を表す）で終わります。一方、貼り付けルールは通常コンテンツ全体を検索するため、この `$` を付けません。

前述の例を貼り付けルールに当てはめると、次のようになります。

```typescript
import { Extension } from '@tiptap/core'
import { markPasteRule } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addPasteRules() {
    return [
      markPasteRule({
        find: /(?:~)((?:[^~]+))(?:~)/g,
        type: this.editor.schema.marks.strike,
      }),
    ]
  },
})
```

貼り付けルールについて詳しくは、[貼り付けルール](../../../api/paste-rules.md) のドキュメントを参照してください。

### `transformPastedHTML`

`transformPastedHTML` メソッドを使うと、貼り付けた HTML コンテンツを、パースしてエディタに挿入する前に変換できます。スタイルの除去、危険なコンテンツの削除、エディタの要件に合わせた HTML の修正などに便利です。

#### 仕組み

ユーザーがエディタにコンテンツを貼り付けると、次のように処理されます。

1. 拡張機能を priority で並べ替える（priority が高いものが先に実行される）
2. 各拡張機能の `transformPastedHTML` を順番に呼び出す
3. 各変換は、前の変換の出力を受け取る
4. 最終的に変換された HTML をパースして、エディタに挿入する

#### 基本的な例

```typescript
import { Extension } from '@tiptap/core'

const CleanStylesExtension = Extension.create({
  name: 'cleanStyles',

  transformPastedHTML(html) {
    // インラインの style 属性をすべて取り除く
    return html.replace(/\s+style="[^"]*"/gi, '')
  },
})
```

#### 変換をつなげる例

同じ貼り付けコンテンツを、複数の拡張機能で変換できます。順番は `priority` オプションで制御します。

```typescript
// 拡張機能 1: スクリプトを取り除く（最初に実行、priority: 110）
const SecurityExtension = Extension.create({
  name: 'security',
  priority: 110,

  transformPastedHTML(html) {
    let cleanHtml = html

    // script タグを取り除く
    cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // イベントハンドラー属性（onclick、onerror など）を取り除く
    cleanHtml = cleanHtml.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')

    // href から javascript: プロトコルを取り除く（ダブルクォート、シングルクォート、クォートなしの属性に対応）
    cleanHtml = cleanHtml.replace(
      /href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]*)/gi,
      'href="#"',
    )

    return cleanHtml
  },
})

// 拡張機能 2: スタイルを取り除く（2 番目に実行、priority: 100）
const CleanStylesExtension = Extension.create({
  name: 'cleanStyles',
  priority: 100,

  transformPastedHTML(html) {
    return html.replace(/\s+style="[^"]*"/gi, '')
  },
})
```

この例では、次の順に処理されます。

1. `SecurityExtension` が最初に実行され（priority 110）、危険なコンテンツを取り除く
2. `CleanStylesExtension` が `SecurityExtension` の出力を受け取り、スタイルを取り除く
3. 最終的にきれいになった HTML がエディタに挿入される

#### 拡張機能のコンテキストを使う

このメソッドからは、`this` を通じて拡張機能のコンテキストにアクセスできます。

```typescript
const ConditionalCleanup = Extension.create({
  name: 'conditionalCleanup',

  addOptions() {
    return {
      removeStyles: true,
      removeClasses: false,
    }
  },

  transformPastedHTML(html) {
    let cleanHtml = html

    // 拡張機能のオプションにアクセスする
    if (this.options.removeStyles) {
      cleanHtml = cleanHtml.replace(/\s+style="[^"]*"/gi, '')
    }

    if (this.options.removeClasses) {
      cleanHtml = cleanHtml.replace(/\s+class="[^"]*"/gi, '')
    }

    // エディタのインスタンスにアクセスする
    this.editor.emit('htmlTransformed', { original: html, transformed: cleanHtml })

    return cleanHtml
  },
})
```

#### よくあるユースケース

Google ドキュメントの書式を取り除く例です。

```typescript
const GoogleDocsCleanup = Extension.create({
  name: 'googleDocsCleanup',

  transformPastedHTML(html) {
    return (
      html
        // インラインスタイル付きの Google ドキュメントの span を取り除く
        .replace(/<span[^>]*style="[^"]*"[^>]*>(.*?)<\/span>/gi, '$1')
        // Google ドキュメントの ID を取り除く
        .replace(/\s+id="docs-internal-[^"]*"/gi, '')
        // 空の span を取り除く
        .replace(/<span>(.*?)<\/span>/gi, '$1')
    )
  },
})
```

Microsoft Word の書式を取り除く例です。

```typescript
const WordCleanup = Extension.create({
  name: 'wordCleanup',

  transformPastedHTML(html) {
    return (
      html
        // Word 固有のクラスを取り除く
        .replace(/\s+class="Mso[^"]*"/gi, '')
        // Word 固有のタグを取り除く
        .replace(/<o:p>.*?<\/o:p>/gi, '')
        // 条件付きコメントを取り除く
        .replace(/<!--\[if.*?<!\[endif\]-->/gs, '')
    )
  },
})
```

### イベント

[イベントリスナー](../../../api/events.md) を別の拡張機能に移すこともできます。すべてのイベントのリスナーを書いた例を示します。

```typescript
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  onBeforeCreate() {
    // エディタがこれから作成される。
  },
  onCreate() {
    // エディタの準備ができた。
  },
  onUpdate() {
    // コンテンツが変わった。
  },
  onSelectionUpdate({ editor }) {
    // 選択範囲が変わった。
  },
  onTransaction({ transaction }) {
    // エディタの状態が変わった。
  },
  onFocus({ event }) {
    // エディタにフォーカスが当たった。
  },
  onBlur({ event }) {
    // エディタからフォーカスが外れた。
  },
  onDestroy() {
    // エディタが破棄されようとしている。
  },
})
```

### `dispatchTransaction`

このフックを使うと、トランザクションがディスパッチされる前に割り込んで、内容を変更できます。Koa や Express に似た **ミドルウェアのようなパターン** を採用しており、各拡張機能は `transaction` と `next` 関数を受け取ります。

#### 仕組み

1.  **ミドルウェアのチェーン**: トランザクションがディスパッチされると、Tiptap は `dispatchTransaction` フックを定義しているすべての拡張機能をチェーンにつなぎます。
2.  **priority 順**: チェーンは [拡張機能の priority](#priority) で並べ替えられます。priority が **高い** 拡張機能（例: `1000`）ほどチェーンの **前のほう** で呼び出され、priority が低い拡張機能を外側から包みます。
3.  **次へ渡す**: トランザクションをチェーンの次の拡張機能に渡すには、必ず `next(transaction)` を呼び出してください。最後の `next()` 呼び出しが、トランザクションをエディタ本来のディスパッチ関数（定義している場合は独自の `editorProps.dispatchTransaction`）に渡します。
4.  **トランザクションを止める**: `next(transaction)` を呼び出さないと、トランザクションはそこで止まり、エディタには届きません。

```typescript
import { Extension } from '@tiptap/core'

const LoggingExtension = Extension.create({
  name: 'loggingExtension',
  priority: 1000, // 早い段階で実行される

  dispatchTransaction({ transaction, next }) {
    console.log('Intercepting transaction before others...')

    // 必要ならここでトランザクションを変更できる
    // transaction.setMeta('customMeta', true)

    // next を呼び出して、次の拡張機能に渡す
    next(transaction)

    console.log('Transaction has been processed by the rest of the chain.')
  },
})
```

#### ミドルウェアのライフサイクル

各拡張機能は次の拡張機能を「包んで」いるので、トランザクションがチェーンの残り（とエディタ自体）で処理される前と後の両方でコードを実行できます。

```typescript
dispatchTransaction({ transaction, next }) {
  // 1. 前処理: next() より前のコード
  const start = performance.now()

  next(transaction)

  // 2. 後処理: next() より後のコード
  const end = performance.now()
  console.log(`Dispatch took ${end - start}ms`)
}
```

### `addProseMirrorPlugins`

拡張機能に ProseMirror プラグインを追加できます。ProseMirror プラグインでエディタを拡張したい場合に便利です。

#### 既存の ProseMirror プラグインを使う

次の例のように、既存の ProseMirror プラグインを Tiptap の拡張機能で包めます。

```typescript
import { history } from '@tiptap/pm/history'

const History = Extension.create({
  addProseMirrorPlugins() {
    return [
      history(),
      // …
    ]
  },
})
```

#### ProseMirror プラグインを作る

独自の ProseMirror プラグインを作ることもできます。コンソールにメッセージを出力する独自の ProseMirror プラグインの例を示します。

```typescript
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customPlugin'),
        view() {
          return {
            update() {
              console.log('Custom plugin updated')
            },
          }
        },
      }),
    ]
  },
})
```

ProseMirror プラグインについて詳しくは、[ProseMirror のドキュメント](https://prosemirror.net/docs/ref/#state.Plugin) を参照してください。

### `addDecorations`

`addDecorations` メソッドは、エディタに [デコレーション](../../../core-concepts/decorations.md) を追加します。デコレーションは、ハイライト、検索結果、小さなウィジェットなどに使います。ユーザーに見えるものは変わりますが、保存されるドキュメントは変わりません。

デコレーションは、`@tiptap/core` からインポートした `Decoration` クラスで作ります。

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

`Decoration` クラスには 3 つの静的メソッドがあります。`Decoration.Node`（ノードの DOM ラッパーに属性を付ける）、`Decoration.Inline`（範囲にスタイル付きの span をかぶせる）、`Decoration.Widget`（指定位置に DOM ノードやフレームワークのコンポーネントを置く）です。大きなドキュメントでは、`shouldUpdate` で再計算するかどうかを制御したり、`update: 'changedRanges'` で編集したブロックだけを作り直したりできます。いつでも全体を作り直したい場合は、`editor.commands.updateDecorations()` を使ってください。

> [!NOTE]
> **表示専用の目印にはデコレーションを使う**
>
> 目印が純粋に見た目だけのものなら、`addDecorations` を使います。ドキュメントに保存する独自の
> コンテンツや、編集可能な独自のブロックが必要なら、代わりに [ノード
> ビュー](../node-views/index.md) を使ってください。

3 種類のデコレーションとパフォーマンスの工夫については [デコレーションのガイド](../../../core-concepts/decorations.md) を、手順を追って学ぶなら [Vanilla JS](https://tiptap.dev/docs/guides/decorations-vanilla)、[React](../../../../guides/decorations-react.md)、[Vue 3](https://tiptap.dev/docs/guides/decorations-vue) のチュートリアルを、各シグネチャについては [デコレーションの API リファレンス](../../../api/decorations.md) を参照してください。

### `addGlobalAttributes`

`addGlobalAttributes` メソッドでは、複数の拡張機能にまとめて適用できる属性を追加します。テキストの配置や行の高さなど、多くの種類のノードやマークで使えるようにしたい、スタイル関連のプロパティに便利です。

`types` プロパティで、どの拡張機能に属性を適用するかを制御できます。

- `types: ['heading', 'paragraph']` - 特定の種類の名前に適用する
- `types: '*'` - すべてのノードの種類（組み込みのテキストノードを除く）とすべてのマークの種類に適用する
- `types: 'nodes'` - すべてのノードの種類（組み込みのテキストノードを除く）に適用する
- `types: 'marks'` - すべてのマークの種類に適用する

特定の種類に属性を適用する例を示します。

```typescript
const TextAlign = Extension.create({
  name: 'textAlign',

  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          textAlign: {
            default: 'left',
            renderHTML: (attributes) => ({
              style: `text-align: ${attributes.textAlign}`,
            }),
            parseHTML: (element) => element.style.textAlign || 'left',
          },
        },
      },
    ]
  },
})
```

短縮形の文字列の書き方を含め、すべてのオプションについては [グローバル属性を適用する](../extend-existing.md#apply-global-attributes-to-all-extensions) ガイドを参照してください。

### `addExtensions`

拡張機能の中に、さらに拡張機能を追加できます。セットで使う拡張機能をひとまとめにしたい場合に便利です。

```typescript
import { Extension } from '@tiptap/core'
import CustomExtension1 from './CustomExtension1'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addExtensions() {
    return [
      CustomExtension1.configure({
        name: 'customExtension1',
      }),
    ]
  },
})
```

### `extendNodeSchema`

`extendNodeSchema` メソッドで、エディタの NodeConfig を拡張できます。ノードのスキーマに属性を追加したい場合に便利です。

```typescript
import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  // NodeConfig に新しい設定オプションを追加する
  interface NodeConfig {
    customAttribute: {
      default: null
    }
  }
}

const CustomExtension = Extension.create({
  name: 'customExtension',

  extendNodeSchema() {
    return {
      customAttribute: {
        default: null,
      },
    }
  },
})
```

### `extendMarkSchema`

`extendMarkSchema` メソッドで、エディタの MarkConfig を拡張できます。マークのスキーマに属性を追加したい場合に便利です。

```typescript
import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  // MarkConfig に新しい設定オプションを追加する
  interface MarkConfig {
    customAttribute: {
      default: null
    }
  }
}

const CustomExtension = Extension.create({
  name: 'customExtension',

  extendMarkSchema() {
    return {
      customAttribute: {
        default: null,
      },
    }
  },
})
```

## this で使えるもの

拡張機能はクラスではありません。それでも、拡張機能の中ならどこでも、`this` を通じていくつかの重要なものにアクセスできます。

```js
// 拡張機能の名前（例: 'bulletList'）
this.name

// エディタのインスタンス
this.editor

// ProseMirror の型（ノードやマークの場合）
this.type

// すべての設定を持つオブジェクト
this.options

// 拡張元の拡張機能が持つすべてのもの
this.parent

// ストレージのオブジェクト
this.storage
```
