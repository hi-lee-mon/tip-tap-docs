# TableRow 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/table-row](https://tiptap.dev/docs/editor/extensions/nodes/table-row)

行のない表に何の意味があるでしょう。表を使えるようにするには、この拡張機能を追加してください。

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

## ソースコード

[packages/extension-table/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/row)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { TableRow } from '@tiptap/extension-table/row'

new Editor({
  extensions: [TableRow],
})
```
