# Markdown に対応した注記（Admonition）ブロックを作る

> 原文: [https://tiptap.dev/docs/editor/markdown/guides/create-a-admonition-block](https://tiptap.dev/docs/editor/markdown/guides/create-a-admonition-block)

このガイドでは、Tiptap の独自の「注記（Admonition）」ブロックを Markdown に対応させる手順を説明します。作業をわかりやすい4つのステップに分け、各ステップには前のステップまでのコードを含んだ完全な例を載せます。どのステップでも、全体像を見失わずに進められます。

**ステップ**:
1. 基本となる Tiptap の `Node` 拡張機能を作る（Markdown にはまだ対応させない）
2. Markdown の生テキストからトークンを生成する、カスタムの Markdown トークナイザーを追加する
3. そのトークンを Tiptap JSON に変換するパーサーを追加する
4. Tiptap のノードを Markdown に戻すレンダラー（シリアライザー）を追加する

注記には `:::type` 形式の記法を使います。たとえば次のとおりです。

```javascript
:::warning
This is a warning with **bold** text.
:::
```

---

## ステップ1: 基本の拡張機能を作る

まず、構造、HTML のパースとレンダリング、属性だけを定義した最小限の `Node` から始めます。Markdown への対応はいったん後回しにして、先にスキーマと HTML の入出力に集中します。

```javascript
import { Node } from '@tiptap/core'

export const Admonition = Node.create({
  name: 'admonition',

  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-admonition]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { 'data-admonition': '', ...HTMLAttributes }, 0]
  },
})
```

**補足:**
- `content: 'block+'` で、注記の中に入れ子のブロックコンテンツを入れられるようにしています。
- 注記の `type` は、ノードの属性（HTML では `data-type`）として保存します。

---

## ステップ2: カスタムの Markdown トークナイザーを追加する

Tiptap の Markdown 対応には、Markdown のソースを Markdown パーサーが理解できるトークンに変換するトークナイザーを渡せます。トークナイザーの役割は、`:::type` ... `:::` のブロックを見つけ、関連するメタデータと（コンテンツ用の）入れ子のトークンを持つトークンオブジェクトを返すことです。

次の完全な例は、基本の Node に `markdownTokenizer` を加えたものです。トークナイザーが Node にどう組み込まれるかを、全体を通して確認できます。

```javascript
import { Node } from '@tiptap/core'

export const Admonition = Node.create({
  name: 'admonition',

  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-admonition]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { 'data-admonition': '', ...HTMLAttributes }, 0]
  },

  markdownTokenizer: {
    name: 'admonition',
    level: 'block', // ブロックレベルの要素

    // 開始位置をすばやく調べる。見つからなければ -1 を返す。
    // レキサーが走査を効率化するのに使う。
    start: (src) => src.indexOf(':::'),

    // 実際にトークンを組み立てる
    // tokenize 関数
    tokenize: (src, tokens, lexer) => {
      // この正規表現は次にマッチする:
      // :::type\n
      // （改行を含む任意の内容）\n
      // :::
      const match = /^:::(\w+)\n([\s\S]*?)\n:::\n?/.exec(src)
      if (!match) return undefined

      return {
        type: 'admonition',
        raw: match[0], // マッチした Markdown 全体
        admonitionType: match[1], // 例: 'warning'
        text: match[2], // 中身の Markdown テキスト

        // 中身のコンテンツは、Markdown のレキサーにブロックトークンとしてパースさせる
        tokens: lexer.blockTokens(match[2]),
      }
    },
  },
})
```

**実装の詳細:**
- `start` は、レキサーが候補の位置を探すための最適化です。
- `markdownTokenizer.tokenize` は、マッチしなければ `undefined` を返します。マッチした場合は、`raw` 文字列と、`parseMarkdown` 関数が必要とするフィールドを持つトークンオブジェクトを返す必要があります。
- 中身のコンテンツは、`lexer.blockTokens()`（または使っている Markdown ツールチェーンの同様のヘルパー）で入れ子のトークンにパースします。こうすると、パーサーが既存のブロックのパース処理を使い回せます。

---

## ステップ3: パーサーを追加する

`parseMarkdown` 関数は、トークナイザーが生成したトークンを受け取り、Tiptap で扱える JSON 形式のノード（1つまたは複数）を返す必要があります。入れ子のトークンを子のコンテンツにパースするには、渡される `helpers` を使います。

次の完全な例には、基本の Node、トークナイザー、そして新たに `parseMarkdown` 関数が入っています。各部品がどう組み合わさるかがわかります。

```javascript
import { Node } from '@tiptap/core'

export const Admonition = Node.create({
  name: 'admonition',

  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-admonition]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { 'data-admonition': '', ...HTMLAttributes }, 0]
  },

  markdownTokenizer: {
    name: 'admonition',
    level: 'block', // ブロックレベルの要素

    // 開始位置をすばやく調べる。見つからなければ -1 を返す。
    // レキサーが走査を効率化するのに使う。
    start: (src) => src.indexOf(':::'),

    // 実際にトークンを組み立てる
    // tokenize 関数
    tokenize: (src, tokens, lexer) => {
      // この正規表現は次にマッチする:
      // :::type\n
      // （改行を含む任意の内容）\n
      // :::
      const match = /^:::(\w+)\n([\s\S]*?)\n:::\n?/.exec(src)
      if (!match) return undefined

      return {
        type: 'admonition',
        raw: match[0], // マッチした Markdown 全体
        admonitionType: match[1], // 例: 'warning'
        text: match[2], // 中身の Markdown テキスト

        // 中身のコンテンツは、Markdown のレキサーにブロックトークンとしてパースさせる
        tokens: lexer.blockTokens(match[2]),
      }
    },
  },

  // Markdown のトークンを Tiptap JSON にパースする
  parseMarkdown: (token, helpers) => {
    return {
      type: 'admonition',
      attrs: { type: token.admonitionType || 'note' },
      // ヘルパーを使い、入れ子のトークンを Tiptap のコンテンツにパースする
      content: helpers.parseChildren(token.tokens || []),
    }
  },
})
```

**補足:**
- `helpers.parseChildren` は、中身のトークンを、Tiptap が期待するノードの `content` 配列に変換します。
- ここでの `type` は、Node の `name` と一致させてください。

---

## ステップ4: レンダラーを追加する

コンテンツを Markdown にシリアライズして戻すには、`renderMarkdown` 関数を実装します。この関数は Tiptap のノードを受け取り、それを表す Markdown 文字列を返します。ノードのコンテンツのシリアライズには `helpers.renderChildren` を使います。

次の完全な例では、トークナイザー、パーサー、レンダラーをすべて実装しています。これで、Markdown の入出力と HTML のレンダリングに対応した拡張機能が完成します。

```javascript
import { Node } from '@tiptap/core'

export const Admonition = Node.create({
  name: 'admonition',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-admonition]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { 'data-admonition': '', ...HTMLAttributes }, 0]
  },

  markdownTokenizer: {
    name: 'admonition',
    level: 'block', // ブロックレベルの要素

    // 開始位置をすばやく調べる。見つからなければ -1 を返す。
    // レキサーが走査を効率化するのに使う。
    start: (src) => src.indexOf(':::'),

    // 実際にトークンを組み立てる
    // tokenize 関数
    tokenize: (src, tokens, lexer) => {
      // この正規表現は次にマッチする:
      // :::type\n
      // （改行を含む任意の内容）\n
      // :::
      const match = /^:::(\w+)\n([\s\S]*?)\n:::\n?/.exec(src)
      if (!match) return undefined

      return {
        type: 'admonition',
        raw: match[0], // マッチした Markdown 全体
        admonitionType: match[1], // 例: 'warning'
        text: match[2], // 中身の Markdown テキスト

        // 中身のコンテンツは、Markdown のレキサーにブロックトークンとしてパースさせる
        tokens: lexer.blockTokens(match[2]),
      }
    },
  },

  // Markdown のトークンを Tiptap JSON にパースする
  parseMarkdown: (token, helpers) => {
    return {
      type: 'admonition',
      attrs: { type: token.admonitionType || 'note' },
      // ヘルパーを使い、入れ子のトークンを Tiptap のコンテンツにパースする
      content: helpers.parseChildren(token.tokens || []),
    }
  },

  renderMarkdown: (node, helpers) => {
    const type = node.attrs?.type || 'note'
    const content = helpers.renderChildren(node.content || [])
    // :::type ... ::: のブロックを組み立て直す。空白や改行は、使っている Markdown パーサーの想定に合わせること
    return `:::${type}\n${content}:::\n\n`
  },
})
```

---

## 使い方

注記の記法を使った Markdown からエディタのコンテンツを設定するには、Markdown 文字列を渡し、`contentType: 'markdown'` を指定します（エディタの組み込み方によって異なります）。

```javascript
const markdown = `
:::warning
This is a warning message with **bold** text.
:::
`

editor.commands.setContent(markdown, { contentType: 'markdown' })
```

これで、`type: 'warning'` を持ち、入れ子のコンテンツが Markdown としてパースされた `admonition` ノードができます。

---

## テストとエッジケース

- 入れ子のブロック: トークナイザーは中身のコンテンツに対して `lexer.blockTokens()` を呼びます。そのため、中身の Markdown（リスト、段落、見出し）は通常のブロックトークンとしてパースされ、Tiptap のコンテンツに変換されます。
- インラインの書式: `helpers.renderChildren` と `helpers.parseChildren` が同じトークンの集合につながっていれば、注記のコンテンツ内の太字、斜体、リンクは Markdown パーサーが処理します。
- 末尾の改行: トークナイザーの正規表現がどこまで末尾の改行を取り込むかに注意してください。使っている Markdown ツールチェーンの想定に合うよう、正規表現か `renderMarkdown` の出力を調整します。
- 種類の検証: 特定の種類（例: `note | warning | tip | danger`）だけを許可したい場合は、`markdownTokenizer.tokenize` か `parseMarkdown` で `admonitionType` を検証し、必要に応じてデフォルトに切り替えます。
