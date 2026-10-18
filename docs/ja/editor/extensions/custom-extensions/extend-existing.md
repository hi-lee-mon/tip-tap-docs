# 既存の拡張機能に機能を足す

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing](https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing)

どの拡張機能にも `extend()` メソッドがあります。変更・追加したい内容をすべてオブジェクトにまとめて渡します。

たとえば、箇条書きリストのキーボードショートカットを変えたいとします。まずは拡張機能のソースコード、この場合は [`BulletList` ノード](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list/src/bullet-list/bullet-list.ts) を見てみましょう。キーボードショートカットを上書きする例なら、コードは次のようになります。

```js
// 1. 拡張機能をインポートする
import BulletList from '@tiptap/extension-bullet-list'

// 2. キーボードショートカットを上書きする
const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.toggleBulletList(),
    }
  },
})

// 3. カスタム拡張機能をエディタに追加する
new Editor({
  extensions: [
    CustomBulletList,
    // …
  ],
})
```

名前を除けば、既存の拡張機能のどの部分も同じ方法で変えられます。以下では、extend メソッドで変えられるものをひととおり紹介します。各例では 1 つの側面だけを扱いますが、これらを組み合わせて、1 回の `extend()` 呼び出しで複数の側面を変えることもできます。

## 名前

拡張機能の名前はあちこちで使われているため、変えるのはそう簡単ではありません。既存の拡張機能の名前を変えたい場合は、拡張機能をまるごとコピーし、名前が出てくる箇所をすべて書き換えてください。

拡張機能の名前は JSON にも含まれます。[コンテンツを JSON で保存している](../../../guides/output-json-html.md#option-1-json) 場合は、そちらの名前も変える必要があります。

## 設定

設定はもともとすべて拡張機能から変更できます。ただ、デフォルトの設定そのものを変えたい場合（たとえば、Tiptap の上にほかの開発者向けのライブラリを提供する場合）は、次のように書きます。

```js
import Heading from '@tiptap/extension-heading'

const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3],
    }
  },
})
```

## ストレージ

いずれ、拡張機能のインスタンスにデータを保存したくなる場面が来るはずです。このデータは変更可能で、拡張機能の中からは `this.storage` でアクセスできます。

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  addStorage() {
    return {
      awesomeness: 100,
    }
  },

  onUpdate() {
    this.storage.awesomeness += 1
  },
})
```

拡張機能の外からは `editor.storage` でアクセスできます。拡張機能の名前がそれぞれ一意になっていることを確認してください。

```js
const editor = new Editor({
  extensions: [CustomExtension],
})

const awesomeness = editor.storage.customExtension.awesomeness
```

## スキーマ

Tiptap は厳格なスキーマに基づいて動きます。スキーマは、コンテンツをどう構成・入れ子にできるか、どう振る舞うかなど、多くのことを決めています。既存の拡張機能について、[スキーマのあらゆる側面を変えられます](../../core-concepts/schema.md)。よくあるユースケースをいくつか紹介します。

デフォルトの `Blockquote` 拡張機能は、見出しなどほかのノードを囲めます。引用ブロックの中に段落しか置けないようにしたい場合は、`content` 属性をそのように設定します。

```js
// 引用ブロックには段落しか含められない
import Blockquote from '@tiptap/extension-blockquote'

const CustomBlockquote = Blockquote.extend({
  content: 'paragraph*',
})
```

スキーマでは、ノードをドラッグ可能にすることもできます。そのためのオプションが `draggable` です。デフォルトは `false` ですが、上書きできます。

```js
// ドラッグ可能な段落
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
  draggable: true,
})
```

これはほんの小さな 2 つの例にすぎません。[土台にある ProseMirror のスキーマ](https://prosemirror.net/docs/ref/#model.SchemaSpec) は、とても強力です。

## 属性

属性を使うと、コンテンツに追加の情報を保存できます。たとえば、デフォルトの `Paragraph` ノードを拡張して、色を変えられるようにしたいとします。

```js
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    // 属性の設定を持つオブジェクトを返す
    return {
      color: {
        default: 'pink',
      },
    },
  },
})

