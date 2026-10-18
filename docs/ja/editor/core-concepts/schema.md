# Tiptap のスキーマ

> 原文: [https://tiptap.dev/docs/editor/core-concepts/schema](https://tiptap.dev/docs/editor/core-concepts/schema)

Tiptap は多くのエディタと違い、コンテンツの構造を定める[スキーマ](https://prosemirror.net/docs/guide/#schema)に基づいています。スキーマでは、ドキュメントに出てよいノードの種類、その属性、入れ子にできる形を定義できます。

このスキーマは_とても_厳密です。スキーマに定義されていない HTML 要素や属性は使えません。

例を1つ挙げます。`This is <strong>important</strong>` のような内容を Tiptap に貼り付けても、`strong` タグを扱う拡張機能がなければ、strong タグの付かない `This is important` だけが表示されます。

これが起きたことを知りたいなら、`enableContentCheck` オプションを有効にしたうえで [`contentError`](../api/events.md#list-of-available-events) イベントを監視してください。

## スキーマの見た目

用意された拡張機能だけを使っているなら、スキーマをそれほど気にする必要はありません。独自の拡張機能を作るなら、スキーマの仕組みを理解しておくと役立つはずです。典型的な ProseMirror エディタの、最も単純なスキーマを見てみましょう。

```js
// 土台となる ProseMirror のスキーマ
{
  nodes: {
    doc: {
      content: 'block+',
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0],
    },
    text: {
      group: 'inline',
    },
  },
}
```

ここでは `doc`、`paragraph`、`text` の3つのノードを登録しています。`doc` はルートノードで、子として1つ以上のブロックノードを持てます（`content: 'block+'`）。`paragraph` はブロックノードのグループに属している（`group: 'block'`）ので、このドキュメントに入れられるのは段落だけです。段落は子として0個以上のインラインノードを持てる（`content: 'inline*'`）ので、中に入れられるのは `text` だけです。`parseDOM` は、貼り付けられた HTML からノードをどうパースするかを定めます。`toDOM` は、DOM にどうレンダリングするかを定めます。

Tiptap では、ノード、マーク、拡張機能がそれぞれ別のファイルにあります。こうしてロジックを分けられます。内部では、スキーマ全体が1つにまとめられます。

```js
// Tiptap のスキーマ API
import { Node } from '@tiptap/core'

const Document = Node.create({
  name: 'doc',
  topNode: true,
  content: 'block+',
})

const Paragraph = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0]
  },
})

const Text = Node.create({
  name: 'text',
  group: 'inline',
})
```

## 外部のスキーマ定義を使う

完全な ProseMirror の `SchemaSpec` をエディタの [`schemaSpec`](../api/editor.md#schemaspec) オプションに渡すと、ドキュメントの構造を、手元の拡張機能の振る舞いとは切り離して定義できます。複数のエディタで同じ構造を共有しつつ、レンダリングや操作のコードはエディタごとに変えたい場合に使えます。

この定義が決めるのは、ノードとマークの構造です。HTML のパースとレンダリング、テキストへのシリアライズ、コマンド、キーボードショートカット、ノードビュー、プラグインは、引き続き手元の拡張機能が受け持ちます。

```ts
import { Editor } from '@tiptap/core'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import type { SchemaSpec } from '@tiptap/pm/model'

const schemaSpec: SchemaSpec = {
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      group: 'block',
      content: 'inline*',
      marks: 'bold',
      attrs: {
        tone: { default: 'newsletter', validate: 'string' },
      },
    },
    text: { group: 'inline' },
  },
  marks: {
    bold: {},
  },
}

const LocalParagraph = Paragraph.extend({
  addAttributes() {
    return {
      tone: {
        parseHTML: (element) => element.getAttribute('data-tone'),
        renderHTML: (attributes) => ({ 'data-tone': attributes.tone }),
      },
    }
  },
})

const editor = new Editor({
  element: document.querySelector('.editor'),
  extensions: [Document, LocalParagraph, Text, Bold],
  schemaSpec,
  content: '<p>Hello <strong>world</strong>.</p>',
})

editor.getHTML()
// '<p data-tone="newsletter">Hello <strong>world</strong>.</p>'
```

この例では、`schemaSpec` が太字のテキストを許可し、`tone` 属性のデフォルト値を設定しています。`LocalParagraph` は段落のレンダリングを引き継ぎ、`tone` を HTML の `data-tone` 属性に対応させています。`<strong>` のパースとレンダリング、`toggleBold` コマンドは `Bold` 拡張機能が提供します。

### 拡張機能との対応

スキーマ定義と、最終的に使われる拡張機能とで、ノード名とマーク名が完全に一致していなければなりません。定義にあるノードには手元のノード拡張機能が、マークには手元のマーク拡張機能が必要です。手元のノード名やマーク名が重複している場合はエラーになります。

ノードもマークも定義しない拡張機能なら、スキーマ定義に項目がなくても追加できます。たとえば、キーボードショートカットを追加するだけの拡張機能には項目は要りません。

`StarterKit` を使う場合は、それが有効にするノードとマークをすべて定義に含めるか、含めない種類を無効にしてください。段落だけの定義は、デフォルト設定の `StarterKit` とは併用できません。

手元のノード拡張機能やマーク拡張機能では、振る舞いだけを定義してもかまいません。構造に関するフィールドと属性は、すべて `schemaSpec` から持ってこられます。

### 構造のルール

外部の定義は、手元の構造フィールドの欠けた部分を補うのではなく、まるごと置き換えます。定義で省いたフィールドには、手元の拡張機能の値ではなく ProseMirror のデフォルト値が使われます。

- ノードでは、`content`、`marks`、`group`、`inline`、`atom`、`selectable`、`draggable`、`code`、`whitespace`、`definingAsContext`、`definingForContent`、`defining`、`isolating`、`linebreakReplacement` を定義側が決めます。
- マークでは、`inclusive`、`excludes`、`group`、`spanning`、`code` を定義側が決めます。
- トップノードと、ノードやマークの並び順も定義側が決めます。手元の拡張機能の優先度は関係ありません。

DOM に関する振る舞いは、手元の拡張機能に置いてください。外部定義の `parseDOM` と `toDOM` フィールドは無視されます。`tableRole` や `allowGapCursor` といった独自のスキーマのメタデータも、手元の拡張機能から取られます。

### 属性のルール

ノードとマークのどちらでも、属性の名前、デフォルト値、必須かどうか、検証は定義側が決めます。

- 定義にない手元の属性は取り除かれます。`addGlobalAttributes()` で追加した属性も同じです。
- 定義と一致する手元の属性は、`parseHTML`、`renderHTML`、`rendered`、`keepOnSplit` の振る舞いを保ちます。デフォルト値と検証は定義から取られます。
- 定義にしかない属性には、Tiptap のデフォルトの属性のパースとレンダリングが使われます。独自の HTML 表現が必要なら、手元で属性のフックを定義してください。
- `default` のない属性は必須です。その属性を使うコンテンツを作るときは値を指定してください。

### 検証と更新

エディタの作成時に、Tiptap は次の場合にエラーにします。スキーマ構造が正しくない、構造フィールドの型が正しくない、手元の実装が欠けている、手元に余分なノードやマークの種類がある、手元の種類名が重複している。

定義が適用されるのはエディタの作成時だけです。`editor.setOptions({ schemaSpec })` を呼んでもスキーマは作り直されません。構造を変えるには、新しいエディタを作り、既存のコンテンツを新しい定義に合わせて移行してください。

`schemaSpec` を省くと、これまでどおり Tiptap が手元の拡張機能からスキーマを組み立てます。

## ノードとマーク

### 違い

ノードは、段落、見出し、コードブロック、引用など、コンテンツのブロックのようなものです。

マークは、ノードの特定の部分に適用できます。**太字**、_斜体_、~~取り消し線~~のテキストがその例です。[リンク](#)もマークです。

### ノードのスキーマ

#### Content

content 属性は、ノードが持てるコンテンツの種類を厳密に定めます。ProseMirror はこの点にとても厳格で、スキーマに合わないコンテンツは捨てられます。値には、名前かグループを文字列で指定します。例をいくつか示します。

```js
Node.create({
  // 1つ以上のブロックを持たなければならない
  content: 'block+',

  // 0個以上のブロックを持たなければならない
  content: 'block*',

  // あらゆる種類の 'inline' コンテンツ（テキストや強制改行）を許可する
  content: 'inline*',

  // 'text' 以外を持ってはならない
  content: 'text*',

  // 1つ以上の段落、またはリスト（リストを使う場合）を持てる
  content: '(paragraph|list?)+',

  // 先頭にちょうど1つの見出しを持ち、その下に1つ以上のブロックを持たなければならない
  content: 'heading block+',
})
```

#### Marks

スキーマの `marks` 設定で、ノード内で許可するマークを定義できます。マークの名前やグループを1つ以上指定するか、次のようにすべて許可、またはすべて禁止にします。

```js
Node.create({
  // 'bold' マークだけを許可する
  marks: 'bold',

  // 'bold' と 'italic' マークだけを許可する
  marks: 'bold italic',

  // すべてのマークを許可する
  marks: '_',

  // すべてのマークを禁止する
  marks: '',
})
```

#### Group

このノードを拡張機能のグループに加えます。グループは、スキーマの [content](#content) 属性から参照できます。

```js
Node.create({
  // 'block' グループに加える
  group: 'block',

  // 'inline' グループに加える
  group: 'inline',

  // 'block' と 'list' グループに加える
  group: 'block list',
})
```

#### Inline

ノードはインラインでもレンダリングできます。`inline: true` を設定すると、ノードはテキストと同じ行にレンダリングされます。メンションがその例です。結果はマークに近いものの、ノードの機能を持っています。違いの1つは、できあがる JSON ドキュメントです。マークは複数を同時に適用しますが、インラインノードでは入れ子の構造になります。

```js
Node.create({
  // たとえばノードをテキストと同じ行にレンダリングする
  inline: true,
})
```

ノードビューなど、マークでは使えない機能が欲しい場合は、インラインノードで実現できないか試してください。

```js
Node.create({
  name: 'customInlineNode',
  group: 'inline',
  inline: true,
  content: 'text*',
})
```

インラインノードは、特に行の端で選択しにくいことがあります。手早い対処法として、CSS で要素の直後にゼロ幅スペースを追加します。

```css
.customInlineNode::after {
  content: "\200B";
}
```

#### Atom

`atom: true` のノードは直接編集できず、1つのまとまりとして扱われます。エディタで使う場面はそれほど多くありませんが、書き方は次のとおりです。

```js
Node.create({
  atom: true,
})
```

例として [`Mention`](../extensions/nodes/mention.md) 拡張機能があります。見た目はテキストに似ていますが、振る舞いは1つのまとまりに近いものです。編集できるテキストコンテンツを持たないため、このようなノードをコピーすると中身は空になります。ただし、これは制御できます。[`Mention`](../extensions/nodes/mention.md) 拡張機能の例を示します。

```js
// atom ノードをプレーンテキストに変換するために使う
renderText({ node }) {
  return `@${node.attrs.id}`
},
```

#### Selectable

目に見えるテキストの選択範囲のほかに、目に見えないノードの選択範囲があります。ノードを選択できるようにするには、次のように設定します。

```js
Node.create({
  selectable: true,
})
```

#### Draggable

どのノードも、次の設定でドラッグできるようにできます（デフォルトではドラッグできません）。

```js
Node.create({
  draggable: true,
})
```

#### Code

ユーザーは、コードがほかとはまったく違う振る舞いをすることを期待します。コードを含むあらゆる種類のノードでは、`code: true` を設定してこれに対応できます。

```js
Node.create({
  code: true,
})
```

#### Whitespace

このノード内の空白をどうパースするかを決めます。

```js
Node.create({
  whitespace: 'pre',
})
```

#### Defining

デフォルトでは、中身がまるごと置き換えられると（たとえば新しいコンテンツを貼り付けたとき）ノードは捨てられます。こうした置き換えの操作でもノードを残したいなら、`defining` に設定します。

これに該当するのは、主に [`Blockquote`](../extensions/nodes/blockquote.md)、[`CodeBlock`](../extensions/nodes/code-block.md)、[`Heading`](../extensions/nodes/heading.md)、[`ListItem`](../extensions/nodes/list-item.md) です。

```js
Node.create({
  defining: true,
})
```

#### Isolating

バックスペースなどの通常の編集操作で、カーソルをノードの内側に閉じ込めたい場合（たとえば TableCell）は、`isolating: true` を設定します。

```js
Node.create({
  isolating: true,
})
```

#### Allow gap cursor

[`Gapcursor`](../extensions/functionality/gapcursor.md) 拡張機能は、新しいスキーマ属性を登録します。この属性で、そのノード内のどこでもギャップカーソルを許可するかを制御します。

```js
Node.create({
  allowGapCursor: false,
})
```

#### Table roles

[`Table`](../extensions/nodes/table.md) 拡張機能は、ノードの役割を設定する新しいスキーマ属性を登録します。指定できる値は `table`、`row`、`cell`、`header_cell` です。

```js
Node.create({
  tableRole: 'cell',
})
```

### マークのスキーマ

#### Inclusive

カーソルがマークの末尾にあるときにマークを有効にしたくないなら、inclusive を `false` にします。たとえば [`Link`](../extensions/marks/link.md) マークはこのように設定されています。

```js
Mark.create({
  inclusive: false,
})
```

#### Excludes

デフォルトでは、すべてのマークを同時に適用できます。excludes 属性で、そのマークと共存してはならないマークを定義できます。たとえばインラインコードのマークは、ほかのマーク（太字、斜体など）をすべて除外します。

```js
Mark.create({
  // bold マークと共存してはならない
  excludes: 'bold'
  // ほかのマークをすべて除外する
  excludes: '_',
})
```

#### Exitable

デフォルトでは、マークはカーソルを「閉じ込め」ます。つまり、マークの付いていないテキストへカーソルを左から右に動かす以外に、マークの外へ出る方法がありません。
これを true にすると、マークがノードの末尾にあるときにマークから抜け出せるようになります。たとえばコードのマークで便利です。

```js
Mark.create({
  // このマークを抜け出せるようにする（デフォルトは false）
  exitable: true,
})
```

#### Group

このマークを拡張機能のグループに加えます。グループは、スキーマの content 属性から参照できます。

```js
Mark.create({
  // このマークを 'basic' グループに加える
  group: 'basic',
  // このマークを 'basic' と 'foobar' グループに加える
  group: 'basic foobar',
})
```

#### Code

ユーザーは、コードがほかとはまったく違う振る舞いをすることを期待します。コードを含むあらゆる種類のマークでは、`code: true` を設定してこれに対応できます。

```js
Mark.create({
  code: true,
})
```

#### Spanning

デフォルトでは、HTML としてレンダリングするとき、マークは複数のノードにまたがれます。マークが複数のノードにまたがってはならないことを示すには、`spanning: false` を設定します。

```js
Mark.create({
  spanning: false,
})
```

## 土台の ProseMirror スキーマを取得する

土台のスキーマを直接扱う必要がある場面がいくつかあります。Tiptap の共同編集機能を使う場合や、コンテンツを手動で HTML にレンダリングしたい場合です。

### 方法1: エディタを使う

クライアント側で必要で、どのみちエディタのインスタンスを使うなら、エディタから取得できます。

```js
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

const editor = new Editor({
  extensions: [
    Document,
    Paragraph,
    Text,
    // ここに拡張機能を追加する
  ])
})

const schema = editor.schema
```

### 方法2: エディタを使わない

実際のエディタを初期化_せずに_スキーマだけが欲しいなら、ヘルパー関数 `getSchema` を使えます。使える拡張機能の配列を渡すと、ProseMirror のスキーマを生成してくれます。

```js
import { getSchema } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

const schema = getSchema([
  Document,
  Paragraph,
  Text,
  // ここに拡張機能を追加する
])
```

## スキーマに合わないコンテンツの扱い

コンテンツのエラーを追跡して対応できるように、Tiptap には、渡されたコンテンツが登録済みの拡張機能から作られたスキーマに合っているかを確かめる機能があります。
使うには `enableContentCheck` オプションを `true` にします。これでコンテンツの確認と `contentError` イベントの発行が有効になります。
このイベントは `onContentError` コールバックで受け取れます。
以前のバージョンとの互換性を保つため、このフラグはデフォルトで `false` です。

> [!WARNING]
> **注意**
>
> Tiptap のコンテンツ確認は、JSON 形式のコンテンツなら 100% 正確です。一方、コンテンツを HTML で
> 渡した場合、欠けたノードはできるかぎり検出するようにしていますが、状況によってはマークを
> 見逃すことがあります。その場合は、認識できないコンテンツを取り除くデフォルトの動作に戻ります。

### contentError イベント

`contentError` イベントは、エディタのセットアップ時に渡した最初の `content` がスキーマと合わないときに発行されます。

エラーの情報の一部として、`disableCollaboration` 関数が渡されます。この関数を呼ぶと、共同編集の拡張機能を外してエディタが初期化し直されます。これで、取り除かれたコンテンツがほかのユーザーと同期されないようにできます。

このイベントは、次のように `onContentError` オプションで直接処理できます。

```jsx
new Editor({
  enableContentCheck: true,
  content: invalidContent,
  onContentError({ editor, error, disableCollaboration }) {
    // ここに処理を書く
  },
  ...options,
})
```

エディタのインスタンスの `contentError` イベントにリスナーを登録する方法もあります。

```jsx
const editor = new Editor({
  enableContentCheck: true,
  content: invalidContent,
  ...options,
})

editor.on('contentError', ({ editor, error, disableCollaboration }) => {
  // ここに処理を書く
})
```

実装例をもっと見たい場合は、[イベント](../api/events.md)のセクションを参照してください。

### コンテンツ確認を有効にせずに contentError イベントを監視する

コンテンツ確認を有効にせずに `contentError` イベントを監視したいなら、Tiptap エディタの初期化時に `emitContentError` を `true` にします。

```jsx
new Editor({
  enableContentCheck: false,
  emitContentError: true,
  ...options,
})
```

この設定なら、エディタにスキーマに合わないコンテンツを入れたまま、コンテンツが不正なときに通知を受け取れます。

### 推奨する対応

スキーマエラーへの対応はアプリケーションと要件によって変わりますが、おすすめの方法を示します。

#### 共同編集を使わない場合

用途によりますが、未知のコンテンツを取り除くデフォルトの動作なら、今後の編集に向けてコンテンツを正しいと分かっている状態に保てます。

#### 共同編集を使う場合

用途によっては、`enableContentCheck` フラグを設定して `contentError` イベントを監視するとよいでしょう。このイベントを受け取ったら、次の例のように対応できます。

```tsx
onContentError({ editor, error, disableCollaboration }) {
  // 共同編集の拡張機能を取り除く
  disableCollaboration()

  // コンテンツが不正なので、update を発行したくない
  // ほかのエディタやサーバーとの同期を防ぐ
  const emitUpdate = false

  // エディタを無効にして、これ以上ユーザーが入力できないようにする
  editor.setEditable(false, emitUpdate)

  // アプリを再読み込みする必要があることをユーザーに通知するとよい
}
```
