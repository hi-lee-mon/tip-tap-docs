# splitListItem コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists/split-list-item](https://tiptap.dev/docs/editor/api/commands/lists/split-list-item)

`splitListItem` は、1 つのリスト項目を別々の 2 つのリスト項目に分割します。入れ子のリストの場合は、外側のリスト項目が分割されます。

## パラメーター

`typeOrName: string | NodeType`

別々の 2 つのリスト項目に分割するノードの型。

## splitListItem コマンドの使い方

```js
editor.commands.splitListItem('bulletList')
```
