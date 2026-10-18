# Markdown に対応した絵文字のインラインノードを作る

> 原文: [https://tiptap.dev/docs/editor/markdown/guides/create-a-emoji-inline-block](https://tiptap.dev/docs/editor/markdown/guides/create-a-emoji-inline-block)

このガイドでは、絵文字のショートコード（例: `:smile:`）をレンダリングする小さなアトミックのインラインノードを、Markdown に対応させる方法を説明します。作業をわかりやすい4つのステップに分け、各ステップに完全な例を載せるので、どのステップでも全体像を見失わずに進められます。

1. 基本となる `emoji` ノードを作る（Markdown にはまだ対応させない）
2. ステップ2: `:name:` をトークンに変換するトークナイザーを追加する
3. ステップ3: トークンを Tiptap JSON に変換するパーサーを追加する
4. ステップ4: Tiptap JSON を Markdown にシリアライズして戻すレンダラーを追加する

対応させる短縮記法の例です。

```md
Hello :smile: world!
```

---

## ステップ1: 基本の `emoji` ノードを作る

まず、`name` 属性を持ち、HTML で絵文字をレンダリングする小さなアトミックのインラインノードを定義します。

```js
import { Node } from '@tiptap/core'

const emojiMap = {
  smile: '😊',
  heart: '❤️',
  thumbsup: '👍',
  fire: '🔥',
  // 必要に応じて対応を追加する
}

export const Emoji = Node.create({
  name: 'emoji',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: 'smile' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-emoji]' }]
  },

  renderHTML({ node }) {
    const emoji = emojiMap[node.attrs.name] || node.attrs.name || 'smile'
    return ['span', { 'data-emoji': node.attrs.name }, emoji]
  },
})
```

**補足:**
- このノードは `atom: true` かつ `inline` なので、分割できない1つのインラインコンテンツとして振る舞います。
- `emojiMap` は、HTML に出力するときに短い名前を実際の絵文字に対応させるためのものです。

---

## ステップ2: カスタムの Markdown トークナイザーを追加する

トークナイザーは、インラインの Markdown にある `:name:` のショートコードを見つけ、絵文字の名前を持つトークンを返します。次の例はトークナイザーを含めた拡張機能の全体です。基本の Node にどう組み込まれるかを確認できます。

```js
import { Node } from '@tiptap/core'

const emojiMap = {
  smile: '😊',
  heart: '❤️',
  thumbsup: '👍',
  fire: '🔥',
  // 必要に応じて対応を追加する
}

export const Emoji = Node.create({
  name: 'emoji',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: 'smile' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-emoji]' }]
  },

  renderHTML({ node }) {
    const emoji = emojiMap[node.attrs.name] || node.attrs.name || 'smile'
    return ['span', { 'data-emoji': node.attrs.name }, emoji]
  },

  // :name: のショートコードを見つける Markdown トークナイザーを定義する
  markdownTokenizer: {
    name: 'emoji',
    level: 'inline',
    // レキサー向けの高速なヒント
    start: (src) => src.indexOf(':'),
    tokenize: (src, tokens, lexer) => {
      // :name: にマッチする。name には英字、数字、アンダースコア、プラス記号を使える
      const match = /^:([a-z0-9_+]+):/i.exec(src)
      if (!match) return undefined

      return {
        type: 'emoji',
        raw: match[0],      // ":smile:" のようなマッチ全体
        emojiName: match[1], // "smile" のような取り出した名前
      }
    },
  },
})
```

**実装上の補足:**
- `start` は、レキサーが候補の位置をすばやく見つけるための最適化です。
- トークナイザーは、`type`、`raw`、`emojiName` のフィールドを持つトークンオブジェクトを返します。これをパーサーが使います。
- インラインのパースに組み込まれるよう、トークナイザーはインラインレベル（`level: 'inline'`）にしておきます。

---

## ステップ3: パーサーを追加する

`parseMarkdown` 関数は、トークナイザーのトークンを Tiptap のノードに変換します。アトミックのインラインノードでは、`type` と `attrs` を持つノードオブジェクトを返します。次の例は、トークナイザーとパースを含めた拡張機能の全体です。

```js
import { Node } from '@tiptap/core'

const emojiMap = {
  smile: '😊',
  heart: '❤️',
  thumbsup: '👍',
  fire: '🔥',
  // 必要に応じて対応を追加する
}

export const Emoji = Node.create({
  name: 'emoji',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: 'smile' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-emoji]' }]
  },

  renderHTML({ node }) {
    const emoji = emojiMap[node.attrs.name] || node.attrs.name || 'smile'
    return ['span', { 'data-emoji': node.attrs.name }, emoji]
  },

  markdownTokenizer: {
    name: 'emoji',
    level: 'inline',
    // レキサー向けの高速なヒント
    start: (src) => src.indexOf(':'),
    tokenize: (src, tokens, lexer) => {
      // :name: にマッチする。name には英字、数字、アンダースコア、プラス記号を使える
      const match = /^:([a-z0-9_+]+):/i.exec(src)
      if (!match) return undefined

      return {
        type: 'emoji',
        raw: match[0],      // ":smile:" のようなマッチ全体
        emojiName: match[1], // "smile" のような取り出した名前
      }
    },
  },

  // トークンを Tiptap のノードにパースする
  parseMarkdown: (token, helpers) => {
    return {
      type: 'emoji',
      attrs: { name: token.emojiName },
    }
  },
})
```

**補足:**
- `parseMarkdown` 関数が返すオブジェクトの `type` は、ノードの `name` と一致させます。
- アトミックノードは `content` を持ちません。属性だけを持つ、単独のノードです。

---

## ステップ4: レンダラーを追加する

エディタの状態を Markdown のショートコードにシリアライズして戻せるよう、`renderMarkdown` 関数を実装します。この関数は Tiptap のノードを受け取り、そのノードを表す Markdown 文字列を返します。次の例は、トークナイザー、パース、レンダリングをすべて含めた拡張機能の全体です。

```js
import { Node } from '@tiptap/core'

const emojiMap = {
  smile: '😊',
  heart: '❤️',
  thumbsup: '👍',
  fire: '🔥',
  // 必要に応じて対応を追加する
}

export const Emoji = Node.create({
  name: 'emoji',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: 'smile' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-emoji]' }]
  },

  renderHTML({ node }) {
    const emoji = emojiMap[node.attrs.name] || node.attrs.name || 'smile'
    return ['span', { 'data-emoji': node.attrs.name }, emoji]
  },

  markdownTokenizer: {
    name: 'emoji',
    level: 'inline',
    // レキサー向けの高速なヒント
    start: (src) => src.indexOf(':'),
    tokenize: (src, tokens, lexer) => {
      // :name: にマッチする。name には英字、数字、アンダースコア、プラス記号を使える
      const match = /^:([a-z0-9_+]+):/i.exec(src)
      if (!match) return undefined

      return {
        type: 'emoji',
        raw: match[0],       // ":smile:" のようなマッチ全体
        emojiName: match[1], // "smile" のような取り出した名前
      }
    },
  },

  // トークンを Tiptap のノードにパースする
  parseMarkdown: (token, helpers) => {
    return {
      type: 'emoji',
      attrs: { name: token.emojiName },
    }
  },

  // Tiptap のノードを Markdown にレンダリングして戻す
  renderMarkdown: (node, helpers) => {
    // :name: のショートコードにシリアライズして戻す。保存した name 属性を使う
    return `:${node.attrs?.name || 'unknown'}:`
  },
})
```

---

## 使い方

絵文字のショートコードを含む Markdown から、エディタのコンテンツを設定します。Markdown の組み込み方に応じて、`contentType: 'markdown'` を渡すか、使っている環境が提供する API を使ってください。

```js
editor.commands.setContent('Hello :smile: :heart: :thumbsup:', { contentType: 'markdown' })
```

これで、対応する `name` 属性を持つインラインの `emoji` ノードができます。HTML のレンダリングでは、（`emojiMap` で）対応づけた絵文字が表示されます。

---

## テストとエッジケース

- 未知の名前: ショートコードが `emojiMap` にない場合、今の実装では span の中に `name` がそのまま表示されます（代わりの表示にしたり、ノードを取り除いたりするほうがよい場合もあります）。必要なら、`markdownTokenizer` か `parseMarkdown` で名前を検証または正規化してください。
- 大文字と小文字: トークナイザーは `i` フラグを使っているので、名前の大文字と小文字を区別しません。`emojiMap` のキーを決めた規則に合わせるか、`.toLowerCase()` で正規化してください。
- インラインのパース: インラインのトークナイザーなので、段落やインラインの文脈の中で試されます。他のインラインのトークナイザー（強調など）とぶつからないよう、必要に応じて正規表現を調整したり、前後の空白を確かめたりしてください。
- アトミックな振る舞い: ノードはアトミックなので、テキストとして編集できません。絵文字の要素ならこれで適切ですが、編集できるショートコードにしたい場合は別の振る舞いが必要になるかもしれません。
