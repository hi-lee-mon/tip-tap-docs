# lift コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/lift](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/lift)

`lift` コマンドは、指定したノードを親ノードへ持ち上げます。**持ち上げる**とは、ブロックを、いま入っているブロックの親へ移すことです。

## パラメーター

`typeOrName: String | NodeType`

持ち上げるノード。現在の選択範囲にそのノードが見つからない場合、コマンドは何もしません。

`attributes: Record<string, any>`

持ち上げる対象のノードが持つべき属性。**省略できます**。

## lift コマンドの使い方

```js
// どの見出しでも持ち上げる
editor.commands.lift('headline')

// h2 だけを持ち上げる
editor.commands.lift('headline', { level: 2 })
```
