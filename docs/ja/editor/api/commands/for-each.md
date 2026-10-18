# forEach コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/for-each](https://tiptap.dev/docs/editor/api/commands/for-each)

配列の要素を順に処理します。

## パラメーター

`items: any[]`

要素の配列。

`fn: (item: any, props: CommandProps & { index: number }) => boolean`

各要素に対して好きな処理を行う関数。

## forEach コマンドの使い方

```js
const items = ['foo', 'bar', 'baz']

editor.commands.forEach(items, (item, { commands }) => {
  return commands.insertContent(item)
})
```
