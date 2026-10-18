# createParagraphNear コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/create-paragraph-near](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/create-paragraph-near)

ブロックノードが選択されているとき、`createParagraphNear` コマンドは、そのブロックノードの後ろに空の段落を作ります。選択中のブロックノードが親の最初の子である場合は、新しい段落を現在の選択範囲の前に挿入します。

## createParagraphNear コマンドの使い方

```js
editor.commands.createParagraphNear()
```
