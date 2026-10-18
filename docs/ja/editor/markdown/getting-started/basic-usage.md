# 基本的な使い方

> 原文: [https://tiptap.dev/docs/editor/markdown/getting-started/basic-usage](https://tiptap.dev/docs/editor/markdown/getting-started/basic-usage)

このガイドでは、Markdown を扱うための基本操作を説明します。Markdown をパースしてエディタに読み込む操作と、エディタのコンテンツを Markdown にシリアライズして戻す操作です。

## エディタから Markdown を取得する

`getMarkdown()` を使うと、エディタのコンテンツを Markdown にシリアライズできます。

```typescript
const markdown = editor.getMarkdown()
console.log(markdown)
// # Hello
//
// This is a **test**.
```

[デモを開く](https://embed.tiptap.dev/preview/Markdown/Serialize)

## Markdown からコンテンツを設定する

コンテンツを扱うコマンドは、どれも `contentType` オプションに対応しています。

```typescript
// 1. 初期コンテンツ
const editor = new Editor({
  extensions: [StarterKit, Markdown],
  content: '# Hello World\n\nThis is **markdown**!',
  contentType: 'markdown',
})

// 2. コンテンツ全体を置き換える
editor.commands.setContent('# New Content', { contentType: 'markdown' })

// 3. カーソル位置に挿入する
editor.commands.insertContent('**Bold** text', { contentType: 'markdown' })

// 4. 指定した位置に挿入する
editor.commands.insertContentAt(10, '## Heading', { contentType: 'markdown' })

// 5. 範囲を置き換える
editor.commands.insertContentAt({ from: 10, to: 20 }, '**Replace**', { contentType: 'markdown' })
```

[デモを開く](https://embed.tiptap.dev/preview/Markdown/Parse)

## MarkdownManager を直接使う

細かく制御したいときは、`editor.markdown` から `MarkdownManager` にアクセスします。

```typescript
// Markdown を JSON にパースする
const json = editor.markdown.parse('# Hello World')
console.log(json)
// { type: 'doc', content: [...] }

// JSON を Markdown にシリアライズする
const markdown = editor.markdown.serialize(json)
console.log(markdown)
// # Hello World
```

エディタの外で JSON コンテンツを扱うときに便利です。

## GitHub Flavored Markdown（GFM）

表やタスクリストなどの機能を使うには、GFM を有効にします。

```typescript
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

const editor = new Editor({
  extensions: [
    StarterKit,
    Table,
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem,
    Markdown.configure({
      markedOptions: { gfm: true },
    }),
  ],
})
```

## インラインの書式

標準の Markdown の書式は、設定しなくてもそのまま使えます。

```typescript
const markdown = `
**bold text** or __bold text__
*italic text* or _italic text_
***bold and italic***
[Link Text](https://example.com)
\`inline code\`
`

editor.commands.setContent(markdown, { contentType: 'markdown' })
const result = editor.getMarkdown() // 書式はそのまま残る
```

## ブロック要素を扱う

見出し、リスト、コードブロックなどのブロック要素も、期待どおりに動きます。

### 見出し

```typescript
const markdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`
```

### リスト

```typescript
// 順序なしリスト
const markdown = `
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3
`

// 順序付きリスト
const markdown = `
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
`
```

### コードブロック

```typescript
const markdown = `
\`\`\`javascript
function hello() {
  console.log('Hello World')
}
\`\`\`
`
```

### 引用

```typescript
const markdown = `
> This is a blockquote.
> It can span multiple lines.
>
> > And can be nested.
`
```

## Markdown の中の HTML を扱う

Markdown 拡張機能は、Markdown に埋め込まれた HTML を、Tiptap の既存の `parseHTML` メソッドでパースできます。

```typescript
const markdown = `
# Heading

<div class="custom">
  <p>This HTML will be parsed</p>
</div>

Regular **Markdown** continues here.
`

editor.commands.setContent(markdown, { contentType: 'markdown' })
```

HTML は、拡張機能に定義した `parseHTML` のルールに従ってパースされます。そのため、独自の HTML ノードにも対応できます。

## ベストプラクティス

Markdown コンテンツを設定するときは、**必ず `contentType` を指定し**、値を `markdown` にしてください（指定しないと HTML として扱われます）。

```typescript
editor.commands.setContent(markdown, { contentType: 'markdown' })
```

**必要な拡張機能をすべて入れてください**。足りないとコンテンツが失われることがあります。

```typescript
const editor = new Editor({
  extensions: [StarterKit, Markdown], // よく使うノードの大半は StarterKit に含まれる
})
```

**往復変換をテストしてください**。独自の Markdown コンテンツが、パース → シリアライズを経ても崩れないことを確かめます。

```typescript
editor.commands.setContent('# Hello **World**', { contentType: 'markdown' })
const result = editor.getMarkdown() // 元の内容と一致するはず
```

## 主な構成要素

### `MarkdownManager`

`MarkdownManager` クラスは、パースとシリアライズを担う中核のエンジンです。次の役割を持ちます。

- MarkedJS のインスタンスを包み、設定する
- 拡張機能のハンドラーの登録簿を管理する
- [レキサー](../glossary.md#lexer)のインスタンスを作り、すべての[トークナイザー](../glossary.md#tokenizer)を登録する
- Markdown のトークンと Tiptap JSON のノードの間を取り持つ

### `Markdown` 拡張機能

`Markdown` 拡張機能は、エディタに追加するメインの拡張機能です。次の機能を提供します。

- エディタの**コンテンツ関連**のコマンドをすべて上書きし、Markdown の入出力に対応させる
- コンテンツを Markdown としてシリアライズする `getMarkdown()` メソッド
- `contentType: 'markdown'` オプションで Markdown の入力をパースできる `setContent()` コマンド
- `editor.markdown` から [`MarkdownManager`](#using-the-markdownmanager-directly) のインスタンスへのアクセス

### 拡張機能のハンドラー

Tiptap の拡張機能は、それぞれの設定で Markdown に対応させられます。

```typescript
const MyExtension = Node.create({
  // ...

  renderMarkdown: (token, helpers) => { /* ... */ },
  parseMarkdown: (node, helpers) => { /* ... */ },
  markdownTokenizer: { /* ... */ },
})
```

ハンドラーは、Markdown のトークンと Tiptap のノードを双方向に変換します。ハンドラーは [`MarkdownManager`](#using-the-markdownmanager-directly) が自動で登録します。このとき、ハンドラーから[トークナイザー](../glossary.md#tokenizer)を作り、それを[レキサー](../glossary.md#lexer)に登録します。

詳しくは次のページを参照してください。

- [`renderMarkdown`](../advanced-usage/custom-serializing)
- [`parseMarkdown`](../advanced-usage/custom-parsing)
- [`markdownTokenizer`](../advanced-usage/custom-tokenizer)
