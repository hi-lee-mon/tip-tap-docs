# エディタインスタンスの API

> 原文: [https://tiptap.dev/docs/editor/api/editor](https://tiptap.dev/docs/editor/api/editor)

エディタのインスタンスは Tiptap の中心となる構成要素です。[`EditorView`](https://ProseMirror.net/docs/ref/#view.EditorView) の作成や、最初の [`EditorState`](https://ProseMirror.net/docs/ref/#state.Editor_State) の設定など、動作する [ProseMirror](https://ProseMirror.net/) エディタを作るための面倒な処理の大半を引き受けます。

## 設定

`Editor` クラスはさまざまな設定を受け取ります。使える設定は次のとおりです。

### element

`element` には、エディタを結び付ける HTML 要素を指定します。次のコードは、`.element` クラスを持つ要素に Tiptap を組み込みます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('.element'),
  extensions: [StarterKit],
})
```

要素にマウントする前に、エディタを初期化しておくこともできます。DOM がまだ使えない場合や、サーバーサイドレンダリングの環境で役立ちます。null を渡してエディタを初期化し、あとでマウントしてください。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: null,
  extensions: [StarterKit],
})

// コードのあとのほうで
editor.mount(document.querySelector('.element'))
```

### extensions

段落だけを許可したい場合でも、`extensions` プロパティには拡張機能のリストを必ず渡します。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Highlight from '@tiptap/extension-highlight'

new Editor({
  // デフォルトの拡張機能を使う
  extensions: [StarterKit],

  // …または特定の拡張機能を使う
  extensions: [Document, Paragraph, Text],

  // …または両方
  extensions: [StarterKit, Highlight],
})
```

### schemaSpec

省略可能な `schemaSpec` 設定には、ProseMirror の `SchemaSpec` を丸ごと渡せます。型は `@tiptap/pm/model` からインポートします。

`schemaSpec` はエディタのドキュメント構造を定義します。一方、パース、レンダリング、コマンド、ノードビュー、プラグインはローカルの拡張機能が担います。省略した場合は、Tiptap が拡張機能からスキーマを組み立てます。

`schemaSpec` のノードとマークには、それぞれ同じ名前と種類のローカル拡張機能が必要です。また、ローカルのノードとマークもすべて spec に含まれている必要があります。

spec はエディタの作成時に適用されます。`setOptions()` で `schemaSpec` を変えても、スキーマは作り直されません。別の spec を使うには、新しいエディタを作ってください。

例と、構造・属性のルールは「[外部のスキーマ spec を使う](../core-concepts/schema.md#use-an-external-schema-spec)」を参照してください。

### content

`content` プロパティには、エディタの初期コンテンツを渡します。HTML でも JSON でもかまいません。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit],
})
```

### editable

`editable` プロパティは、ユーザーがエディタに書き込めるかどうかを決めます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit],
  editable: false,
})
```

### coreExtensionOptions

`coreExtensionOptions` プロパティは、Tiptap に組み込まれたコア拡張機能を設定します。

エディタ要素の `tabindex` 属性は `tabindex.value` で設定します。`value` が undefined の場合、編集可能なエディタは `tabindex="0"` になり、編集不可のエディタには `tabindex` 属性が付きません。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit],
  editable: false,
  coreExtensionOptions: {
    tabindex: {
      value: '-1',
    },
  },
})
```

### textDirection

`textDirection` プロパティは、エディタ内の全コンテンツの文字方向を設定します。アラビア語やヘブライ語のような右から左に書く（RTL）言語や、双方向のテキストを扱うときに役立ちます。

| 値       | 説明                                                   |
| ----------- | ------------------------------------------------------------- |
| `'ltr'`     | 全コンテンツを左から右に設定する。                |
| `'rtl'`     | 全コンテンツを右から左に設定する。                |
| `'auto'`    | コンテンツから方向を自動で判定する。             |
| `undefined` | 方向の属性を付けない（デフォルト）。                    |

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>مرحبا بك في Tiptap</p>`,
  extensions: [StarterKit],
  textDirection: 'auto',
})
```

`setTextDirection` コマンドと `unsetTextDirection` コマンドを使えば、特定のノードだけ方向を上書きすることもできます。詳しくは[コマンドのドキュメント](commands/index.md)を参照してください。

### autofocus

`autofocus` を使うと、初期化時にカーソルをエディタ内へ強制的に移せます。

