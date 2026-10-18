# Markdown のカスタムシリアライズ

> 原文: [https://tiptap.dev/docs/editor/markdown/advanced-usage/custom-serializing](https://tiptap.dev/docs/editor/markdown/advanced-usage/custom-serializing)

このガイドでは、Tiptap エディタで Markdown のカスタムシリアライズを実装する手順を説明します。読み終えるころには、[Tiptap JSON](../glossary#tiptap-json) を Markdown コンテンツにシリアライズできるようになります。

Tiptap JSON のコンテンツを Markdown にシリアライズするには、`markdown.render` ハンドラーを使います。

## レンダリングハンドラーの仕組み

Tiptap JSON のノードを Markdown 文字列に変換する処理は、拡張機能の設定に定義した `renderMarkdown` 関数が担います。

この関数は、単に文字列を返すだけの簡単なものから、ノードの属性、子ノード、入れ子、ノードが置かれた文脈まで考慮する複雑なものまで、さまざまに書けます。

レンダリング関数には、次のパラメーターが渡されます。

- `node`: シリアライズする Tiptap JSON のノード
- `helpers`: レンダリングを手助けするユーティリティ関数をまとめたオブジェクト（詳しくは[レンダリング用のヘルパー関数](#render-helper-functions)を参照）
- `context`: ドキュメントツリーの中でのノードの位置について、追加の情報を持つオブジェクト（詳しくは[レンダリングコンテキスト](#render-context)を参照）

レンダリング関数は、ノードに相当する Markdown を文字列で返します。この文字列が他の文字列とつなげられ、Markdown ドキュメント全体になります。

```typescript
const CustomHeading = Node.create({
  name: 'customHeading',

  // ...

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content)
    return `# ${content}\n\n`
  },
})
```

## レンダリング用のヘルパー関数

前の節で説明したとおり、`helpers` オブジェクトには、子ノードのレンダリングやコンテンツの整形に使うユーティリティ関数がそろっています。
以下、ヘルパーごとに使い方を説明します。

### `helpers.renderChildren(nodes, separator)`

`helpers.renderChildren` 関数は、Tiptap JSON のノードのリストを受け取り、各ノードをそれぞれのレンダリングハンドラーで Markdown 文字列にレンダリングします。

省略可能な `separator` パラメーターを渡すと、レンダリングした子ノードを指定した文字列でつなげます（デフォルトは `''`）。

```typescript
render: (node, helpers) => {
  // 子ノードをすべてレンダリングする
  const content = helpers.renderChildren(node.content || [])

  return `> ${content}\n\n`
}
```

区切り文字を指定する場合は次のようになります。

```typescript
render: (node, helpers) => {
  // リスト項目を改行でつなげる
  const items = helpers.renderChildren(node.content || [], '\n')

  return items + '\n\n'
}
```

### `helpers.indent(content)`

`helpers.indent(content)` 関数は、渡したコンテンツ文字列の各行にインデントを付けます。インデントの量は、現在のコンテキストの深さと、設定したインデントの形式（スペースかタブか）で決まります。

リストのような入れ子の構造をレンダリングするときなどに役立ちます。

```typescript
render: (node, helpers) => {
  const content = helpers.renderChildren(node.content || [])

  return helpers.indent(content) // 現在のコンテキストの深さに応じて、レンダリングしたコンテンツをインデントする
}
```

### `helpers.wrapInBlock(prefix, content)`

`helpers.wrapInBlock` 関数は、コンテンツの各行の先頭に接頭辞を付けて包みます。引用やコードブロックのようなブロックレベルの要素で役立ちます。

```typescript
render: (node, helpers) => {
  const content = helpers.renderChildren(node.content || [])

  // 引用にするため、各行に "> " を付ける
  return helpers.wrapInBlock('> ', content)
}
```

## マークをシリアライズする

マークは扱い方が異なります。インラインのコンテンツを包むもので、ノードの中のテキストに適用する必要があるからです。

マークをレンダリングするときは、ふつう先にノードの子をレンダリングし、そのコンテンツをマークに対応する Markdown 記法で包みます。

```typescript
const Bold = Mark.create({
  name: 'bold',

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node) // ノードを直接レンダリングする
    return `**${content}**` // マークアップの記法を付けて返す
  },
})
```

### 属性を持つマーク

```typescript
const Link = Mark.create({
  name: 'link',

  // ...

  parseMarkdown: (token, helpers) => {
    const content = helpers.parseInline(token.tokens || [])

    // 第3引数を使うと、マークに属性を設定できる
    return helpers.applyMark('link', content, {
      href: token.href,
      title: token.title || null,
    })
  },

  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node)
    const href = node.attrs?.href || ''
    const title = node.attrs?.title

    if (title) {
      return `[${content}](${href} "${title}")`
    }
    return `[${content}](${href})`
  },
})
```

## レンダリングコンテキスト

レンダリングハンドラーの第3引数はコンテキストオブジェクトです。ドキュメントツリーの中での現在のノードの位置に関する情報（インデックス、深さ、親の種類、独自のメタデータなど）を持っています。

```typescript
renderMarkdown: (node, helpers, context) => {
  const lines = []

  lines.push(`I am the ${context.index}th child in my parent context.`) // 親の中でのこのノードのインデックス（0 始まり）
  lines.push(`My current nesting level is ${context.level}`) // 現在の入れ子の深さ（`indenting: true` の親ごとに 1 増える）
  lines.push(`My parent node type is ${context.parentType}`) // 親ノードの種類
  lines.push(`My custom metadata is ${JSON.stringify(context.meta)}`) // 親ノードが設定できる独自のメタデータ

  return lines.join('\n')
}
```

## インデント付きでレンダリングする

`isIndenting` フラグは、そのノードで入れ子が1段深くなることを MarkdownManager に伝えます。

```typescript
const CustomNode = Node.create({
  name: 'customNode',

  // ...

  markdownOptions: {
    indentsContent: true,
  },

  renderMarkdown: (node, helpers, context) => {
    // helpers.indent() を使うと、子は context.level + 1 の深さでレンダリングされる
    const content = helpers.renderChildren(node.content || [])
    return content
  },
})
```

入れ子のリストやコードブロックを正しくインデントするために欠かせない設定です。

### 独自のインデント処理

インデントの処理を自分で実装することもできます。

```typescript
render: (node, helpers, context) => {
  const content = helpers.renderChildren(node.content || [])

  // 深さに応じて独自のインデントを付ける
  const indent = '  '.repeat(context.level)
  const lines = content.split('\n')
  const indented = lines.map(line => indent + line).join('\n')

  return indented
}
```

## シリアライズをデバッグする

シリアライズする前の JSON の構造をログに出力します。

```typescript
const json = editor.getJSON()
console.log(JSON.stringify(json, null, 2))

