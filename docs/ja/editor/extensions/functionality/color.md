# Color 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/color](https://tiptap.dev/docs/editor/extensions/functionality/color)

この拡張機能を使うと、エディタで文字色を設定できます。[`TextStyle`](../marks/text-style.md) マークを使うので、レンダリングされるのは `<span>` タグだけです。文字色は `<span style="color: #958DF1">` のようにインラインスタイルとして適用されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Color)

## インストール

```bash
npm install @tiptap/extension-text-style
```

この拡張機能には [`TextStyle`](../marks/text-style.md) マークが必要です。

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, Color } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyle, Color],
})
```

この拡張機能は `TextStyleKit` 拡張機能にあらかじめ含まれているので、別途インストールする必要はありません。

```ts
import { Editor } from '@tiptap/core'
import { TextStyleKit } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyleKit],
})
```

## 設定

### types

色の属性を適用するマークの一覧です。

デフォルト: `['textStyle']`

```js
Color.configure({
  types: ['textStyle'],
})
```

## コマンド

### setColor()

指定した文字色をインラインスタイルとして適用します。

```js
editor.commands.setColor('#ff0000')
```

### unsetColor()

文字色をすべて取り除きます。

```js
editor.commands.unsetColor()
```

## ソースコード

[packages/extension-text-style/src/color/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/src/color/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Color } from '@tiptap/extension-text-style/color'

new Editor({
  extensions: [Color],
})
```
