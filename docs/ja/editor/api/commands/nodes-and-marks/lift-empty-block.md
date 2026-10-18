# liftEmptyBlock コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/lift-empty-block](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/lift-empty-block)

選択中のブロックが空のテキストブロックであれば、可能な場合にそれを持ち上げます。**持ち上げる**とは、ブロックを、いま入っているブロックの親へ移すことです。

## liftEmptyBlock コマンドの使い方

```js
editor.commands.liftEmptyBlock()
```