// 結果:
// <p color="pink">Example Text</p>
```

これだけで Tiptap に新しい属性を伝え、デフォルト値を `'pink'` に設定できます。属性はすべて、デフォルトで HTML 属性としてレンダリングされ、初期化時にはコンテンツからパースされます。

色の例を続けます。実際にテキストに色を付けるために、インラインスタイルを追加したいとしましょう。`renderHTML` 関数で HTML 属性を返すと、それが出力にレンダリングされます。

次の例では、`color` の値をもとに style 属性を追加します。

```js
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        // 属性の値を受け取り …
        renderHTML: (attributes) => {
          // … HTML 属性を持つオブジェクトを返す。
          return {
            style: `color: ${attributes.color}`,
          }
        },
      },
    }
  },
})

// 結果:
// <p style="color: pink">Example Text</p>
```

属性を HTML からどうパースするかも制御できます。たとえば、色を（単なる `color` ではなく）`data-color` という属性に保存したい場合は、次のように書きます。

```js
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        // HTML のパースをカスタマイズする（たとえば初期コンテンツを読み込むため）
        parseHTML: (element) => element.getAttribute('data-color'),
        // … HTML のレンダリングもカスタマイズする。
        renderHTML: (attributes) => {
          return {
            'data-color': attributes.color,
            style: `color: ${attributes.color}`,
          }
        },
      },
    }
  },
})

// 結果:
// <p data-color="pink" style="color: pink">Example Text</p>
```

`rendered: false` を指定すると、属性のレンダリングを完全に無効にできます。

### 既存の属性を拡張する

既存の属性を残したまま拡張機能に属性を追加したい場合は、`this.parent()` で既存の属性にアクセスできます。

`this.parent` が undefined の場合もあるので、そのケースを確認するか、オプショナルチェーン `this.parent?.()` を使ってください。

```js
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      myCustomAttribute: {
        // …
      },
    }
  },
})
```

## グローバル属性

属性は、複数の拡張機能にまとめて適用できます。テキストの配置、行の高さ、色、フォントファミリーなど、スタイルに関わる属性で便利です。

より複雑な例は、[`TextAlign`](../functionality/textalign.md) 拡張機能の [ソースコード全体](https://github.com/ueberdosis/tiptap/tree/main/packages/extension-text-align) を見てください。要点だけ示すと、次のような仕組みです。

```js
import { Extension } from '@tiptap/core'

