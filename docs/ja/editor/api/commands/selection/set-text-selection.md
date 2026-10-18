# setTextSelection コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection/set-text-selection](https://tiptap.dev/docs/editor/api/commands/selection/set-text-selection)

エディタで「選択範囲」と聞くと、おそらくテキストの選択範囲を思い浮かべるでしょう。`setTextSelection` を使うと、そのテキストの選択範囲を制御し、指定した範囲や位置に設定できます。

関連: [focus](focus.md)、[setNodeSelection](set-node-selection.md)、[deleteSelection](delete-selection.md)、[selectAll](select-all.md)

## パラメーター

`position: number | Range`

数値か Range（たとえば `{ from: 5, to: 10 }`）を渡します。

## setTextSelection コマンドの使い方

```js
// カーソルを指定した位置に置く
editor.commands.setTextSelection(10)

// テキストの選択範囲を指定した範囲にする
editor.commands.setTextSelection({ from: 5, to: 10 })
```
