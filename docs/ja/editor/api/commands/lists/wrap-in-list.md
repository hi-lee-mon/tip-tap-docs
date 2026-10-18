# wrapInList コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists/wrap-in-list](https://tiptap.dev/docs/editor/api/commands/lists/wrap-in-list)

`wrapInList` は、現在の選択範囲にあるノードをリストで包みます。

## パラメーター

`typeOrName: string | NodeType`

リストで包むノードの型。

`attributes?: Record<string, any>`

リストに適用する属性。**省略できます。**

## wrapInList コマンドの使い方

```js
// 段落を箇条書きリストで包む
editor.commands.wrapInList('paragraph')
```
