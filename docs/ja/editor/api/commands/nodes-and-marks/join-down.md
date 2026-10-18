# joinDown コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-down](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-down)

`joinDown` コマンドは、選択中のブロックを、すぐ下にある兄弟ノードと結合します。テキストを選択している場合は、選択範囲の祖先のうち結合できるもっとも近いブロックが対象です。[関連](https://prosemirror.net/docs/ref/#commands.joinDown)

## joinDown コマンドの使い方

```js
editor.commands.joinDown()
```
