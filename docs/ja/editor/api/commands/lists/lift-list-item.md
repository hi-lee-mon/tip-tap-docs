# liftListItem コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists/lift-list-item](https://tiptap.dev/docs/editor/api/commands/lists/lift-list-item)

`liftListItem` は、現在の選択範囲を含むリスト項目を、外側の親リストへ持ち上げようとします。引数には、リスト項目ノードの名前（通常は `listItem`）を渡します。

## liftListItem コマンドの使い方

```js
editor.commands.liftListItem('listItem')
```
