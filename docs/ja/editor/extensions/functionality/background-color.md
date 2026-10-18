# Background Color 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/background-color](https://tiptap.dev/docs/editor/extensions/functionality/background-color)

この拡張機能を使うと、エディタで背景色を設定できます。[`TextStyle`](../marks/text-style.md) マークを使うので、レンダリングされるのは `<span>` タグだけです。背景色は `<span style="background-color: #958DF1">` のようにインラインスタイルとして適用されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/BackgroundColor)

## インストール

```bash
npm install @tiptap/extension-text-style
```

この拡張機能には [`TextStyle`](../marks/text-style.md) マークが必要です。

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, BackgroundColor } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyle, BackgroundColor],
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
BackgroundColor.configure({
  types: ['textStyle'],
})
```

## コマンド

### setBackgroundColor()

指定した背景色をインラインスタイルとして適用します。

```js
editor.commands.setBackgroundColor('#ff0000')
```

### unsetBackgroundColor()

背景色をすべて取り除きます。

```js
editor.commands.unsetBackgroundColor()
```

## ソースコード

[packages/extension-text-style/src/background-color/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/src/background-color/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { BackgroundColor } from '@tiptap/extension-text-style/background-color'

new Editor({
  extensions: [BackgroundColor],
})
```
