# FontSize 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/fontsize](https://tiptap.dev/docs/editor/extensions/functionality/fontsize)

この拡張機能を使うと、エディタでフォントサイズを設定できます。[`TextStyle`](../marks/text-style.md) マークを使うので、レンダリングされるのは `<span>` タグです。フォントサイズは `<span style="font-size: 14px">` のようにインラインスタイルとして適用されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FontSize)

## インストール

```bash
npm install @tiptap/extension-text-style
```

この拡張機能には [`TextStyle`](../marks/text-style.md) マークが必要です。

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyle, FontSize],
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

フォントサイズの属性を適用するマークの一覧です。（訳注: この節と「コマンド」の節では、原文は「font family」と書いていますが、内容から「フォントサイズ」と訳しています。）

デフォルト: `['textStyle']`

```js
FontSize.configure({
  types: ['textStyle'],
})
```

## コマンド

### setFontSize()

指定したフォントサイズをインラインスタイルとして適用します。

```js
editor.commands.setFontSize('14px')
```

### unsetFontSize()

フォントサイズをすべて取り除きます。

```js
editor.commands.unsetFontSize()
```

## ソースコード

[packages/extension-text-style/src/font-size/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/src/font-size)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { FontSize } from '@tiptap/extension-text-style/font-size'

new Editor({
  extensions: [FontSize],
})
```
