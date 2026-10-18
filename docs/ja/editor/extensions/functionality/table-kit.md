# TableKit 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/table-kit](https://tiptap.dev/docs/editor/extensions/functionality/table-kit)

`TableKit` は、表に必要な Tiptap の拡張機能をひとまとめにしたものです。Tiptap ですぐに表を使えるようにしたいときに向いています。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Table)

## インストール

```bash
npm install @tiptap/extension-table
```

## 含まれる拡張機能

### ノード

- [`Table`](../nodes/table.md)
- [`TableCell`](../nodes/table-cell.md)
- [`TableHeader`](../nodes/table-header.md)
- [`TableRow`](../nodes/table-row.md)

## ソースコード

[packages/extension-table/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/)

## TableKit 拡張機能を使う

`TableKit` をエディタに渡すと、含まれる拡張機能をまとめて読み込めます。

```js
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'

const editor = new Editor({
  extensions: [TableKit],
})
```

次のように、含まれる拡張機能を個別に設定したり、一部を無効にしたりもできます。

```js
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'

const editor = new Editor({
  extensions: [
    TableKit.configure({
      // 拡張機能を無効にする
      tableRow: false,

      // 拡張機能を設定する
      tableCell: {
        HTMLAttributes: { class: 'list-item' },
      },
    }),
  ],
})
```
