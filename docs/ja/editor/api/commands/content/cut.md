# cut コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content/cut](https://tiptap.dev/docs/editor/api/commands/content/cut)

コンテンツを切り取り、指定した位置に移します。

関連: [focus](../selection/focus.md)

## cut コマンドの使い方

```js
const from = editor.state.selection.from
const to = editor.state.selection.to

const endPos = editor.state.doc.nodeSize - 2

// 範囲内のコンテンツを切り取り、ドキュメントの末尾に移す
editor.commands.cut({ from, to }, endPos)
```
