# Drag Handle 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/drag-handle](https://tiptap.dev/docs/editor/extensions/functionality/drag-handle)

エディタでノードをドラッグして動かしたいと思ったことはありませんか。私たちもそう思ったので、そのための拡張機能を用意しました。

`DragHandle` 拡張機能を使うと、エディタ内でノードをドラッグする処理を手軽に扱えます。独自のレンダリング関数や配置なども指定できます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/DragHandle)

## インストール

```bash
npm install @tiptap/extension-drag-handle
```

## 設定

### render

floating-ui/dom パッケージで配置される要素をレンダリングします。ノードをドラッグするときにハンドルとして表示されるのが、この要素です。

```js
DragHandle.configure({
  render: () => {
    const element = document.createElement('div')

    // CSS でアイコンを差し込むための目印として使う
    element.classList.add('custom-drag-handle')

    return element
  },
})
```

### computePositionConfig

floating-ui/dom パッケージでドラッグハンドルの位置を計算するときの設定です。[floating-ui のドキュメント](https://floating-ui.com/docs/computePosition)にあるオプションはどれでも渡せます。

デフォルト: `{ placement: 'left-start', strategy: 'absolute' }`

```js
DragHandle.configure({
  computePositionConfig: {
    placement: 'left',
    strategy: 'fixed',
  },
})
```

### getReferencedVirtualElement

ドラッグハンドルの仮想要素を返す関数です。特定の DOM 要素を基準にメニューを配置したいときに便利です。

デフォルト: `undefined`

```js
DragHandle.configure({
  getReferencedVirtualElement: () => {
    // 独自の配置に使う仮想要素を返す
    return null
  },
})
```

### locked

ドラッグハンドルの位置と表示状態を固定します。表示されていた場合はロックを解除するまで表示されたまま、非表示だった場合はロックを解除するまで非表示のままになります。

デフォルト: `false`

```js
DragHandle.configure({
  locked: true,
})
```

### onNodeChange

ノードにマウスが重なったときに、そのノードか null を返します。マウスが重なっているノードを強調表示するのに使えます。

デフォルト: `undefined`

```js
DragHandle.configure({
  onNodeChange: ({ node, editor, pos }) => {
    if (!node) {
      selectedNode = null
      return
    }
    // ノードを使って何か処理する
    selectedNode = node
  },
})
```

### onElementDragStart

要素のドラッグが始まったときに呼ばれる関数です。ドラッグ開始時に独自の処理を加えるのに使えます。

シグネチャ: `(event: DragEvent) => void`

デフォルト: `undefined`

```js
DragHandle.configure({
  onElementDragStart: (event) => {
    // ドラッグが始まったときの処理
  },
})
```

### onElementDragEnd

要素のドラッグが終わったときに呼ばれる関数です。ドラッグ終了時に独自の処理を加えるのに使えます。

シグネチャ: `(event: DragEvent) => void`

デフォルト: `undefined`

```js
DragHandle.configure({
  onElementDragEnd: (event) => {
    // ドラッグが終わったときの処理
  },
})
```

### nested

リスト項目や引用ブロックなど、入れ子になったコンテンツでもドラッグハンドルを使えるようにします。

有効にすると、最上位のブロックだけでなく、入れ子のブロックにもドラッグハンドルが表示されます。どのノードを対象にするかは、カーソルの位置と設定したルールをもとに、ルールベースの採点の仕組みで決まります。

デフォルト: `false`

```js
// デフォルトの設定で有効にする
DragHandle.configure({
  nested: true,
})

// 端の検出を独自に設定して有効にする
DragHandle.configure({
  nested: {
    edgeDetection: {
      threshold: 20,
    },
  },
})
```

設定の詳細は、下の[入れ子のドラッグハンドル](#nested-drag-handle)の節を参照してください。

## コマンド

### lockDragHandle()

ドラッグハンドルの位置と表示状態を固定します。表示されていた場合はロックを解除するまで表示されたまま、非表示だった場合はロックを解除するまで非表示のままになります。

ドラッグハンドルの中にメニューを置き、マウスが重なっているかどうかに関係なく表示し続けたい場合に便利です。

```js
editor.commands.lockDragHandle()
```

### unlockDragHandle()

ドラッグハンドルのロックを解除し、表示状態と動作をデフォルトに戻します。

```js
editor.commands.unlockDragHandle()
```

### toggleDragHandle()

ドラッグハンドルのロック状態を切り替えます。ロックされていれば解除し、解除されていればロックします。

```js
editor.commands.toggleDragHandle()
```

## 入れ子のドラッグハンドル

デフォルトでは、ドラッグハンドルは最上位のブロックにだけ表示されます。`nested` を有効にすると、リスト項目や引用ブロック内の段落など、入れ子になったコンテンツでも使えます。

### 基本的な使い方

```js
// すべてデフォルトの設定で有効にする
DragHandle.configure({
  nested: true,
})
```

### 設定のオプション

細かく制御したい場合は、オプションのオブジェクトを渡します。

```js
DragHandle.configure({
  nested: {
    // 端の検出の設定
    edgeDetection: 'left', // または 'right'、'both'、'none'、独自の設定

    // ノードの選び方を決める独自のルール
    rules: [],

    // デフォルトのルールを使うかどうか
    defaultRules: true,

    // 特定の種類のコンテナーに限定する
    allowedContainers: ['bulletList', 'orderedList'],
  },
})
```

### 端の検出

端の検出は、入れ子のノードより親ノードを優先する条件を決めます。カーソルがコンテンツ領域の端に近いときは、入れ子の中身より親のコンテナを選びたい場面がよくあります。

#### プリセット

```js
DragHandle.configure({
  nested: {
    // 'left'（デフォルト）: 左端・上端の近くでは親を優先する
    edgeDetection: 'left',

    // 'right': 右端・上端の近くでは親を優先する（RTL のレイアウト向け）
    edgeDetection: 'right',

    // 'both': 左右どちらの端の近くでも親を優先する
    edgeDetection: 'both',

    // 'none': 端の検出をすべて無効にする
    edgeDetection: 'none',
  },
})
```

#### 独自の設定

細かく調整するには、設定のオブジェクトを渡します。

```js
DragHandle.configure({
  nested: {
    edgeDetection: {
      // 親を優先するきっかけになる端
      edges: ['left', 'top'],

      // 端からの距離（ピクセル）。この範囲で反応する（デフォルト: 12）
      threshold: 20,

      // 親をどれだけ強く優先するか（デフォルト: 500）
      strength: 500,
    },
  },
})
```

設定の一部だけを渡して特定の値を上書きし、残りはデフォルトのままにすることもできます。

```js
DragHandle.configure({
  nested: {
    // threshold だけを上書きし、edges と strength はデフォルトのままにする
    edgeDetection: { threshold: -16 },
  },
})
```

#### strength の働き

`strength` の値は、カーソルが端に近いときに親ノードをどれだけ強く優先するかを決めます。採点の仕組みと組み合わせて働きます。

1. 候補のノードは、どれも基本の点数 **1000** から始まる
2. カーソルが設定した端に近いとき、`strength × depth` の分だけ減点される
3. 残った点数がいちばん高いノードが選ばれる

デフォルトの strength **500** の場合は次のようになります。

| ノードの深さ | 減点 | 残りの点数 | 効果 |
|------------|-----------|-----------------|--------|
| 1（浅い） | 500 | 500 | 選べるが、優先度は下がる |
| 2 | 1000 | 0 | かろうじて選べるが、端にないノードに負ける |
| 3 以上（深い） | 1500 以上 | マイナス | 実質的に対象外 |

つまり、端の近くでは深く入れ子になったノードほど優先度が大きく下がり、その親のコンテナを選びやすくなります。

**例:**
- `strength: 250`: 優先の度合いが穏やか。深さ3のノードでも、端の近くである程度選べる
- `strength: 500`: デフォルト。端の近くでは、深さ2以上のノードの優先度が大きく下がる
- `strength: 1000`: 強い。端の近くにある入れ子のノードは、実質的にすべて対象外になる

> [!NOTE]
> **threshold にマイナスの値を使う**
>
> threshold にマイナスの値（`-16` など）を指定すると、端の検出が反応する範囲が実質的に狭まります。カーソルが端に近くても入れ子の項目を選びやすくなり、端の検出が働くのは、カーソルが要素のより内側に入ってからになります。

### 許可するコンテナ

入れ子のドラッグハンドルを、特定の種類のコンテナに限定します。

```js
DragHandle.configure({
  nested: {
    // リストの中でだけ、入れ子のドラッグを有効にする
    allowedContainers: ['bulletList', 'orderedList'],
  },
})
```

指定すると、入れ子のコンテンツについては、指定した種類のコンテナ内でだけドラッグハンドルが表示されます。最上位のブロックは、この設定に関係なく常にドラッグできます。

### 独自のルール

ドラッグハンドルは、採点の仕組みで選ぶノードを決めます。候補のノードはどれも点数 1000 から始まり、ルールがその点数を増減させます。最終的な点数がいちばん高いノードが選ばれます。

#### 独自のルールを作る

```js
DragHandle.configure({
  nested: {
    rules: [
      {
        id: 'preferParagraphs',
        evaluate: ({ node, parent, depth }) => {
          // 点数の増減を返す
          // - マイナス: ノードの点数を上げる（選ばれやすくなる）
          // - 0: 変化なし。ノードは今の点数のまま
          // - 1〜999: 減点。ノードは選ばれにくくなる
          // - 1000 以上: ノードは実質的に対象外になる

          if (node.type.name === 'paragraph') {
            return -200 // 段落の点数を 200 点上げる
          }
          return 100 // ほかのノードは少しだけ減点する
        },
      },
    ],
  },
})
```

#### 点数の増減の意味

| 戻り値 | 効果 | 使いどころの例 |
|--------------|--------|------------------|
| `-500` | 点数を 500 上げる | このノードの種類を強く優先する |
| `-100` | 点数を 100 上げる | このノードを少し優先する |
| `0` | 変化なし | ノードを特に扱いを変えない |
| `100` | 点数を 100 下げる | 優先度を少し下げる |
| `500` | 点数を 500 下げる | 優先度を大きく下げる |
| `1000+` | 実質的に対象外にする | このノードを決して選ばない |

どのノードも 1000 から始まるので、200 点上げたノードは 1200、100 点下げたノードは 900 になります。この場合は 1200 のノードが選ばれます。

#### ルールが受け取る情報

各ルールは、次のプロパティを持つコンテキストのオブジェクトを受け取ります。

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `node` | `Node` | 評価しているノード |
| `pos` | `number` | ドキュメント内の絶対位置 |
| `depth` | `number` | ドキュメントのツリーでの深さ（0 = ドキュメントのルート） |
| `parent` | `Node \| null` | 親ノード（ドキュメント自体なら null） |
| `index` | `number` | 兄弟ノードの中での順番（0 始まり） |
| `isFirst` | `boolean` | 最初の子なら true |
| `isLast` | `boolean` | 最後の子なら true |
| `$pos` | `ResolvedPos` | 高度な問い合わせに使う、解決済みの位置 |
| `view` | `EditorView` | DOM にアクセスするためのエディタのビュー |

#### 例: 独自の設問ブロック

選択肢を持つ独自の設問ブロックがある場合、選択肢だけをドラッグできるようにしたいことがあります。

```js
DragHandle.configure({
  nested: {
    rules: [
      {
        id: 'onlyAlternatives',
        evaluate: ({ node, parent }) => {
          // 設問の中では、選択肢だけをドラッグできるようにする
          if (parent?.type.name === 'question') {
            return node.type.name === 'alternative' ? 0 : 1000
          }
          return 0
        },
      },
    ],
  },
})
```

#### リストのような独自のノードを作る

リストのように振る舞う独自のノード（ドラッグできる子の項目を包むラッパー）を作る場合は、ラッパーより子の項目を優先するよう、ドラッグハンドルに指示する必要があります。指示がないと、ユーザーが個々の項目を狙いにくくなることがあります。

デフォルトのルールは、最初の子が `listItem` か `taskItem` であるノードの優先度を自動で下げます。ノード名が異なる独自のリスト構造には、2つの方法があります。

**方法1: 項目のノードに `listItem` または `taskItem` という名前を付ける**

独自の項目が標準のリスト項目を拡張したものか、同じように振る舞うものなら、同じ型名を使うことを検討してください。デフォルトのルールが自動で処理します。

**方法2: ラッパーの優先度を下げる独自のルールを追加する**

独自のノード名の場合は、ラッパーを減点するルールを追加します。

```js
DragHandle.configure({
  nested: {
    rules: [
      {
        id: 'deprioritizeCustomListWrapper',
        evaluate: ({ node }) => {
          // ラッパーの優先度を下げて、子の項目を選びやすくする
          if (node.type.name === 'myCustomList') {
            return 900
          }
          return 0
        },
      },
    ],
  },
})
```

**リストのような独自のノードのスタイルで気をつけること:**

独自のリストのラッパーには、端の検出が働く余地を作るため、十分なパディングかマージンを付けると効果的です。こうすると、ユーザーはカーソルを端に動かせばラッパー自体を選べ、メインのコンテンツ領域では個々の項目を選びやすいままになります。

```css
.my-custom-list {
  /* 端の検出でラッパーと項目を区別できるよう、余白を取る */
  padding: 0.5rem;
}

.my-custom-list-item {
  /* 項目を狙いやすいよう、項目の間に余白を取る */
  margin: 0.25rem 0;
  padding-left: 0.5rem;
}
```

#### デフォルトのルールを無効にする

ノードの選び方を完全に制御したい場合は、デフォルトのルールを無効にします。

```js
DragHandle.configure({
  nested: {
    defaultRules: false,
    rules: [
      // ここに独自のルールを書く
    ],
  },
})
```

> [!WARNING]
> **デフォルトのルール**
>
> デフォルトのルールは、インラインのコンテンツを対象外にする、リスト項目を正しく扱うなど、よくあるケースを処理しています。無効にするのは、特別な要件があり、その影響を理解している場合に限ってください。

### スタイルで気をつけること

入れ子のドラッグハンドルをうまく動かすには、エディタのスタイルの調整が必要になる場合があります。ドラッグハンドルを表示する物理的な場所と、端の検出の threshold が働く余地が要るためです。

#### 左側にマージンかパディングを取る

ドラッグハンドルはコンテンツの左側に配置されます。マージンが足りないと、テキストに重なったり、見える範囲の外に出たりすることがあります。

```css
.ProseMirror {
  /* 左側にドラッグハンドルの場所を空ける */
  padding-left: 2rem;
}

/* または、直下の子にマージンを付ける */
.ProseMirror > * {
  margin-left: 2rem;
}
```

#### 入れ子のコンテンツの余白

リスト項目などの入れ子の要素では、入れ子の各階層でドラッグハンドルを表示できるよう、インデントを十分に取ってください。

```css
.ProseMirror ul,
.ProseMirror ol {
  /* 入れ子のドラッグハンドルの場所を空ける */
  padding-left: 1.5rem;
}

.ProseMirror li {
  /* 必要に応じて余白を足す */
  margin-left: 0.5rem;
}
```

#### 端の検出と threshold

端の検出の `threshold` の値は、要素の端からのピクセル数です。コンテンツにパディングがない場合、threshold が 12px なら、カーソルが実際のテキストから 12px 以内にあるときに反応します。コンテンツ領域にパディングを付けると、端の検出の反応が自然に感じられます。

```css
.ProseMirror blockquote {
  /* パディングがあると、端の検出にゆとりが生まれる */
  padding: 0.5rem 1rem;
}

.ProseMirror li > p {
  /* 小さなパディングでも端の検出に役立つ */
  padding-left: 0.25rem;
}
```

#### 例: 入れ子のドラッグハンドル用のスタイル一式

```css
.ProseMirror {
  /* ドラッグハンドルの場所を確保する基本のパディング */
  padding: 1rem 1rem 1rem 3rem;
}

.ProseMirror > * {
  /* 最上位のブロックの左マージンをそろえる */
  margin-left: 0;
}

.ProseMirror ul,
.ProseMirror ol {
  /* リストのインデント */
  padding-left: 1.5rem;
}

.ProseMirror li {
  /* リストの記号とコンテンツの間の余白 */
  padding-left: 0.25rem;
}

.ProseMirror blockquote {
  /* ドラッグしやすいよう、引用ブロックにパディングを付ける */
  padding: 0.5rem 1rem;
  margin-left: 0;
  border-left: 3px solid #ccc;
}

/* ドラッグ中のノードの選択を強調表示する */
.ProseMirror-selectednode,
.ProseMirror-selectednoderange {
  position: relative;
}

.ProseMirror-selectednode::before,
.ProseMirror-selectednoderange::before {
  content: '';
  position: absolute;
  inset: -0.25rem;
  background-color: rgba(112, 207, 248, 0.3);
  border-radius: 0.2rem;
  pointer-events: none;
  z-index: -1;
}
```

> [!NOTE]
> **threshold にマイナスの値を使う**
>
> パディングを付けられない場合は、`threshold` にマイナスの値（`-16` など）を指定して、端の検出の範囲を狭められます。親ノードが優先されにくくなり、カーソルが端に近くても入れ子の項目を選べるようになります。
