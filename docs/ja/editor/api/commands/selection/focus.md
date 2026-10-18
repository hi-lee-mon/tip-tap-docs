# focus コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection/focus](https://tiptap.dev/docs/editor/api/commands/selection/focus)

エディタにフォーカスを戻します。

ユーザーがエディタの外にあるボタンをクリックすると、ブラウザはそのボタンにフォーカスを移します。たいていの場面では、その後でエディタにフォーカスを戻したいはずです。そのため、このドキュメントのデモではほぼすべてでこのコマンドを使っています。

関連: [setTextSelection](set-text-selection.md)、[blur](blur.md)

## パラメーター

`position: 'start' | 'end' | 'all' | number | boolean | null (false)`

デフォルトでは、カーソルの位置（とテキストの選択範囲）を復元します。位置を渡すと、カーソルをそこへ移します。

`options: { scrollIntoView: boolean }`

フォーカスするときにカーソルまでスクロールするかどうか。デフォルトは `true` です。

## focus コマンドの使い方

```js
// エディタにフォーカスする
editor.commands.focus()

// カーソルを先頭に置く
editor.commands.focus('start')

// カーソルを末尾に置く
editor.commands.focus('end')

// ドキュメント全体を選択する
editor.commands.focus('all')

// カーソルを位置 10 に置く
editor.commands.focus(10)
```
