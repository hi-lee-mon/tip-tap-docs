# toggleMark コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-mark](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-mark)

`toggleMark` コマンドは、現在の選択範囲で特定のマークのオン・オフを切り替えます。

## パラメーター

`typeOrName: string | MarkType`

切り替えるマークの型。

`attributes?: Record<string, any>`

マークに適用する属性。**省略できます。**

`options?: Record<string, any>`

- `extendEmptyMarkRange: boolean` - 現在の選択範囲をまたいでマークを外します。デフォルトは `false` です

## toggleMark コマンドの使い方

```js
// bold マークを切り替える
editor.commands.toggleMark('bold')

// color 属性付きの bold マークを切り替える
editor.commands.toggleMark('bold', { color: 'red' })

// color 属性付きの bold マークを切り替え、現在の選択範囲をまたいでマークを外す
editor.commands.toggleMark('bold', { color: 'red' }, { extendEmptyMarkRange: true })
```
