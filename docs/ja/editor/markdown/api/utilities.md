# Markdown のユーティリティ

> 原文: [https://tiptap.dev/docs/editor/markdown/api/utilities](https://tiptap.dev/docs/editor/markdown/api/utilities)

## ブロック用のユーティリティ

### `createBlockMarkdownSpec`

ブロックレベルのノード用に、Pandoc 形式の記法（`:::blockName`）を使った Markdown の仕様一式を作ります。

このユーティリティは `@tiptap/core` からインポートできます。

#### 記法

```markdown
:::blockName {attributes}

Content goes here
Can be **multiple** paragraphs

:::
```

#### 使い方

```typescript
import { Node } from '@tiptap/core'
import { createBlockMarkdownSpec } from '@tiptap/core'

const Callout = Node.create({
  name: 'callout',

  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: { default: 'info' },
      title: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },

  renderHTML({ node }) {
    return ['div', { 'data-callout': node.attrs.type }, 0]
  },

  // ユーティリティで Markdown 対応のコードを生成する
  ...createBlockMarkdownSpec({
    nodeName: 'callout',
    defaultAttributes: { type: 'info' },
    allowedAttributes: ['type', 'title'],
    content: 'block', // 入れ子のブロックコンテンツを許可する
  }),
})
```

#### オプション

| オプション | 型 | デフォルト | 説明 |
| --------------------- | --------------------- | ---------- | -------------------------- |
| `nodeName`            | `string`              | _必須_ | Tiptap のノード名           |
| `name`                | `string`              | `nodeName` | Markdown 記法での名前       |
| `content`             | `'block' \| 'inline'` | `'block'`  | コンテンツの種類 |
| `defaultAttributes`   | `Object`              | `{}`       | パース時のデフォルトの属性 |
| `allowedAttributes`   | `string[]`            | すべて | レンダリングを許可する属性の一覧 |
| `getContent`          | `(token) => string`   | 自動 | コンテンツを取り出す独自の処理 |
| `parseAttributes`     | `(str) => Object`     | 自動 | 属性の独自のパーサー |
| `serializeAttributes` | `(attrs) => string`   | 自動 | 独自のシリアライザー |

#### Markdown の例

```markdown
:::callout {type="warning" title="Important"}

This is a warning callout with a title.

It can contain multiple paragraphs and **formatting**.

:::

:::note

Simple note without attributes.

:::
```

---

### `createAtomBlockMarkdownSpec`

アトミックな（自己終了型の）ブロックノード用に、Pandoc の記法を使った Markdown の仕様を作ります。

このユーティリティは `@tiptap/core` からインポートできます。

#### 記法

```markdown
:::nodeName {attributes} :::
```

終了タグもコンテンツもありません。埋め込み、画像、水平線などに最適です。

#### 使い方

```typescript
import { Node } from '@tiptap/core'
import { createAtomBlockMarkdownSpec } from '@tiptap/core'

const Youtube = Node.create({
  name: 'youtube',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      start: { default: 0 },
      width: { default: 640 },
      height: { default: 480 },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
        getAttrs: dom => ({
          src: dom.getAttribute('src'),
        }),
      },
    ]
  },

  renderHTML({ node }) {
    return ['iframe', { src: node.attrs.src }, 0]
  },

  // アトミックなブロックの Markdown にユーティリティを使う
  ...createAtomBlockMarkdownSpec({
    nodeName: 'youtube',
    requiredAttributes: ['src'], // src 属性が必須
    defaultAttributes: { start: 0 },
    allowedAttributes: ['src', 'start', 'width', 'height'],
  }),
})
```

#### オプション

| オプション | 型 | デフォルト | 説明 |
| --------------------- | ------------------- | ---------- | ------------------------------ |
| `nodeName`            | `string`            | _必須_ | Tiptap のノード名               |
| `name`                | `string`            | `nodeName` | Markdown 記法での名前           |
| `requiredAttributes`  | `string[]`          | `[]`       | パースに必須の属性 |
| `defaultAttributes`   | `Object`            | `{}`       | パース時のデフォルトの属性     |
| `allowedAttributes`   | `string[]`          | すべて | レンダリングを許可する属性の一覧     |
| `parseAttributes`     | `(str) => Object`   | 自動 | 属性の独自のパーサー     |
| `serializeAttributes` | `(attrs) => string` | 自動 | 独自のシリアライザー     |

#### Markdown の例

```markdown
:::youtube {src="https://youtube.com/watch?v=dQw4w9WgXcQ" start="30"}

:::image {src="photo.jpg" alt="A beautiful photo" width="800"}

:::hr
```

---

## インライン用のユーティリティ

### `createInlineMarkdownSpec`

インラインノード用に、ショートコード記法（`[nodeName]`）を使った Markdown の仕様を作ります。

このユーティリティは `@tiptap/core` からインポートできます。

#### 記法

```markdown
<!-- Self-closing -->

[nodeName attribute="value" other="data"]

<!-- With content -->

[nodeName attribute="value"]content[/nodeName]
```

#### 使い方（自己終了型）

```typescript
import { Node } from '@tiptap/core'
import { createInlineMarkdownSpec } from '@tiptap/core'

const Mention = Node.create({
  name: 'mention',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-mention]' }]
  },

  renderHTML({ node }) {
    return ['span', { 'data-mention': node.attrs.id }, `@${node.attrs.label}`]
  },

  // 自己終了型のインライン Markdown にユーティリティを使う
 ...createInlineMarkdownSpec({
    nodeName: 'mention',
    selfClosing: true,
    allowedAttributes: ['id', 'label'],
  }),
})
```

#### 使い方（コンテンツあり）

```typescript
const Highlight = Node.create({
  name: 'highlight',

  group: 'inline',
  content: 'inline*',

  addAttributes() {
    return {
      color: { default: 'yellow' },
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ node }) {
    return ['mark', { 'data-color': node.attrs.color }, 0]
  },

  // コンテンツを持つインライン Markdown にユーティリティを使う
  ...createInlineMarkdownSpec({
    nodeName: 'highlight',
    selfClosing: false, // コンテンツを持つ
    allowedAttributes: ['color'],
  }),
})
```

#### オプション

| オプション | 型 | デフォルト | 説明 |
| --------------------- | ------------------- | ---------- | -------------------------- |
| `nodeName`            | `string`            | _必須_ | Tiptap のノード名           |
| `name`                | `string`            | `nodeName` | ショートコードの名前 |
| `selfClosing`         | `boolean`           | `false`    | コンテンツを持たない |
| `defaultAttributes`   | `Object`            | `{}`       | パース時のデフォルトの属性 |
| `allowedAttributes`   | `string[]`          | すべて | レンダリングを許可する属性の一覧 |
| `getContent`          | `(node) => string`  | 自動 | コンテンツを取り出す独自の処理 |
| `parseAttributes`     | `(str) => Object`   | 自動 | 属性の独自のパーサー |
| `serializeAttributes` | `(attrs) => string` | 自動 | 独自のシリアライザー |

#### Markdown の例

```markdown
<!-- Mentions -->

Hey [mention id="user123" label="John"]!

<!-- Emoji -->

Party time [emoji name="party_popper"]!

<!-- Highlight with content -->

This is [highlight color="yellow"]important text[/highlight] to read.
```

---

## パース用のヘルパー

拡張機能のパースハンドラーに渡されるヘルパーです。

### `parseInline(tokens)`

インラインのトークン（太字、斜体、リンクなど）をパースします。

```typescript
helpers.parseInline(tokens: MarkdownToken[]): JSONContent[]
```

**パラメーター:**

- `tokens`: インラインの Markdown トークンの配列

**戻り値:**

- `JSONContent[]` - Tiptap JSON のノードの配列

**例:**

```typescript
parse: (token, helpers) => {
  return {
    type: 'paragraph',
    content: helpers.parseInline(token.tokens || []),
  }
}
```

---

### `parseChildren(tokens)`

ブロックレベルの子トークンをパースします。

```typescript
helpers.parseChildren(tokens: MarkdownToken[]): JSONContent[]
```

**パラメーター:**

- `tokens`: ブロックレベルの Markdown トークンの配列

**戻り値:**

- `JSONContent[]` - Tiptap JSON のノードの配列

**例:**

```typescript
parse: (token, helpers) => {
  return {
    type: 'blockquote',
    content: helpers.parseChildren(token.tokens || []),
  }
}
```

---

### `createTextNode(text, marks)`

テキストノードを作ります。マークも付けられます。

```typescript
helpers.createTextNode(
  text: string,
  marks?: Array<{ type: string; attrs?: any }>
): JSONContent
```

**パラメーター:**

- `text`: テキストの内容
- `marks`: 適用するマークの配列（省略可）

**戻り値:**

- `JSONContent` - テキストノード

**例:**

```typescript
parse: (token, helpers) => {
  return helpers.createTextNode('Hello', [{ type: 'bold' }, { type: 'italic' }])
}
```

---

### `createNode(type, attrs, content)`

種類、属性、コンテンツを指定してノードを作ります。

```typescript
helpers.createNode(
  type: string,
  attrs?: Record<string, any>,
  content?: JSONContent[]
): JSONContent
```

**パラメーター:**

- `type`: ノードの種類名
- `attrs`: ノードの属性（省略可）
- `content`: ノードのコンテンツ（省略可）

**戻り値:**

- `JSONContent` - 作成したノード

**例:**

```typescript
parse: (token, helpers) => {
  return helpers.createNode('heading', { level: 2 }, [helpers.createTextNode('Title')])
}
```

---

### `applyMark(markType, content, attrs)`

コンテンツにマークを適用します（インラインの書式用）。

```typescript
helpers.applyMark(
  markType: string,
  content: JSONContent[],
  attrs?: Record<string, any>
): MarkdownParseResult
```

**パラメーター:**

- `markType`: マークの種類名
- `content`: マークを適用するコンテンツ
- `attrs`: マークの属性（省略可）

**戻り値:**

- `MarkdownParseResult` - マークの結果オブジェクト

**例:**

```typescript
parse: (token, helpers) => {
  const content = helpers.parseInline(token.tokens || [])
  return helpers.applyMark('bold', content)
}
```

---

## レンダリング用のヘルパー

拡張機能のレンダリングハンドラーに渡されるヘルパーです。

### `renderChildren(nodes, separator)`

子ノードを Markdown にレンダリングします。

```typescript
helpers.renderChildren(
  nodes: JSONContent | JSONContent[],
  separator?: string
): string
```

**パラメーター:**

- `nodes`: レンダリングするノード、またはノードの配列
- `separator`: ノードの間に入れる区切り文字（省略可。デフォルト: `''`）

**戻り値:**

- `string` - レンダリングした Markdown

**例:**

```typescript
render: (node, helpers) => {
  const content = helpers.renderChildren(node.content || [])
  return `> ${content}\n\n`
}
```

---

### `indent(content)`

コンテンツにインデントを付けます。

```typescript
helpers.indent(content: string): string
```

**パラメーター:**

- `content`: インデントするコンテンツ

**戻り値:**

- `string` - インデントしたコンテンツ

**例:**

```typescript
render: (node, helpers) => {
  const content = helpers.renderChildren(node.content || [])
  return helpers.indent(content)
}
```

---

### `wrapInBlock(prefix, content)`

コンテンツの各行に接頭辞を付けて包みます。

```typescript
helpers.wrapInBlock(
  prefix: string,
  content: string
): string
```

**パラメーター:**

- `prefix`: 各行に付ける接頭辞
- `content`: 包むコンテンツ

**戻り値:**

- `string` - 包んだコンテンツ

**例:**

```typescript
render: (node, helpers) => {
  const content = helpers.renderChildren(node.content || [])
  return helpers.wrapInBlock('> ', content) + '\n\n'
}
```

---

## その他のユーティリティ

### `parseAttributes`

`parseAttributes` ユーティリティは、主に内部で、Pandoc 形式の文字列から属性オブジェクトを組み立てるのに使われます。Pandoc の属性形式に似た独自の記法を作りたい場合を除けば、使うことはまずないでしょう。

このユーティリティは `@tiptap/core` からインポートできます。

#### 対応している形式

```typescript
import { parseAttributes } from '@tiptap/core'

// クラス（先頭に . を付ける）
parseAttributes('.btn .primary')
// → { class: 'btn primary' }

// ID（先頭に # を付ける）
parseAttributes('#submit')
// → { id: 'submit' }

// キーと値の組（値は引用符で囲む）
parseAttributes('type="button" disabled')
// → { type: 'button', disabled: true }

// 組み合わせ
parseAttributes('.btn #submit type="button" disabled')
// → { class: 'btn', id: 'submit', type: 'button', disabled: true }

// 複雑な例
parseAttributes('.card .elevated #main-card title="My Card" data-id="123" visible')
// → {
//   class: 'card elevated',
//   id: 'main-card',
//   title: 'My Card',
//   'data-id': '123',
//   visible: true
// }
```

#### 使い方

```typescript
import { parseAttributes } from '@tiptap/core'

const attrString = '.highlight #section-1 color="yellow" bold'
const attrs = parseAttributes(attrString)

console.log(attrs)
// {
//   class: 'highlight',
//   id: 'section-1',
//   color: 'yellow',
//   bold: true
// }
```

---

### `serializeAttributes`

`serializeAttributes` ユーティリティは、主に内部で、属性オブジェクトを Pandoc 形式の文字列に戻すのに使われます。Pandoc の属性形式に似た独自の記法を作りたい場合を除けば、使うことはまずないでしょう。

このユーティリティは `@tiptap/core` からインポートできます。

#### 使い方

```typescript
import { serializeAttributes } from '@tiptap/core'

const attrs = {
  class: 'btn primary',
  id: 'submit',
  type: 'button',
  disabled: true,
  'data-value': '123',
}

const attrString = serializeAttributes(attrs)
console.log(attrString)
// .btn.primary #submit disabled type="button" data-value="123"
```

#### ルール

- クラスは先頭に `.` を付け、スペースで区切る
- ID は先頭に `#` を付ける
- 真偽値の `true` は、値なしの属性になる
- 文字列の値は `"` で囲む
- null や undefined の値は省く

---

### `parseIndentedBlocks`

インデントで階層を表すブロック（リスト、タスクリストなど）をパースするための、上級者向けのユーティリティです。

このユーティリティは `@tiptap/core` からインポートできます。

#### 使いどころ

次のような Markdown をパースしたいときに使います。

- インデントで入れ子になった項目
- （平坦でない）階層構造
- 独自のブロックのパターン

#### 使用例: タスクリスト

```typescript
import { parseIndentedBlocks } from '@tiptap/core'

const src = `
- [ ] Task 1
  - [x] Subtask 1.1
  - [ ] Subtask 1.2
- [x] Task 2
`

const result = parseIndentedBlocks(
  src,
  {
    // タスク項目にマッチするパターン
    itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,

    // マッチした行からデータを取り出す
    extractItemData: match => ({
      indentLevel: match[1].length,
      mainContent: match[4],
      checked: match[3].toLowerCase() === 'x',
    }),

    // 最終的なトークンを作る
    createToken: (data, nestedTokens) => ({
      type: 'taskItem',
      checked: data.checked,
      text: data.mainContent,
      nestedTokens, // 入れ子の項目
    }),
  },
  lexer,
)

console.log(result)
// {
//   items: [
//     {
//       type: 'taskItem',
//       checked: false,
//       text: 'Task 1',
//       nestedTokens: [
//         { type: 'taskItem', checked: true, text: 'Subtask 1.1' },
//         { type: 'taskItem', checked: false, text: 'Subtask 1.2' }
//       ]
//     },
//     {
//       type: 'taskItem',
//       checked: true,
//       text: 'Task 2'
//     }
//   ]
// }
```

#### オプション

```typescript
interface BlockParserConfig {
  itemPattern: RegExp // 項目にマッチするパターン
  extractItemData: (match) => {
    mainContent: string
    indentLevel: number
    [key: string]: any
  }
  createToken: (data, nestedTokens?) => ParsedBlock
  baseIndentSize?: number // 基本のインデント（デフォルト: 2）
  customNestedParser?: (src) => any[] // 入れ子用の独自のパーサー
}
```

---

### `renderNestedMarkdownContent`

入れ子のコンテンツを持つノードを、子要素を正しくインデントしてレンダリングするためのユーティリティです。

このユーティリティは `@tiptap/core` からインポートできます。

#### 使いどころ

次のものをレンダリングするときに使います。

- 入れ子のコンテンツを持つリスト項目
- 入れ子の要素を持つ引用
- サブタスクを持つタスク項目
- 接頭辞と入れ子の子を持つ、あらゆるノード

#### 使用例: リスト項目

```typescript
import { renderNestedMarkdownContent } from '@tiptap/core'

const ListItem = Node.create({
  name: 'listItem',

  renderMarkdown: (node, h) => {
    // 固定の接頭辞
    return renderNestedMarkdownContent(node, h, '- ')
  },
})
```

#### 使用例: タスク項目

```typescript
const TaskItem = Node.create({
  name: 'taskItem',

  renderMarkdown: (node, h) => {
    // チェック状態に応じて変わる接頭辞
    const prefix = `- [${node.attrs?.checked ? 'x' : ' '}] `
    return renderNestedMarkdownContent(node, h, prefix)
  },
})
```

#### 使用例: コンテキストに応じた接頭辞

```typescript
const ListItem = Node.create({
  name: 'listItem',

  renderMarkdown: (node, h, ctx) => {
    // 親の種類に応じて接頭辞を変える
    return renderNestedMarkdownContent(
      node,
      h,
      ctx => {
        if (ctx.parentType === 'orderedList') {
          return `${ctx.index + 1}. `
        }
        return '- '
      },
      ctx,
    )
  },
})
```

#### シグネチャ

```typescript
function renderNestedMarkdownContent(
  node: JSONContent,
  helpers: {
    renderChildren: (nodes: JSONContent[]) => string
    indent: (text: string) => string
  },
  prefixOrGenerator: string | ((ctx: any) => string),
  ctx?: any,
): string
```

---

## 完全な例

### 例1: コールアウトブロック

```typescript
import { Node } from '@tiptap/core'
import { createBlockMarkdownSpec } from '@tiptap/core'

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: { default: 'info' },
      title: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-callout': '',
        'data-type': node.attrs.type,
        'data-title': node.attrs.title,
      },
      0,
    ]
  },

  ...createBlockMarkdownSpec({
    nodeName: 'callout',
    defaultAttributes: { type: 'info' },
    allowedAttributes: ['type', 'title'],
  }),
})
```

**Markdown:**

```markdown
:::callout {type="warning" title="Watch out!"}
This is important information that needs attention.
:::
```

---

### 例2: YouTube の埋め込み

```typescript
import { Node } from '@tiptap/core'
import { createAtomBlockMarkdownSpec } from '@tiptap/core'

export const Youtube = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      start: { default: 0 },
    }
  },

  parseHTML() {
    return [{ tag: 'iframe[src*="youtube.com"]' }]
  },

  renderHTML({ node }) {
    return ['iframe', { src: node.attrs.src }]
  },

  ...createAtomBlockMarkdownSpec({
    nodeName: 'youtube',
    requiredAttributes: ['src'],
    allowedAttributes: ['src', 'start'],
  }),
})
```

**Markdown:**

```markdown
:::youtube {src="https://youtube.com/watch?v=dQw4w9WgXcQ" start="30"}
```

---

### 例3: メンション（インライン）

```typescript
import { Node } from '@tiptap/core'
import { createInlineMarkdownSpec } from '@tiptap/core'

export const Mention = Node.create({
  name: 'mention',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-mention]' }]
  },

  renderHTML({ node }) {
    return ['span', { 'data-mention': node.attrs.id }, `@${node.attrs.label}`]
  },

  ...createInlineMarkdownSpec({
    nodeName: 'mention',
    selfClosing: true,
    allowedAttributes: ['id', 'label'],
  }),
})
```

**Markdown:**

```markdown
Hey [mention id="user123" label="John"], check this out!
```

## どれを使うべきか

### ユーティリティを使う場面

- ✅ 標準的な Markdown の慣習（Pandoc、ショートコード）に従う
- ✅ 標準の属性のパースで足りる
- ✅ ブロックかインラインかがはっきりしている
- ✅ 手早く実装したい
- ✅ 拡張機能どうしで一貫性を保ちたい

### 独自に実装する場面

- ✅ 標準外の Markdown 記法が必要
- ✅ 複雑なパース処理が必要
- ✅ トークンを細かく制御したい
- ✅ 独自の属性の形式を使う

---

## 関連ドキュメント

- [カスタムトークナイザー](../advanced-usage/custom-tokenizer) - 慣習に従わない独自の記法を作る場合
- [拡張機能への組み込み](../guides/integrate-markdown-in-your-extension) - 拡張機能を Markdown に対応させるための全般的なガイド
- [高度なカスタマイズ](https://tiptap.dev/docs/editor/markdown/advanced-usage) - 独自のパースハンドラーとレンダリングハンドラー
- [API リファレンス](../) - API ドキュメントの全体

---

**ヒント**: 標準的なパターンにはまずユーティリティを使いましょう。ユーティリティでは実現できない特定の動作が必要になったときだけ、独自の実装に切り替えます。
