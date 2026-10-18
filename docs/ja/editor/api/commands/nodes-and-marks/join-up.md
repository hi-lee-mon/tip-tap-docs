# joinUp コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-up](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-up)

`joinUp` コマンドは、選択中のブロックを、すぐ上にある兄弟ノードと結合します。テキストを選択している場合は、選択範囲の祖先のうち結合できるもっとも近いブロックが対象です。[関連](https://prosemirror.net/docs/ref/#commands.joinUp)

## joinUp コマンドの使い方

```js
editor.commands.joinUp()
```
