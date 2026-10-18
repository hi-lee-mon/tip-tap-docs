# Table 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/table](https://tiptap.dev/docs/editor/extensions/nodes/table)

昔ながらの HTML の表ほど楽しいものはありません。`Table` 拡張機能を使うと、WYSIWYG 編集の聖杯ともいえる表をエディタに追加できます。

`spacer.gif` を追加するのも忘れずに。（冗談です。何のことか分からなければ、聞き流してください。）

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Table)

## インストール

```bash
npm install @tiptap/extension-table
```

この拡張機能は `TableKit` 拡張機能に標準で含まれているため、個別にインストールする必要はありません。

```ts
import { Editor } from '@tiptap/core'
import { TableKit } from '@tiptap/extension-table'

new Editor({
  extensions: [TableKit],
})
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Table.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### resizable

デフォルト: `false`

### renderWrapper

表がリサイズ不可のとき、またはエディタが編集不可のときに、表を囲むラッパーの `<div>` をレンダリングするかどうかを指定します。リサイズ可能な表で使うノードビューとレイアウトをそろえるためのものです。

デフォルト: `false`

### handleWidth

デフォルト: `5`

### cellMinWidth

デフォルト: `25`

### View

デフォルト: `TableView`

### lastColumnResizable

デフォルト: `true`

### allowTableNodeSelection

デフォルト: `false`

## コマンド

### insertTable()

デフォルトでは、見出し行を含む 3 行 3 列の新しい表を作ります。行数、列数、見出しの有無は指定できます。

```js
editor.commands.insertTable()
editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })
```

### addColumnBefore()

現在の列の前に列を追加します。

```js
editor.commands.addColumnBefore()
```

### addColumnAfter()

現在の列の後ろに列を追加します。

```js
editor.commands.addColumnAfter()
```

### deleteColumn()

現在の列を削除します。

```js
editor.commands.deleteColumn()
```

### addRowBefore()

現在の行の上に行を追加します。

```js
editor.commands.addRowBefore()
```

### addRowAfter()

現在の行の下に行を追加します。

```js
editor.commands.addRowAfter()
```

### deleteRow()

現在の行を削除します。

```js
editor.commands.deleteRow()
```

### deleteTable()

表全体を削除します。

```js
editor.commands.deleteTable()
```

### mergeCells()

選択中のセルをすべて 1 つのセルに結合します。

```js
editor.commands.mergeCells()
```

### splitCell()

現在のセルを分割します。

```js
editor.commands.splitCell()
```

### toggleHeaderColumn()

現在の列を見出し列にします。

```js
editor.commands.toggleHeaderColumn()
```

### toggleHeaderRow()

現在の行を見出し行にします。

```js
editor.commands.toggleHeaderRow()
```

### toggleHeaderCell()

現在のセルを見出しセルにします。

```js
editor.commands.toggleHeaderCell()
```

### mergeOrSplit()

複数のセルを選択している場合は結合します。1 つのセルを選択している場合は、そのセルを 2 つに分割します。

```js
editor.commands.mergeOrSplit()
```

### setCellAttribute()

現在のセルに、指定した属性を設定します。背景色など、[`TableCell`](table-cell.md) 拡張機能で定義したものなら何でも設定できます。ただし、先に[カスタム属性](../custom-extensions/extend-existing.md#attributes)を登録しておいてください。

```js
editor.commands.setCellAttribute('customAttribute', 'value')
editor.commands.setCellAttribute('backgroundColor', '#000')
```

### goToNextCell()

次のセルに移ります。

```js
editor.commands.goToNextCell()
```

### goToPreviousCell()

前のセルに移ります。

```js
editor.commands.goToPreviousCell()
```

### fixTables()

ドキュメント内のすべての表を調べ、必要なら修正します。

```js
editor.commands.fixTables()
```

## ソースコード

[packages/extension-table/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Table } from '@tiptap/extension-table/table'

new Editor({
  extensions: [Table],
})
```
