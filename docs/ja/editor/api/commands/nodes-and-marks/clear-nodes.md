# clearNodes コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/clear-nodes](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/clear-nodes)

`clearNodes` コマンドは、ノードをデフォルトのノード（標準では段落）に正規化します。あらゆる種類のリストも正規化の対象です。高度な使い方では、新しいノード型を適用する前に使うと便利です。

デフォルトのノードの決め方が気になるかもしれません。これは [`Document`](../../../extensions/nodes/document.md) の `content` 属性の中身で決まります。標準では `block+`（ブロックノードが 1 つ以上）で、[`Paragraph`](../../../extensions/nodes/paragraph.md) ノードの優先度がもっとも高くなっています。そのため Paragraph が最初に読み込まれ、デフォルトのノードになります。

## clearNodes コマンドの使い方

```js
editor.commands.clearNodes()
```
