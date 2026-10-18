# sinkListItem コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists/sink-list-item](https://tiptap.dev/docs/editor/api/commands/lists/sink-list-item)

`sinkListItem` は、現在の選択範囲を含むリスト項目を、内側の子リストへ下げようとします。引数には、リスト項目ノードの名前（通常は `listItem`）を渡します。

## sinkListItem コマンドの使い方

```js
editor.commands.sinkListItem('listItem')
```
