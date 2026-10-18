# ノード位置

> 原文: [https://tiptap.dev/docs/editor/api/node-positions](https://tiptap.dev/docs/editor/api/node-positions)

ノード位置（`NodePos`）は、あるノードとその子・親の具体的な位置を表し、それらの間を簡単にたどれるようにします。ノード位置は DOM から強い影響を受けた設計で、ProseMirror の [ResolvedPos](https://prosemirror.net/docs/ref/#model.ResolvedPos) の実装をもとにしています。

## ノード位置を使う

新しいノード位置を作るいちばん簡単な方法は、エディタのインスタンスにあるヘルパー関数を使うことです。こうすれば常に正しいエディタのインスタンスを使え、API にも直接アクセスできます。

```js
// このあたりでエディタを準備しておく

// いちばん外側の document ノードの NodePosition
const $doc = editor.$doc

// ドキュメント内の 'heading' 型のノードをすべて取得する
const $headings = editor.$nodes('heading')

// 属性で絞り込む
const $h1 = editor.$nodes('heading', { level: 1 })

// ノードを直接取得する
const $firstHeading = editor.$node('heading', { level: 1 })

// 型が分からないときは $pos メソッドで新しい NodePos を作る
const $myCustomPos = editor.$pos(30)
```

NodePos のインスタンスを自分で作ることもできます。

```js
// エディタのインスタンスと、解決済みのドキュメント位置が必要
// 数値の位置しかない場合は editor.$pos() を使うほうがよい
const myNodePos = new NodePos(editor.state.doc.resolve(100), editor)
```

## NodePos でできること

`NodePos` を使うと、ブラウザで DOM をたどるのと同じ感覚でドキュメントをたどれます。親ノード、子ノード、兄弟ノードにアクセスできます。

**例:** `codeBlock` ノードのコンテンツを取得して更新する

```js
// ドキュメントから最初の codeBlock を取得する
const $codeBlock = editor.$node('codeBlock')

// codeBlock ノードの直前の NodePos を取得する
const $previousItem = $codeBlock.before

// コンテンツを簡単に更新する
$previousItem.content = '<p>Updated content</p>'
```

DOM に慣れていれば、次の例は見覚えがあるはずです。

**例:** リスト項目を選択し、箇条書きリストに新しい項目を挿入する

```js
// ドキュメントから箇条書きリストを取得する
const $bulletList = editor.$node('bulletList')

// bulletList からすべての listItem を取得する
const $listItems = $bulletList.querySelectorAll('listItem')

// 最後の listItem を取得する
const $lastListItem = $listItems[0]

// 最後の listItem の後ろに新しい listItem を挿入する
editor.commands.insertContentAt($lastListItem.after, '<li>New item</li>')
```

（訳注: 原文のコードでは `$listItems[0]` で先頭の項目を取得しており、コメントの「最後の」とは一致しません。）

## API

### NodePos

NodePos クラスは、主に扱うことになるクラスです。あるノードとその子・親の具体的な位置を表し、それらの間を簡単にたどる手段を備えています。DOM から強い影響を受けた設計で、ProseMirror の [ResolvedPos](https://prosemirror.net/docs/ref/#model.ResolvedPos) の実装をもとにしています。

#### メソッド

| メソッド           | 引数                        | 戻り値               | 説明                                                                                               |
| ---------------- | --------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `constructor`    | `pos`（ResolvedPos）, `editor`（object） | `NodePos`             | 指定した `editor` インスタンス内の、指定した解決済み位置に新しい `NodePos` インスタンスを作る     |
| `closest`        | `nodeType`（string）              | `NodePos` または `null`   | ドキュメント構造を上にたどり、最も近い一致する `NodePos` を探す。見つからなければ `null` を返す |
| `querySelector`  | `nodeType`（string）, `attributes`（object） | `NodePos` または `null` | ドキュメント構造を下にたどり、最初に一致する `NodePos` を探す。属性で絞り込める       |
| `querySelectorAll`| `nodeType`（string）, `attributes`（object） | `Array<NodePos>`     | ドキュメント構造を下にたどり、一致する `NodePos` インスタンスをすべて探す。属性で絞り込める   |
| `setAttribute`   | `attributes`（object）            | `NodePos`             | 現在の `NodePos` に指定した属性を設定する                                                    |

##### constructor

**引数**

- `pos` – 包む対象の `ResolvedPos` インスタンス（例: `editor.state.doc.resolve(100)`）
- `editor` – 使うエディタのインスタンス

**戻り値** `NodePos`

```js
const myNodePos = new NodePos(editor.state.doc.resolve(100), editor)
```

##### closest

NodePosition から深さを上にたどって、最も近い NodePos インスタンスを返します。一致する NodePos がなければ `null` を返します。

**戻り値** `NodePos | null`

```js
const closest = myNodePos.closest('bulletList')
```

##### querySelector

NodePosition から深さを下にたどって、最初に一致する NodePos インスタンスを返します。一致する NodePos がなければ `null` を返します。

2 番目の引数で属性による絞り込みもできます。

**戻り値** `NodePos | null`

```js
const firstHeading = myNodePos.querySelector('heading')
const firstH1 = myNodePos.querySelector('heading', { level: 1 })
```

##### querySelectorAll

NodePosition から深さを下にたどって、一致する NodePos インスタンスをすべて返します。一致する NodePos がなければ空の配列を返します。

2 番目の引数で属性による絞り込みもできます。

**戻り値** `Array<NodePos>`

```js
const headings = myNodePos.querySelectorAll('heading')
const h1s = myNodePos.querySelectorAll('heading', { level: 1 })
```

##### setAttribute

現在の NodePos に属性を設定します。

**戻り値** `NodePos`

```js
myNodePos.setAttribute({ level: 1 })
```

#### プロパティ

| プロパティ        | 型             | 説明                                                                                              |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| `node`          | `Node`（ProseMirror の Node） | 現在の `NodePos` にある ProseMirror のノード                                                           |
| `parent`        | `NodePos`         | 現在の `NodePos` の親ノード                                                                 |
| `children`      | `Array<NodePos>`  | 現在の `NodePos` の子ノード                                                                 |
| `firstChild`    | `NodePos` または `null` | 現在の `NodePos` の最初の子ノード。なければ `null`                                  |
| `lastChild`     | `NodePos` または `null` | 現在の `NodePos` の最後の子ノード。なければ `null`                                   |
| `pos`           | `number`          | ドキュメント内でのノードの位置                                                                 |
| `from`          | `number`          | ノードの開始位置                                                                        |
| `to`            | `number`          | ノードの終了位置                                                                          |
| `range`         | `number`          | 現在の `NodePos` にあるノードの範囲（from〜to）                                                 |
| `content`       | `string`          | 現在の `NodePos` にあるノードのコンテンツ。値を設定するとノードのコンテンツを更新できる           |
| `attributes`    | `Object`          | 現在の `NodePos` にあるノードの属性                                                      |
| `textContent`   | `string`          | 現在の `NodePos` にあるノードのテキストコンテンツ                                                    |
| `depth`         | `number`          | ドキュメント構造の中でのノードの深さ（階層）                                                  |
| `size`          | `number`          | 現在の `NodePos` にあるノードのサイズ                                                            |
| `before`        | `NodePos` または `null` | 現在の `NodePos` の直前のノード。なければ `null`                                  |
| `after`         | `NodePos` または `null` | 現在の `NodePos` の直後のノード。なければ `null`                                       |

##### node

現在のノード位置にある ProseMirror の Node です。

**戻り値** `Node`

```js
const node = myNodePos.node
node.type.name // 'paragraph'
```

##### element

現在のノード位置にある DOM 要素です。

**戻り値** `Element`

```js
const element = myNodePos.element
element.tagName // 'P'
```

##### content

NodePosition のコンテンツです。新しい値を設定すると、ノードのコンテンツを更新できます。

**戻り値** `string`

```js
const content = myNodePos.content
myNodePos.content = '<p>Updated content</p>'
```

##### attributes

NodePosition の属性です。

**戻り値** `Object`

```js
const attributes = myNodePos.attributes
attributes.level // 1
```

##### textContent

NodePosition のテキストコンテンツです。

**戻り値** `string`

```js
const textContent = myNodePos.textContent
```

##### depth

NodePosition の深さです。

**戻り値** `number`

```js
const depth = myNodePos.depth
```

##### pos

NodePosition の位置です。

**戻り値** `number`

```js
const pos = myNodePos.pos
```

##### size

NodePosition のサイズです。

**戻り値** `number`

```js
const size = myNodePos.size
```

##### from

NodePosition の開始位置です。

**戻り値** `number`

```js
const from = myNodePos.from
```

##### to

NodePosition の終了位置です。

**戻り値** `number`

```js
const to = myNodePos.to
```

##### range

NodePosition の範囲です。

**戻り値** `number`

```js
const range = myNodePos.range
```

##### parent

NodePosition の親の NodePos です。

**戻り値** `NodePos`

```js
const parent = myNodePos.parent
```

##### before

NodePosition の直前の NodePos です。直前に NodePos がなければ `null` を返します。

**戻り値** `NodePos | null`

```js
const before = myNodePos.before
```

##### after

NodePosition の直後の NodePos です。直後に NodePos がなければ `null` を返します。

**戻り値** `NodePos | null`

```js
const after = myNodePos.after
```

##### children

NodePosition の子の NodePos インスタンスです。

**戻り値** `Array<NodePos>`

```js
const children = myNodePos.children
```

##### firstChild

NodePosition の最初の子の NodePos インスタンスです。子がなければ `null` を返します。

**戻り値** `NodePos | null`

```js
const firstChild = myNodePos.firstChild
```

##### lastChild

NodePosition の最後の子の NodePos インスタンスです。子がなければ `null` を返します。

**戻り値** `NodePos | null`

```js
const lastChild = myNodePos.lastChild
```
