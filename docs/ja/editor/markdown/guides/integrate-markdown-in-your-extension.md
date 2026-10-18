# 独自の拡張機能を Markdown に対応させる

> 原文: [https://tiptap.dev/docs/editor/markdown/guides/integrate-markdown-in-your-extension](https://tiptap.dev/docs/editor/markdown/guides/integrate-markdown-in-your-extension)

このガイドでは、Tiptap の拡張機能を Markdown に対応させる方法を説明します。

> **ヒント**: Pandoc のブロック（`:::name`）やショートコード（`[name]`）のような標準的なパターンなら、[ユーティリティ関数](../api/utilities)を使うと、少ないコードで Markdown の仕様を生成できます。

## 拡張機能への基本の組み込み

拡張機能を Markdown に対応させるには、拡張機能の設定に Markdown 用の設定を書きます。

```typescript
import { Node } from '@tiptap/core'

const MyNode = Node.create({
  name: 'myNode',

  // ... その他の設定（parseHTML、renderHTML など）

  parseMarkdown: (token, helpers) => {
    /* ... */
  },

  renderMarkdown: (node, helpers) => {
    /* ... */
  },
})
```

## Markdown の設定の詳細

拡張機能の仕様では、次のオプションを指定できます。

- `markdownTokenName` - 扱うトークンの名前。トークン名が拡張機能の名前と違う場合は必須です。
- `parseMarkdown` - トークンを Tiptap JSON に変換する関数
- `renderMarkdown` - Tiptap JSON を Markdown 文字列に変換する関数
- `markdownTokenizer` - 新しい Markdown 記法を見つけるためのカスタムトークナイザー
- `markdownOptions` - トークナイザーを設定するオプションの集まり
  - `indentsContent` - このノードで、入れ子のコンテンツ（リストなど）のインデントを1段深くするかどうか

### `markdownTokenName` を使う

```typescript
markdownTokenName: 'strong' // Markdown のトークン名が "strong" である Bold マーク拡張機能の場合
```

## ノードの拡張機能

ノードを Markdown に対応させるのは簡単です。よく使うパターンを紹介します。

想定するコンテンツの種類によって、`parseMarkdown` と `renderMarkdown` のメソッドで使うヘルパー関数が変わります。

- ブロックレベルのコンテンツを持つノードなら、`helpers.parseChildren` と `helpers.renderChildren` を使います。
- ブロックレベルのコンテンツを持つノードで、空行を空の段落として往復変換させたい場合は、`helpers.parseBlockChildren` を使います。暗黙の空の段落が失われません。
- インラインレベルのコンテンツを持つノードなら、`helpers.parseInline` と `helpers.renderChildren` を使います。

```typescript
import { Node } from '@tiptap/core'

const Heading = Node.create({
  name: 'heading',

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML() {
    return ['p', 0]
  },

  parseMarkdown: (token, helpers) => {
    const level = token.depth || 1

    const content = helpers.parseInline(token.tokens || []) // 見出しはインラインのコンテンツを持つので、ここではインラインとしてパースする
    return {
      type: 'heading',
      attrs: { level },
      content,
    }
  },

  renderMarkdown: (node, helpers) => {
    const level = node.attrs?.level || 1
    const prefix = '#'.repeat(level)

    const content = helpers.renderChildren(node.content || [])
    return `${prefix} ${content}`
  },
})
```

## マークの拡張機能

マークはインラインのコンテンツを包むものなので、扱い方が異なります。マークの拡張機能を Markdown に対応させるには、`applyMark` と `renderChildren` のヘルパー関数を使います。

```typescript
import { Mark } from '@tiptap/core'

const Bold = Mark.create({
  name: 'bold',

  parseHTML() {
    return [{ tag: 'strong' }, { tag: 'b' }]
  },

  renderHTML() {
    return ['strong', 0]
  },

  markdownTokenName: 'strong',

  parseMarkdown: (token, helpers) => {
    // コンテンツをパースし、bold マークを適用する
    const content = helpers.parseInline(token.tokens || [])
    return helpers.applyMark('bold', content)
  },

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [])
    return `**${content}**`
  },
})
```

マークに属性を付けたい場合は、`applyMark` ヘルパーに属性のオブジェクトを渡します。

```typescript
const content = helpers.applyMark('link', helpers.parseInline(token.tokens || []), {
  href: token.href || '',
  title: token.title || null,
})
```

## 拡張機能をテストする

### パースハンドラーの単体テスト

```typescript
import { describe, it, expect } from 'vitest'

describe('Heading Markdown', () => {
  it('should parse heading tokens', () => {
    const token = {
      type: 'heading',
      depth: 2,
      tokens: [{ type: 'text', text: 'Hello' }],
    }

    const helpers = {
      parseInline: tokens => [{ type: 'text', text: 'Hello' }],
    }

    const result = Heading.configuration.parseMarkdown(token, helpers)

    expect(result).toEqual({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Hello' }],
    })
  })
})
```

### レンダリングハンドラーの単体テスト

```typescript
import { describe, it, expect } from 'vitest'

describe('Heading Markdown', () => {
  it('should render heading nodes', () => {
    const node = {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Hello' }],
    }

    const helpers = {
      renderChildren: () => 'Hello',
    }

    const result = Heading.configuration.renderMarkdown(node, helpers, {})

    expect(result).toBe('## Hello\n\n')
  })
})
```

### 結合テスト

```typescript
import { describe, it, expect } from 'vitest'

import { Editor } from '@tiptap/core'
import { Markdown } from '@tiptap/markdown'
import MyExtension from './MyExtension'

describe('MyExtension integration', () => {
  it('should parse and serialize correctly', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, MyExtension, Markdown],
    })

    const markdown = '# Hello World'
    editor.commands.setContent(markdown, { contentType: 'markdown' })

    const json = editor.getJSON()
    expect(json.content[0].type).toBe('heading')

    const result = editor.getMarkdown()
    expect(result).toBe('# Hello World\n\n')

    editor.destroy()
  })
})
```

## よく使うパターン

### ブロックコンテンツの中の空の段落を残す

ノードが他のブロックノードを含み、連続する空の段落を Markdown の往復変換のあとも残したい場合は、`parseChildren()` より `parseBlockChildren()` を使ってください。

```typescript
parseMarkdown: (token, helpers) => {
  return helpers.createNode('myContainer', undefined, helpers.parseBlockChildren(token.tokens || []))
}
```

連続する空の段落のうち、最初のものは Markdown の通常の空行として、同じ並びの2つ目以降は `&nbsp;` の目印として残ります。

### レンダリング時に直前の兄弟ノードの情報を使う

`renderMarkdown()` が受け取る `context` オブジェクトには `previousNode` があります。これを使えば、親ノードの名前を決め打ちしなくても、兄弟ノードに応じてレンダリングを変えられます。

```typescript
renderMarkdown: (node, helpers, context) => {
  const previousNode = context.previousNode
  const previousWasEmptyParagraph =
    previousNode?.type === 'paragraph' && (!previousNode.content || previousNode.content.length === 0)

  if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) {
    return previousWasEmptyParagraph ? '&nbsp;' : ''
  }

  return helpers.renderChildren(node.content || [])
}
```

このパターンは、ドキュメントの最上位でも、引用やリスト項目のような入れ子のコンテナの中でも同じように使えます。

### 省略可能なトークンのプロパティを扱う

```typescript
parse: (token, helpers) => {
  return {
    type: 'myNode',
    attrs: {
      level: token.depth || 1, // ない場合のデフォルト
      id: token.id ?? null, // Null 合体演算子
      text: token.text?.trim() || '', // オプショナルチェーン
    },
    content: helpers.parseInline(token.tokens || []),
  }
}
```

### 条件に応じたパース

```typescript
parse: (token, helpers) => {
  // 特定の種類だけを扱う
  if (token.ordered) {
    return null // 別のハンドラーに処理させる
  }

  // あるいは、トークンのプロパティに応じて処理を変える
  if (token.depth > 6) {
    // 代わりに段落として扱う
    return {
      type: 'paragraph',
      content: helpers.parseInline(token.tokens || []),
    }
  }

  return {
    type: 'heading',
    attrs: { level: token.depth },
    content: helpers.parseInline(token.tokens || []),
  }
}
```

### コンテキストに応じたレンダリング

```typescript
render: (node, helpers, context) => {
  const content = helpers.renderChildren(node.content || [])

  // コンテキストに応じてレンダリングを変える
  if (context.level > 0) {
    // 入れ子の場合はインデントを足す
    return helpers.indent(`- ${content}`) + '\n'
  }

  // 最上位の場合
  return `- ${content}\n`
}
```
