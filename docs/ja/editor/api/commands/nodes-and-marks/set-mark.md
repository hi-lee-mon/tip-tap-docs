# setMark コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-mark](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-mark)

`setMark` コマンドは、現在の選択範囲に新しいマークを追加します。

## パラメーター

`typeOrName: string | MarkType`

追加するマークの型。文字列か MarkType を渡します。

`attributes: Record<string, any>`

マークに適用する属性。**省略できます。**

## setMark コマンドの使い方

```js
editor.commands.setMark('bold', { class: 'bold-tag' })
```
