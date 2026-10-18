# extendMarkRange コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/extend-mark-range](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/extend-mark-range)

`extendMarkRange` コマンドは、現在の選択範囲を広げて、現在のマーク全体を含むようにします。現在の選択範囲に指定したマークがなければ、何も変わりません。

## パラメーター

`typeOrName: string | MarkType`

マークの名前または型。

`attributes?: Record<string, any>`

広げる対象のマークが持つべき属性を、必要に応じて指定できます。

## extendMarkRange コマンドの使い方

```js
// 選択範囲を link マークまで広げる
editor.commands.extendMarkRange('link')

// 選択範囲を、特定の属性を持つ link マークまで広げる
editor.commands.extendMarkRange('link', { href: 'https://google.com' })

// 選択範囲を link マークまで広げて属性を更新する
editor
  .chain()
  .extendMarkRange('link')
  .updateAttributes('link', {
    href: 'https://duckduckgo.com',
  })
  .run()
```
