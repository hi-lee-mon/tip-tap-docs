# Table of Contents 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/table-of-contents](https://tiptap.dev/docs/editor/extensions/functionality/table-of-contents)

`TableOfContents` 拡張機能を使うと、ドキュメントからアンカーの一覧を取得できます。各アンカーについて、見出しごとの深さ、内容、一意の ID に加え、アクティブかどうかやスクロールの状態などの大事な情報も渡されます。これを使って、目次を自分でレンダリングできます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/TableOfContents)

## インストール

準備ができたら、拡張機能をインストールします。

```bash
npm install @tiptap/extension-table-of-contents
```

## 設定

### anchorTypes

目次に使うノードの型です。デフォルトは `["heading"]` ですが、独自の Heading 拡張機能を作った場合や、既存の拡張機能を拡張して別の名前を付けた場合は、その名前をここに渡せます。

デフォルト: `["heading"]`

```js
TableOfContents.configure({
  anchorTypes: ['heading', 'customAnchorType'],
})
```

### getIndex

項目の番号の計算方法をカスタマイズするオプションです。デフォルトでは内部の関数を使いますが、上書きして独自のロジックにできます。

```js
TableOfContents.configure({
  getIndex: (anchor, previousAnchors, level) => {
    // 独自のロジックを書く。この例では単に 1 を返す
    return 1
  },
})
```

すぐに使える関数を2つ公開しています。1つは 1 から n まで通しで数える番号を作り、もう1つは階層ごとに 1 から n まで数える番号を作ります。

```js
import { getLinearIndexes, getHierarchicalIndexes } from '@tiptap/extension-table-of-contents'

// 通しの番号を作る
TableOfContents.configure({
  getIndex: getLinearIndexes,
})

// 階層ごとの番号を作る
TableOfContents.configure({
  getIndex: getHierarchicalIndexes,
})
```

### getLevel

項目の階層の決め方をカスタマイズするオプションです。デフォルトでは、見出し要素の level 属性を確認する通常の方法で階層を決めます。独自のアンカーを見出しの階層に含めたい場合などに、これでカスタマイズできます。

```js
TableOfContents.configure({
  getLevel: (anchor, previousAnchors) => {
    // 独自のロジックを書く。この例では単に 1 を返す
    return 1
  },
})
```

### getId

見出しごとに一意の ID を返すビルダー関数です。引数から見出しのテキストを受け取れるので、見出しのテキストをもとに ID を作ることもできます。