| 値    | 説明                                            |
| -------- | ------------------------------------------------------ |
| `start`  | ドキュメントの先頭にフォーカスする。       |
| `end`    | ドキュメントの末尾にフォーカスする。             |
| `all`    | ドキュメント全体を選択する。                            |
| `Number` | ドキュメント内の指定した位置にフォーカスする。 |
| `true`   | 自動フォーカスを有効にする。                                     |
| `false`  | 自動フォーカスを無効にする。                                    |
| `null`   | 自動フォーカスを無効にする。                                    |

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
  autofocus: false,
})
```

### enableInputRules

Tiptap はデフォルトですべての[入力ルール](input-rules.md)を有効にします。これを制御するのが `enableInputRules` です。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit],
  enableInputRules: false,
})
```

特定の入力ルールだけを許可することもできます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit, Link],
  // 拡張機能または拡張機能名の配列を渡すと、
  // その入力ルールだけを許可できる
  enableInputRules: [Link, 'horizontalRule'],
})
```

### enablePasteRules

Tiptap はデフォルトですべての[貼り付けルール](paste-rules.md)を有効にします。これを制御するのが `enablePasteRules` です。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit],
  enablePasteRules: false,
})
```

特定の貼り付けルールだけを許可することもできます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

new Editor({
  content: `<p>Example Text</p>`,
  extensions: [StarterKit, Link],
  // 拡張機能または拡張機能名の配列を渡すと、
  // その貼り付けルールだけを許可できる
  enablePasteRules: [Link, 'horizontalRule'],
})
```

### injectCSS

Tiptap はデフォルトで[少しだけ CSS](https://github.com/ueberdosis/tiptap/tree/main/packages/core/src/style.ts)を挿入します。`injectCSS` で無効にできます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
  injectCSS: false,
})
```

### injectNonce

