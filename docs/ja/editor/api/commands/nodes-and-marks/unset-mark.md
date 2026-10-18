# unsetMark コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-mark](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-mark)

`unsetMark` は、現在の選択範囲からマークを外します。現在の選択範囲をまたいでマークを外すこともできます。

## パラメーター

`typeOrName: string | MarkType`

外すマークの型。

`options?: Record<string, any>`

- `extendEmptyMarkRange?: boolean` - 現在の選択範囲をまたいでマークを外します。デフォルトは `false` です

## unsetMark コマンドの使い方

```js
// bold マークを外す
editor.commands.unsetMark('bold')

// 現在の選択範囲をまたいで bold マークを外す
editor.commands.unsetMark('bold', { extendEmptyMarkRange: true })
```
