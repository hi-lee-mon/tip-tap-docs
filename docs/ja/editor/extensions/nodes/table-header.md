# TableHeader 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/table-header](https://tiptap.dev/docs/editor/extensions/nodes/table-header)

[`Table`](table.md) 拡張機能を補う拡張機能です。追加するのは……お察しのとおり、表の見出しセルです。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Table)

## インストール

```bash
npm install @tiptap/extension-table
```

この拡張機能を使うには、[`Table`](table.md) 拡張機能のインストールが必要です。

この拡張機能は `TableKit` 拡張機能に標準で含まれているため、個別にインストールする必要はありません。

```ts
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'

new Editor({
  extensions: [TableKit],
})
```

## 使い方

表の見出しセルは必須ではありません。とはいえ、欲しいですよね？ 不要な場合は、[`TableRow`](table-row.md) 拡張機能の `content` 属性を次のように変更します。

```js
// 見出しセルのない表の行
TableRow.extend({
  content: 'tableCell*',
})
```

デフォルトは次の設定で、見出しセルを使えます。

```js
// 見出しセルのある表の行（デフォルト）
TableRow.extend({
  content: '(tableCell | tableHeader)*',
})
```

## ソースコード

[packages/extension-table-header/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/header)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { TableHeader } from '@tiptap/extension-table/header'

new Editor({
  extensions: [TableHeader],
})
```