const TextAlign = Extension.create({
  addGlobalAttributes() {
    return [
      {
        // 次の拡張機能を拡張する
        types: ['heading', 'paragraph'],
        // … これらの属性で
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

### グローバル属性をすべての拡張機能に適用する

特定の種類に属性を適用するだけでなく、`types` プロパティに短縮形の文字列を指定して、より広い範囲に属性を適用することもできます。何に適用するのかが明示され、コードを読むだけで意図がわかる API になっています。

#### すべてのノードとマークに適用する

`types: '*'` を使うと、すべてのノードの種類（組み込みのテキストノードを除く）とすべてのマークの種類に属性を適用します。

```js
import { Extension } from '@tiptap/core'

const UniversalAttribute = Extension.create({
  addGlobalAttributes() {
    return [
      {
        types: '*',
        attributes: {
          customAttribute: {
            default: 'default-value',
            renderHTML: (attributes) => ({
              'data-custom': attributes.customAttribute,
            }),
            parseHTML: (element) => element.getAttribute('data-custom') || 'default-value',
          },
        },
      },
    ]
  },
})
```

#### すべてのノードに適用する

`types: 'nodes'` を使うと、すべてのノードの種類（組み込みのテキストノードを除く）に属性を適用します。

```js
const NodeAttribute = Extension.create({
  addGlobalAttributes() {
    return [
      {
        types: 'nodes',
        attributes: {
          nodeClass: {
            default: null,
            renderHTML: (attributes) => ({
              class: attributes.nodeClass,
            }),
            parseHTML: (element) => element.className || null,
          },
        },
      },
    ]
  },
})
```

#### すべてのマークに適用する

`types: 'marks'` を使うと、すべてのマークの種類に属性を適用します。

```js
const MarkAttribute = Extension.create({
  addGlobalAttributes() {
    return [
      {
        types: 'marks',
        attributes: {
          emphasis: {
            default: false,
            renderHTML: (attributes) => {
              if (!attributes.emphasis) return {}
              return { style: 'font-style: italic' }
            },
            parseHTML: (element) => element.style.fontStyle === 'italic',
          },
        },
      },
    ]
  },
})
```

#### 特定の種類に適用する

細かく制御したい場合は、これまでどおり種類の名前を配列で指定できます。

```js
const TextAlignAttribute = Extension.create({
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

> [!NOTE]
> **ヒント**
>
> 短縮形の文字列（`'*'`、`'nodes'`、`'marks'`）を使うと、`types` プロパティを省略するよりも意図が明示され、読むだけでわかる API になります。グローバル属性の適用範囲をほかの開発者にすぐ伝えたいときに使ってください。

## HTML をレンダリングする

`renderHTML` 関数を使うと、拡張機能を HTML にどうレンダリングするかを制御できます。この関数には、ローカルの属性、グローバル属性、設定した CSS クラスをすべて含む属性オブジェクトが渡されます。`Bold` 拡張機能の例を示します。

```js
renderHTML({ HTMLAttributes }) {
  return ['strong', HTMLAttributes, 0]
},
```

配列の最初の値は HTML タグの名前です。2 番目の要素がオブジェクトなら、属性の集まりとして解釈されます。それ以降の要素は子要素としてレンダリングされます。

数値の 0（「穴」を表す）は、コンテンツを挿入する位置を示します。タグが 2 段に入れ子になった `CodeBlock` 拡張機能のレンダリングを見てみましょう。

```js
renderHTML({ HTMLAttributes }) {
  return ['pre', ['code', HTMLAttributes, 0]]
},
```

ここに特定の属性を追加したい場合は、`@tiptap/core` から `mergeAttributes` ヘルパーをインポートします。

```js
import { mergeAttributes } from '@tiptap/core'

// ...

renderHTML({ HTMLAttributes }) {
  return ['a', mergeAttributes(HTMLAttributes, { rel: this.options.rel }), 0]
},
```

## HTML をパースする

`parseHTML()` 関数は、HTML からエディタのドキュメントを読み込もうとします。この関数は引数として HTML の DOM 要素を受け取り、属性とその値を持つオブジェクトを返すことが期待されています。[`Bold`](../marks/bold.md) マークを簡略化した例を示します。

```js
parseHTML() {
  return [
    {
      tag: 'strong',
    },
  ]
},
```

これは、すべての `<strong>` タグを `Bold` マークに変換するルールを定義しています。さらに高度なこともできます。拡張機能の完全な例は次のとおりです。

```js
parseHTML() {
  return [
    // <strong>
    {
      tag: 'strong',
    },
    // <b>
    {
      tag: 'b',
      getAttrs: node => node.style.fontWeight !== 'normal' && null,
    },
    // <span style="font-weight: bold"> と <span style="font-weight: 700">
    {
      style: 'font-weight',
      getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
    },
  ]
},
```

これは `<strong>` タグと `<b>` タグに加え、インラインスタイルで `font-weight` を bold にしている任意の HTML タグを検出します。

このように、必要に応じて `getAttrs` コールバックを渡し、特定の HTML 属性の有無など、より複雑なチェックを追加できます。コールバックには HTML の DOM ノードが渡されます。ただし `style` 属性をチェックする場合は、その値が渡されます。

`&& null` は何をしているのか、と思ったかもしれません。[ProseMirror は、チェックに成功した場合に null か undefined を受け取ることを期待しています。](https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.getAttrs)

ほかの拡張機能との競合を解決するには、[ルールに `priority` を渡します](https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.priority)。たとえば、class 属性を持つ段落を探すカスタム拡張機能を作ったものの、デフォルトの段落の拡張機能もすでに使っている場合です。

### getAttrs を使う

例の中にあった `getAttrs` 関数には、2 つの目的があります。

1. HTML 属性をチェックして、ルールに一致するか（その HTML からマークやノードを作るか）を判断する。関数が `false` を返すと一致しない
2. DOM 要素を受け取り、その HTML 属性を使ってマークやノードの属性を設定する

```js
parseHTML() {
  return [
    {
      tag: 'span',
      getAttrs: element => {
        // 要素が属性を持っているか確認する
        element.hasAttribute('style')
        // インラインスタイルを取得する
        element.style.color
        // 特定の属性を取得する
        element.getAttribute('data-color')
      },
    },
  ]
},
```

属性名をキー、パースした値を値とするオブジェクトを返すと、マークやノードの属性を設定できます。ただし、`addAttributes()` の中の `parseHTML` を使うことをおすすめします。そのほうがコードをすっきり保てます。

```js
addAttributes() {
  return {
    color: {
      // `data-color` 属性の値に応じて color 属性を設定する
      parseHTML: element => element.getAttribute('data-color'),
    }
  }
},
```

`getAttrs` やほかの `ParseRule` のプロパティについては、[ProseMirror のリファレンス](https://prosemirror.net/docs/ref/#model.ParseRule) を参照してください。
