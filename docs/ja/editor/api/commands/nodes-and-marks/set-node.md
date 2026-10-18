# setNode コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-node](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-node)

`setNode` コマンドは、指定した範囲を、指定したノードで置き換えます。範囲は現在の選択範囲で決まります。**重要**: 現時点で `setNode` が対応しているのはテキストブロックのノードだけです。

## パラメーター

`typeOrName: string | NodeType`

範囲を置き換えるノードの型。文字列か NodeType を渡します。

`attributes?: Record<string, any>`

ノードに適用する属性。**省略できます。**

## setNode コマンドの使い方

```js
editor.commands.setNode('paragraph', { id: 'paragraph-01' })
```
