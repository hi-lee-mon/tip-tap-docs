# setNodeSelection コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection/set-node-selection](https://tiptap.dev/docs/editor/api/commands/selection/set-node-selection)

`setNodeSelection` は、指定した位置に新しい NodeSelection を作ります。ノード選択とは、1 つのノードを指す選択範囲のことです。[詳しく見る](https://prosemirror.net/docs/ref/#state.NodeSelection)

## パラメーター

`position: number`

NodeSelection を作る位置。

## setNodeSelection コマンドの使い方

```js
editor.commands.setNodeSelection(10)
```
