# splitBlock コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/split-block](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/split-block)

`splitBlock` は、現在のノードを、現在の [NodeSelection](https://prosemirror.net/docs/ref/#state.NodeSelection) の位置で 2 つのノードに分割します。現在の選択範囲が分割できない場合、コマンドは何もしません。

## パラメーター

`options: Record<string, any>`

- `keepMarks: boolean` - マークを残すか外すかを指定します。デフォルトは `true` です。

## splitBlock コマンドの使い方

```js
// 現在のノードを分割し、マークを残す
editor.commands.splitBlock()

// 現在のノードを分割し、マークは残さない
editor.commands.splitBlock({ keepMarks: false })
```
