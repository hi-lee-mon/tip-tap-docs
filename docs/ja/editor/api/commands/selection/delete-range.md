# deleteRange コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection/delete-range](https://tiptap.dev/docs/editor/api/commands/selection/delete-range)

`deleteRange` コマンドは、指定した範囲にあるものをすべて削除します。`Range` 型の `range` 属性が必要です。

## パラメーター

`range: Range`

## deleteRange コマンドの使い方

```js
editor.commands.deleteRange({ from: 0, to: 12 })
```
