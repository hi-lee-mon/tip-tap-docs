# joinForward コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-forward](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/join-forward)

`joinForward` コマンドは、現在の選択範囲から 2 つのノードを前方へ結合します。選択範囲が空で、かつテキストブロックの末尾にある場合、`joinForward` はそのブロックと直後のブロックの距離を縮めようとします。[関連](https://prosemirror.net/docs/ref/#commands.joinForward)

## joinForward コマンドの使い方

```js
editor.commands.joinForward()
```
