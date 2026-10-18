# unsetTextDirection コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-text-direction](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/unset-text-direction)

`unsetTextDirection` コマンドは、現在の選択範囲または指定した位置にあるノードから、文字方向の属性を取り除きます。取り除いたノードは、エディタ全体の `textDirection` 設定から文字方向を引き継ぐか、文字方向の属性をまったく持たない状態になります。

関連: [setTextDirection](set-text-direction.md)

## パラメーター

### position

省略可能。文字方向を取り除く位置または範囲です。指定しない場合は、現在の選択範囲が対象になります。

指定できる値は次のとおりです。
- 特定の位置を表す数値
- 範囲を表す、`from` と `to` プロパティを持つオブジェクト

## 例

```js
// 現在の選択範囲から文字方向を取り除く
editor.commands.unsetTextDirection()

// 特定の位置から文字方向を取り除く
editor.commands.unsetTextDirection(5)

// 特定の範囲から文字方向を取り除く
editor.commands.unsetTextDirection({ from: 0, to: 10 })

// ほかのコマンドとチェーンする
editor.chain().focus().unsetTextDirection().run()
```
