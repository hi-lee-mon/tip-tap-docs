# Line Height 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/line-height](https://tiptap.dev/docs/editor/extensions/functionality/line-height)

この拡張機能を使うと、エディタで *行の高さ* を設定できます。[`TextStyle`](../marks/text-style.md) マークを使うので、レンダリングされるのは `<span>` タグだけです。行の高さは `<span style="line-height: 1.5">` のようにインラインスタイルとして適用されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/LineHeight)

## インストール

```bash
npm install @tiptap/extension-text-style
```

この拡張機能には [`TextStyle`](../marks/text-style.md) マークが必要です。

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, LineHeight } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyle, LineHeight],
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

`lineHeight` 属性を適用するマークの一覧です。

デフォルト: `['textStyle']`

```js
LineHeight.configure({
  types: ['textStyle'],
})
```

## コマンド

### setLineHeight()

指定した行の高さをインラインスタイルとして適用します。

```js
editor.commands.setLineHeight('1.1')
```

### unsetLineHeight()

行の高さの指定をすべて取り除きます。

```js
editor.commands.unsetLineHeight()
```

## ソースコード

[packages/extension-text-style/src/line-height/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/src/line-height/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { LineHeight } from '@tiptap/extension-text-style/line-height'

new Editor({
  extensions: [LineHeight],
})
```
