# toggleNode コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-node](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/toggle-node)

`toggleNode` は、ノードを別のノードと切り替えます。

## パラメーター

`typeOrName: string | NodeType`

切り替えるノードの型。

`toggleTypeOrName: string | NodeType`

切り替え先として使うノードの型。

`attributes?: Record<string, any>`

ノードに適用する属性。**省略できます。**

## toggleNode コマンドの使い方

```js
// 段落と見出しノードを切り替える
editor.commands.toggleNode('paragraph', 'heading', { level: 1 })

// 段落と画像ノードを切り替える
editor.commands.toggleNode('paragraph', 'image', { src: 'https://example.com/image.png' })
```
