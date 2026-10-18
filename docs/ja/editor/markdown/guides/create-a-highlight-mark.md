# Markdown に対応したハイライトのマークを作る

> 原文: [https://tiptap.dev/docs/editor/markdown/guides/create-a-highlight-mark](https://tiptap.dev/docs/editor/markdown/guides/create-a-highlight-mark)

このガイドでは、小さなインラインの `highlight` マークを Markdown に対応させる方法を説明します。このマークは `==text==` という短縮記法（Markdown の一部の方言で使われます）を使い、HTML では `mark` 要素を生成します。

作業をわかりやすい4つのステップに分け、各ステップに完全な例を載せるので、どのステップでも全体像を見失わずに進められます。

1. 基本となる Tiptap の `Mark` 拡張機能を作る（Markdown にはまだ対応させない）
2. Markdown の生テキストからトークンを生成する、カスタムの Markdown トークナイザーを追加する
3. そのトークンを Tiptap JSON に変換する（マークを適用する）パーサーを追加する
4. Tiptap のコンテンツを Markdown に戻すレンダラー（シリアライザー）を追加する

対応させる短縮記法の例です。

```js
This is ==highlighted== text.
```

---

## ステップ1: 基本の `highlight` マークを作る

まず、マークの名前、HTML のパースとレンダリングの動作、オプションだけを定義した最小限の `Mark` から始めます。Markdown への対応はいったん後回しにして、先にスキーマと HTML の入出力に集中します。

```js
import { Mark } from '@tiptap/core'

export const Highlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },
})
```

**補足:**
- このマークは、HTML の `<mark>` タグにそのまま対応します。
- `toggleHighlight` コマンドで、プログラムからマークを切り替えられます。

---

## ステップ2: カスタムの Markdown トークナイザーを追加する

トークナイザーの役割は、Markdown の生テキストから `==text==` を見つけ、中身のテキストと入れ子のインライントークンを持つトークンを返すことです。このステップではトークナイザーだけに絞り、記法を正しく見つけられるかを単独でテストできるようにします。

```js
import { Mark } from '@tiptap/core'

export const Highlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },

  // ==text== を見つけるカスタムの Markdown トークナイザーを定義する
  markdownTokenizer: {
    name: 'highlight',
    level: 'inline', // インラインの要素
    // レキサーが候補の位置を見つけるための高速なヒント
    start: (src) => src.indexOf('=='),
    tokenize: (src, tokens, lexer) => {
      // 残りのソースの先頭にある ==text== にマッチする
      const match = /^==([^=]+)==/.exec(src)
      if (!match) return undefined

      return {
        type: 'highlight',       // トークンの種類（name と一致させる）
        raw: match[0],           // マッチした文字列全体: ==text==
        text: match[1],          // 中身: text
        // 入れ子のインライン書式は Markdown のレキサーに処理させる
        tokens: lexer.inlineTokens(match[1]),
      }
    },
  },

  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },
})
```

**実装上の補足:**
- `start` は、レキサーがマッチしそうな位置をすばやく見つけるための最適化です。
- トークナイザーは `tokens: lexer.inlineTokens(match[1])` を返すので、入れ子のインライン書式（太字、強調、リンクなど）が失われません。

---

## ステップ3: パーサーを追加する

`parseMarkdown` 関数は、トークナイザーが生成したトークンを Tiptap の表現に変換します。マークの場合は、ふつう中身のトークンをインラインノードにパースしてから、そのコンテンツにマークを適用します。

```js
import { Mark } from '@tiptap/core'

export const Highlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },

  // ==text== を見つけるカスタムの Markdown トークナイザーを定義する
  markdownTokenizer: {
    name: 'highlight',
    level: 'inline', // インラインの要素
    // レキサーが候補の位置を見つけるための高速なヒント
    start: (src) => src.indexOf('=='),
    tokenize: (src, tokens, lexer) => {
      // 残りのソースの先頭にある ==text== にマッチする
      const match = /^==([^=]+)==/.exec(src)
      if (!match) return undefined

      return {
        type: 'highlight',       // トークンの種類（name と一致させる）
        raw: match[0],           // マッチした文字列全体: ==text==
        text: match[1],          // 中身: text
        // 入れ子のインライン書式は Markdown のレキサーに処理させる
        tokens: lexer.inlineTokens(match[1]),
      }
    },
  },

  // Markdown のトークンを Tiptap JSON にパースする
  parseMarkdown: (token, helpers) => {
    // 入れ子のインライントークンを Tiptap のインラインコンテンツにパースする
    const content = helpers.parseInline(token.tokens || [])
    // パースしたコンテンツに 'highlight' マークを適用する
    return helpers.applyMark('highlight', content)
  },

  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },
})
```

**補足:**
- `helpers.parseInline` は、入れ子のインライントークンを Tiptap で扱える `content` 配列に変換します。
- `helpers.applyMark('highlight', content)` は、パースしたインラインコンテンツにマークを適用し、Markdown パーサーが期待する構造を返します。

---

## ステップ4: レンダラーを追加する

エディタの状態を Markdown にシリアライズして戻せるよう、`renderMarkdown` 関数を実装します。この関数は Tiptap のノード（またはマークのノード構造）を受け取り、Markdown 文字列を返します。入れ子のコンテンツのシリアライズには `helpers.renderChildren` を使います。

```js
import { Mark } from '@tiptap/core'

export const Highlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },

  // ==text== を見つけるカスタムの Markdown トークナイザーを定義する
  markdownTokenizer: {
    name: 'highlight',
    level: 'inline', // インラインの要素
    // レキサーが候補の位置を見つけるための高速なヒント
    start: (src) => src.indexOf('=='),
    tokenize: (src, tokens, lexer) => {
      // 残りのソースの先頭にある ==text== にマッチする
      const match = /^==([^=]+)==/.exec(src)
      if (!match) return undefined

      return {
        type: 'highlight',       // トークンの種類（name と一致させる）
        raw: match[0],           // マッチした文字列全体: ==text==
        text: match[1],          // 中身: text
        // 入れ子のインライン書式は Markdown のレキサーに処理させる
        tokens: lexer.inlineTokens(match[1]),
      }
    },
  },

  // Markdown のトークンを Tiptap JSON にパースする
  parseMarkdown: (token, helpers) => {
    // 入れ子のインライントークンを Tiptap のインラインコンテンツにパースする
    const content = helpers.parseInline(token.tokens || [])
    // パースしたコンテンツに 'highlight' マークを適用する
    return helpers.applyMark('highlight', content)
  },

  // Tiptap のノードを Markdown にレンダリングして戻す
  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [])
    // シリアライズした子を == の区切り記号で包む
    return `==${content}==`
  },

  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
    }
  },
})
```

**補足:**
- `helpers.renderChildren` は、ノードやマークの子を、入れ子の書式を保ったまま Markdown にシリアライズします。
- `renderMarkdown` の出力は、トークナイザーの想定（空白や改行）に合わせてください。このようなインラインのマークなら、単純な `==content==` の形で十分です。

---

## 使い方

拡張機能をエディタに追加し、Markdown からコンテンツを設定します。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Markdown from 'some-markdown-integration' // 使っている Markdown の組み込みに置き換える
import { Highlight } from './highlight'

const editor = new Editor({
  extensions: [StarterKit, Markdown, Highlight],
})

// Markdown のコンテンツを設定する（Markdown の組み込みが 'contentType' などのオプションに対応している必要がある）
editor.commands.setContent('This is ==highlighted== text', { contentType: 'markdown' })

// プログラムからハイライトを切り替える
editor.commands.toggleHighlight()
```

---

## テストとエッジケース

- 入れ子のインライン書式: トークナイザーは `lexer.inlineTokens(match[1])` を使っているので、入れ子のインライントークン（太字、強調、リンク）も正しくパース・レンダリングされるはずです。
- 貪欲なマッチ: トークナイザーは単純な `^==([^=]+)==` の正規表現を使っているので、中に `==` を含むコンテンツにはマッチしません。入れ子の `==` や複数行のハイライトに対応したい場合は、正規表現をそれに合わせて拡張してください。
- 空白の扱い: Markdown の方言によっては、区切り記号の内側に空白を入れられます（例: `== text ==`）。これに対応したい場合は、選んだ書式が保たれるよう、トークナイザーと `renderMarkdown` の出力を更新してください。
- 他のトークナイザーとの衝突: `start` による最適化はレキサーが候補の位置を選ぶ助けになりますが、正規表現が Markdown ツールチェーンの他のインラインのトークナイザーとぶつからないことも確かめてください。
