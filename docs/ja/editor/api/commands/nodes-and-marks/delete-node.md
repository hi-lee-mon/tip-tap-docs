# deleteNode コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/delete-node](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/delete-node)

`deleteNode` コマンドは、現在の選択範囲の中にあるノードを削除します。削除するノードを探すために、引数 `typeOrName`（文字列または `NodeType`）が必要です。ノードを削除すると、ビューはカーソルの位置まで自動でスクロールします。

## パラメーター

`typeOrName: string | NodeType`

## deleteNode コマンドの使い方

```js
// 段落ノードを削除する
editor.commands.deleteNode('paragraph')

// または

// カスタムノードを削除する
editor.commands.deleteNode(MyCustomNode)
```
