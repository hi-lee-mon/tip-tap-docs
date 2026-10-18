# toggleList コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists/toggle-list](https://tiptap.dev/docs/editor/api/commands/lists/toggle-list)

`toggleList` は、異なる種類のリストを切り替えます。

## パラメーター

`listTypeOrName: string | NodeType`

外側のリストに使うノードの型

`itemTypeOrName: string | NodeType`

リスト項目に使うノードの型

`keepMarks?: boolean`

リスト項目にしたときにマークを残すかどうか

`attributes?: Record<string, any>`

リストに適用する属性。**省略できます。**

## toggleList コマンドの使い方

```js
// 箇条書きリストとリスト項目を切り替える
editor.commands.toggleList('bulletList', 'listItem')

// 番号付きリストとリスト項目を切り替える
editor.commands.toggleList('orderedList', 'listItem')
```
