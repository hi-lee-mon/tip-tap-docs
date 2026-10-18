# unsetAllMarks コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-all-marks](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-all-marks)

`unsetAllMarks` は、現在の選択範囲からすべてのマークを外します。デフォルトでは各マークの [`clearable`](../../../extensions/custom-extensions/create-new/mark.md#clearable) オプションに従うため、`clearable: false` のマークは外れません。

## パラメーター

`options?: Record<string, any>`

- `ignoreClearable?: boolean` - `true` にすると、`clearable` の設定にかかわらずすべてのマークを外します。デフォルトは `false` です

## unsetAllMarks コマンドの使い方

```js
// clearable: true のマークをすべて外す（デフォルトの挙動）
editor.commands.unsetAllMarks()

// clearable オプションを無視して、すべてのマークを外す
editor.commands.unsetAllMarks({ ignoreClearable: true })
```
