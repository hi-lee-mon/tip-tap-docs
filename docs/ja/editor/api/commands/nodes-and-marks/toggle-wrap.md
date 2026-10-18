# toggleWrap コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-wrap](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-wrap)

`toggleWrap` は、現在のノードを新しいノードで包みます。すでに包まれている場合は、包んでいるノードを外します。

## パラメーター

`typeOrName: string | NodeType`

包む側のノードに使うノードの型。

`attributes?: Record<string, any>`

ノードに適用する属性。**省略できます。**

## toggleWrap コマンドの使い方

```js
// 現在の選択範囲を見出しノードで包む／外す
editor.commands.toggleWrap('heading', { level: 1 })
```
