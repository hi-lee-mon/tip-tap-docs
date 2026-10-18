# setTextDirection コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-text-direction](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks/set-text-direction)

`setTextDirection` コマンドは、現在の選択範囲または指定した位置にあるノードの文字方向を設定します。アラビア語やヘブライ語のような右から左に書く（RTL）言語や、双方向のテキストを含むコンテンツで、文字方向を制御したいときに使います。

関連: [unsetTextDirection](unset-text-direction.md)

## パラメーター

### direction

設定する文字方向。`'ltr'`（左から右）、`'rtl'`（右から左）、`'auto'`（コンテンツから自動判定）のいずれかを指定します。

### position

省略可能。文字方向を適用する位置または範囲です。指定しない場合は、現在の選択範囲が対象になります。

指定できる値は次のとおりです。
- 特定の位置を表す数値
- 範囲を表す、`from` と `to` プロパティを持つオブジェクト

## 例

```js
// 現在の選択範囲を RTL にする
editor.commands.setTextDirection('rtl')

// 現在の選択範囲を LTR にする
editor.commands.setTextDirection('ltr')

// 現在の選択範囲を auto にする
editor.commands.setTextDirection('auto')

// 特定の位置の文字方向を設定する
editor.commands.setTextDirection('rtl', 5)

// 特定の範囲の文字方向を設定する
editor.commands.setTextDirection('ltr', { from: 0, to: 10 })

// ほかのコマンドとチェーンする
editor.chain().focus().setTextDirection('rtl').run()
```