`nonce` 付きの [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) を使う場合は、動的に作られる要素に付ける `nonce` を指定できます。例を示します。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
  injectCSS: true,
  injectNonce: 'your-nonce-here',
})
```

### enableExtensionDispatchTransaction

拡張機能ごとのトランザクションのディスパッチを有効にするかどうかです。`false` にすると、拡張機能は独自の `dispatchTransaction` フックを定義できません。

- **デフォルト**: `true`

```js
new Editor({
  enableExtensionDispatchTransaction: false,
})
```

### editorProps

高度な用途向けに、`editorProps` を渡せます。これは [ProseMirror](https://prosemirror.net/docs/ref/#view.EditorProps) が処理します。エディタのさまざまなイベントを上書きしたり、エディタの DOM 要素の属性を変えたりするのに使えます。たとえば Tailwind のクラスを追加できます。例を示します。

```js
new Editor({
  // 詳しくは https://prosemirror.net/docs/ref/#view.EditorProps
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
    transformPastedText(text) {
      return text.toUpperCase()
    },
  },
})
```

これを使えば、イベントハンドラーに処理を差し込み、たとえば独自の貼り付けハンドラーを渡すこともできます。

ブラウザのスペルチェックを有効にするには、`editorProps.attributes.spellcheck` を `'true'` にします。例、言語の設定、独自のスペルチェッカーについては[スペルチェックのガイド](../../guides/spellcheck.md)を参照してください。

### parseOptions

渡したコンテンツは ProseMirror がパースします。パース処理に介入するには `parseOptions` を渡します。これは [ProseMirror](https://prosemirror.net/docs/ref/#model.ParseOptions) が処理します。

```js
new Editor({
  // 詳しくは https://prosemirror.net/docs/ref/#model.ParseOptions
  parseOptions: {
    preserveWhitespace: 'full',
  },
})
```

## メソッド

エディタのインスタンスには、たくさんの公開メソッドがあります。メソッドは普通の関数で、何を返してもかまいません。エディタを操作するときに役立ちます。

メソッドと[コマンド](commands/index.md)を混同しないでください。コマンドはエディタの状態（コンテンツや選択範囲など）を変えるためのもので、`true` か `false` しか返しません。

### can()

コマンドやコマンドのチェーンを実行できるかどうかを、実際には実行せずに確かめます。ボタンの有効・無効や表示・非表示を切り替えるときにとても便利です。

```js
// undo コマンドを実行できるなら `true` を返す
editor.can().undo()
```

### chain()

複数のコマンドをまとめて呼び出すためのコマンドのチェーンを作ります。

```js
// 2 つのコマンドをまとめて実行する
editor.chain().focus().toggleBold().run()
```

### destroy()

エディタのインスタンスを停止し、すべてのイベントのバインドを解除します。

```js
// Hasta la vista, baby!（訳注: 映画『ターミネーター2』の台詞で「あばよ」の意味）
editor.destroy()
```

### getHTML()

現在のエディタのドキュメントを HTML で返します。

```js
editor.getHTML()
```

### getJSON()

現在のエディタのドキュメントを JSON で返します。

```js
editor.getJSON()
```

### getText()

現在のエディタのドキュメントをプレーンテキストで返します。

| 引数 | 型                                                                     | 説明                    |
| --------- | ------------------------------------------------------------------------ | ------------------------------ |
| options   | blockSeparator?: string, textSerializers?: Record;string, TextSerializer | シリアライズのオプション。 |

```js
// プレーンテキストをちょうだい!
editor.getText()
// ノードの間に改行を 2 つ入れる
editor.getText({ blockSeparator: '\n\n' })
```

### getAttributes()

現在選択しているノードまたはマークの属性を取得します。

| 引数  | 型                           | 説明              |
| ---------- | ------------------------------ | ------------------------ |
| typeOrName | string \| NodeType \| MarkType | ノードまたはマークの名前 |

```js
editor.getAttributes('link').href
```

### isActive()

現在選択しているノードまたはマークがアクティブかどうかを返します。

| 引数  | 型                      | 説明                    |
| ---------- | ------------------------- | ------------------------------ |
| name       | string \| null            | ノードまたはマークの名前       |
| attributes | Record&lt;string, any&gt; | ノードまたはマークの属性 |

```js
// 見出しかどうかを確かめる
editor.isActive('heading')
// 特定の属性値を持つ見出しかどうかを確かめる
editor.isActive('heading', { level: 2 })
// ノードやマークの種類を問わず、特定の属性値を持つかどうかを確かめる
editor.isActive({ textAlign: 'justify' })
```

### mount()

エディタを要素にマウントします。まだ DOM に存在しない要素にエディタをマウントしたいときに役立ちます。

```js
editor.mount(document.querySelector('.element'))
```

### unmount()

エディタを要素からアンマウントします。いったん要素から外し、あとで別の要素にマウントし直したいときに役立ちます。

```js
editor.unmount()
```

### registerPlugin()

ProseMirror のプラグインを登録します。

| 引数      | 型                                                 | 説明                                               |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| plugin         | `Plugin`                                             | ProseMirror のプラグイン                                      |
| handlePlugins? | `(newPlugin: Plugin, plugins: Plugin[]) => Plugin[]` | 既存のプラグインにどう統合するかを制御する |

### setOptions()

エディタのオプションを更新します。

| 引数 | 型                     | 説明       |
| --------- | ------------------------ | ----------------- |
| options   | `Partial<EditorOptions>` | オプションのリスト |

```js
// 既存のエディタのインスタンスにクラスを追加する
editor.setOptions({
  editorProps: {
    attributes: {
      class: 'my-custom-class',
    },
  },
})
```

### setEditable()

エディタの編集可否を更新します。

| 引数  | 型      | 説明                                                     |
| ---------- | --------- | --------------------------------------------------------------- |
| editable   | `boolean` | ユーザーがエディタに書き込めるようにするなら `true`。   |
| emitUpdate | `boolean` | デフォルトは `true`。`onUpdate` を発火させるかどうかを決める。 |

```js
// エディタを読み取り専用にする
editor.setEditable(false)
```

### unregisterPlugin()

ProseMirror のプラグインの登録を解除します。

| 引数       | 型                  | 説明      |
| --------------- | --------------------- | ---------------- |
| nameOrPluginKey | `string \| PluginKey` | プラグインの名前 |

### $node()

[NodePos クラス](node-positions.md)を参照してください。

## プロパティ

### isEditable

エディタが編集可能か、読み取り専用かを返します。

```js
editor.isEditable
```

### isEmpty

コンテンツがあるかどうかを確かめます。

```js
editor.isEmpty
```

### isFocused

エディタがフォーカスされているかどうかを確かめます。

```js
editor.isFocused
```

### isDestroyed

エディタが破棄されたかどうかを確かめます。

```js
editor.isDestroyed
```

### isCapturingTransaction

エディタがトランザクションをキャプチャ中かどうかを確かめます。

```js
editor.isCapturingTransaction
```
