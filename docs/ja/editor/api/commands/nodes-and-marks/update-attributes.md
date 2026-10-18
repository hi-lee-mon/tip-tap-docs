# updateAttributes コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/update-attributes](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/update-attributes)

`updateAttributes` コマンドは、ノードやマークの属性を新しい値にします。渡さなかった属性はそのまま残ります。

関連: [extendMarkRange](extend-mark-range.md)

## パラメーター

`typeOrName: string | NodeType | MarkType`

更新したい型を渡します。たとえば `'heading'` です。

`attributes: Record<string, any>`

更新する属性を持つオブジェクトを渡します。すべての属性を含める必要はありません。

## updateAttributes コマンドの使い方

```js
// ノードの属性を更新する
editor.commands.updateAttributes('heading', { level: 1 })

// マークの属性を更新する
editor.commands.updateAttributes('highlight', { color: 'pink' })
```
