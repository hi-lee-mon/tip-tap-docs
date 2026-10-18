# joinBackward コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-backward](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-backward)

`joinBackward` コマンドは、現在の選択範囲から 2 つのノードを後方へ結合します。選択範囲が空で、かつテキストブロックの先頭にある場合、`joinBackward` はそのブロックと直前のブロックの距離を縮めようとします。[関連](https://prosemirror.net/docs/ref/#commands.joinBackward)

## joinBackward コマンドの使い方

```js
editor.commands.joinBackward()
```
