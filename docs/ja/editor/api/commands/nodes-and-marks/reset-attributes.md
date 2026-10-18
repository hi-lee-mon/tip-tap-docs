# resetAttributes コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/reset-attributes](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/reset-attributes)

`resetAttributes` は、ノードの属性の一部をデフォルトの値に戻します。

## パラメーター

`typeOrName: string | Node`

属性を戻すノード。文字列か Node を渡します。

`attributes: string | string[]`

どの属性を戻すかを指定する文字列、または文字列の配列。

## resetAttributes コマンドの使い方

```js
// 選択中の段落ノードの style 属性と class 属性を元に戻す
editor.commands.resetAttributes('paragraph', ['style', 'class'])
```