デフォルトでは、[uuid](https://www.npmjs.com/package/uuid) パッケージで一意の ID を作る関数です。

デフォルト: `() => uuid()`

```js
// ここでは架空の "slugify" 関数を使っている
// スラッグには一意の識別子も加えたほうがよい
TableOfContents.configure({
  getId: (content) => slugify(content),
})
```

### scrollParent

スクロールを監視する親要素です。どの見出しが現在アクティブか、すでにスクロールで通り過ぎたかを判定するのに使います。デフォルトは window を返すコールバック関数ですが、任意の HTML 要素を返すコールバックを渡せます。

デフォルト: `() => window`

```js
// たとえば、エディタの DOM 要素自体がスクロールする要素の場合
TableOfContents.configure({
  scrollParent: () => editor.view.dom,
})
```

### onUpdate

この拡張機能を使うときに必ず設定する、最も大事なオプションです。目次が更新されるたびに呼ばれるコールバック関数で、見出しのデータ（下記参照）の配列を受け取れます。これを使って、目次を自分でレンダリングします。

目次のレンダリング方法は自由です。Vue、React、Svelte などのフレームワークでも、Handlebars や Pug などのシンプルなテンプレートエンジンでも、`document.createElement` だけでもかまいません。

2つ目の引数を受け取ると、目次のデータを最初に作る段階かどうかがわかります。

デフォルト: `undefined`

```js
// 素の JavaScript の場合
const tocElement = document.createElement('div')
document.body.appendChild(tocElement)

TableOfContents.configure({
  onUpdate: (anchors, isCreate) => {
    tocElement.innerHTML = ''

    if (isCreate) {
      console.log('This is the inital creation step for the ToC data')
    }

    anchors.forEach((anchor) => {
      const anchorElement = document.createElement('div')

      anchorElement.innerHTML = anchor.content
      anchorElement.dataset.id = anchor.id
      anchorElement.dataset.depth = anchor.depth
      anchorElement.dataset.active = anchor.active
      anchorElement.dataset.scrolled = anchor.scrolled

      tocElement.appendChild(anchorElement)
    })
  },
})
```

```js
// React の場合
const [anchors, setAnchors] = useState([])

// useEditor フックの中で、たとえば次のようにする
TableOfContents.configure({
  onUpdate: (anchors) => {
    setAnchors(anchors)
  },
})
```

```js
// Vue の場合
const anchors = ref([])

TableOfContents.configure({
  onUpdate: (anchors) => {
    anchors.value = anchors
  },
})
```

## ストレージ

### content

現在のドキュメントの見出しの内容です。

```js
editor.storage.tableOfContents.content
```

### anchors

HTML ノードの配列です。

```js
editor.storage.tableOfContents.anchors
```

### scrollHandler

スクロールの処理に使う scrollHandler です。変更や編集はしないでください。ただし、この関数を手動でほかの場所に結び付けるのには使えます。

```js
editor.storage.tableOfContents.scrollHandler()
```

### scrollPosition

scrollParent 内の現在のスクロール位置です。

```js
editor.storage.tableOfContents.scrollPosition
```

## アンカーの配列

ストレージや `onUpdate` 関数が返す配列には、次の構造のオブジェクトが入っています。

```js
{
  dom: HTMLElement // このアンカーの HTML 要素
  editor: Editor // エディタ
  id: string // ノードの ID
  isActive: boolean // このアンカーが現在アクティブかどうか
  isScrolledOver: boolean // このアンカーをすでにスクロールで通り過ぎたかどうか
  itemIndex: number // 現在の階層での項目の番号
  level: number // 項目の現在の階層。実際のアンカーの階層とは異なる場合があり、上位から下位の見出しへの階層構造をレンダリングするのに使う
  node: Node // このアンカーの ProseMirror ノード
  originalLevel: number // 実際の階層
  pos: number // アンカーのノードの位置
  textContent: string // アンカーのテキスト
}
```

これだけの情報があれば、目次を自由にレンダリングできます。

## サーバー側でアンカーの ID を付けるユーティリティ

`generateTocIds` 関数を使うと、`Editor` のインスタンスを作らずに、サーバー側で Tiptap のドキュメントにアンカーの ID（`id` と `data-toc-id`）を付けられます。`@tiptap/static-renderer` などでドキュメントを静的にレンダリングしつつ、動作中のエディタで `TableOfContents` プラグインが付けるのと同じアンカーの属性を得たい場合に便利です。

### 引数

- **`doc`**（`JSONContent`）: アンカーの ID を付ける Tiptap の JSON ドキュメント
- **`extensions`**（`Extensions`）: 使う拡張機能。`TableOfContents` 拡張機能を必ず含めてください。ID の作り方やアンカーとして扱うノードの型を変えるには、`getId` や `anchorTypes` などのオプションを `TableOfContents` 拡張機能に渡します。

### 戻り値

新しい Tiptap のドキュメント（`JSONContent` オブジェクト）を返します。アンカーの型のノードのうち、ID がなかったものや重複していたものに、`id` 属性と `data-toc-id` 属性が付いています。

### 例

```js
import { generateTocIds, TableOfContents } from '@tiptap/extension-table-of-contents'
import { StarterKit } from '@tiptap/starter-kit'

const doc = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Introduction' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'A paragraph.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Details' }] },
  ],
}

const newDoc = generateTocIds(doc, [StarterKit, TableOfContents])

// 結果:
// {
//   type: 'doc',
//   content: [
//     { type: 'heading', attrs: { level: 1, id: 'd4590f81-52e8-45ec-b317-2e9a805b03e3', 'data-toc-id': 'd4590f81-52e8-45ec-b317-2e9a805b03e3' }, content: [...] },
//     { type: 'paragraph', content: [...] },
//     { type: 'heading', attrs: { level: 2, id: 'c88f9b5f-7b91-442f-b4d9-ee0d04104827', 'data-toc-id': 'c88f9b5f-7b91-442f-b4d9-ee0d04104827' }, content: [...] }
//   ]
// }
```

この関数は、`anchorTypes` や `getId` を含め、`TableOfContents` 拡張機能の設定を自動的に読み取ります。