const markdown = editor.markdown.serialize(json)
console.log(markdown)
```

### シリアライズを単独でデバッグする

```typescript
const node = {
  type: 'heading',
  attrs: { level: 1 },
  content: [{ type: 'text', text: 'Hello' }],
}

const renderHelpers = {
  renderChildren: nodes => 'Hello',
  // ... その他のヘルパー
}

const markdown = myExtension.options.markdown.render(node, renderHelpers, {})
console.log(markdown)
```

## パフォーマンスへの配慮

### シリアライズ結果のキャッシュ

Markdown へのシリアライズ結果をキャッシュします。

```typescript
let markdownCache = null
let lastJSON = null

editor.on('update', () => {
  markdownCache = null // キャッシュを無効にする
})

function getMarkdown() {
  const currentJSON = editor.getJSON()

  if (markdownCache && JSON.stringify(lastJSON) === JSON.stringify(currentJSON)) {
    return markdownCache
  }

  lastJSON = currentJSON
  markdownCache = editor.getMarkdown()
  return markdownCache
}
```

## 例

### 見出し用のカスタムレンダラー

```typescript
const CustomHeading = Node.create({
  name: 'customHeading',

  renderMarkdown: (node, helpers, context) => {
    const level = node.attrs?.level || 1 // ノードの属性から見出しのレベルを取得する
    const prefix = '#'.repeat(level) // レベルに応じた接頭辞を作る
    const content = helpers.renderChildren(node.content || []) // 見出しのインラインコンテンツをレンダリングする

    return `${prefix} ${content}\n\n` // ここまでの情報から Markdown 文字列を組み立てる
  },
})
```

### YouTube 埋め込み用のレンダラー

ここでは、`youtubeEmbed` ノードを、独自の YouTube 用トークナイザーでパースできる Markdown 文字列にシリアライズして戻します。

この例の記法は `![youtube](videoId?start=60&width=800&height=450)` です。

```typescript
const YouTubeEmbed = Node.create({
  name: 'youtubeEmbed',

  renderMarkdown: (node, helpers) => {
    // ノードから属性を取り出す
    const videoId = node.attrs?.videoId || ''
    const start = node.attrs?.start || 0
    const width = node.attrs?.width || 800
    const height = node.attrs?.height || 450

    // 属性をそのまま Markdown 文字列に入れる
    return `![youtube](${videoId}?start=${start}&width=${width}&height=${height})\n\n`
  },
})
```

### リスト項目をインデント付きでレンダリングする

この例では、リスト項目を含む独自のリストノードをレンダリングします。各リスト項目の記法は `=> item` の形にします。

```typescript
const CustomList = Node.create({
  name: 'customList',

  // ...

  markdownOptions: {
    indentsContent: true,
  },

  renderMarkdown: (node, helpers, context) => {
    // 独自の区切り文字を使って、リスト項目を改行でつなげる
    const items = helpers.renderChildren(node.content || [], '\n')

    return items
  },
})

const CustomListItem = Node.create({
  name: 'customListItem',

  // ...

  renderMarkdown: (node, helpers, context) => {
    // まず、リスト項目の最初の子（段落ノード）をコンテンツとして取り出し、
    // 残りの子はあとで手動でレンダリングするために取っておく
    const [content, ...children] = node.content
    const output = [`=> ${content}`]

    // ひとまず直下の子のコンテンツをレンダリングする
    const mainContent = helpers.renderChildren(node.content || [])

    // 続いて残りの子をたどり、こちらもインデントしてレンダリングする
    if (children && children.length > 0) {
      children.forEach((child) => {
        const childContent = helpers.renderChildren([child]) // 子ノードをレンダリングする（その子孫も再帰的にレンダリングされる）
        if (childContent) {
          // 子のコンテンツを行に分け、各行をインデントする
          const indentedChild = childContent
            .split('\n')
            .map((line) => (line ? helpers.indent(line) : ''))
            .join('\n')
          output.push(indentedChild) // この深さに合ったインデントで子を追加する
        }
      })
    }

    return output.join('\n') // すべての行を改行でつなげる
  },
})
```

これではかなり冗長なので、Tiptap は `@tiptap/markdown` パッケージから `renderNestedMarkdownContent()` ヘルパーをエクスポートしています。これを使うと次のように簡潔に書けます。

```typescript
import { Node } from '@tiptap/core'
import { renderNestedMarkdownContent } from '@tiptap/markdown'

const CustomListItem = Node.create({
  name: 'customListItem',

  // ...

  renderMarkdown: (node, helpers, context) => {
    return renderNestedMarkdownContent(node, helpers, '=> ', context)
  },
})
```

詳しくは[ユーティリティ](../api/utilities#rendernestedmarkdowncontent)のページを参照してください。
