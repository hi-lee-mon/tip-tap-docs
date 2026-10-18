# FontFamily 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/fontfamily](https://tiptap.dev/docs/editor/extensions/functionality/fontfamily)

この拡張機能を使うと、エディタでフォントファミリーを設定できます。[`TextStyle`](../marks/text-style.md) マークを使うので、レンダリングされるのは `<span>` タグです。フォントファミリーは `<span style="font-family: Arial">` のようにインラインスタイルとして適用されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FontFamily)

> [!TIP]
> **注意**
>
> `editor.isActive('textStyle', { fontFamily: 'Font Family' })` で判定に使われるフォントファミリーは、[ブラウザの CSS ルール](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#family-name)に従った形になります。設定したときの値と一致するとは限らないので注意してください。

## インストール

```bash
npm install @tiptap/extension-text-style
```

この拡張機能には [`TextStyle`](../marks/text-style.md) マークが必要です。

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, FontFamily } from '@tiptap/extension-text-style'

new Editor({
  extensions: [TextStyle, FontFamily],
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

フォントファミリーの属性を適用するマークの一覧です。

デフォルト: `['textStyle']`

```js
FontFamily.configure({
  types: ['textStyle'],
})
```

## コマンド

### setFontFamily()

指定したフォントファミリーをインラインスタイルとして適用します。

```js
editor.commands.setFontFamily('Inter')
```

### unsetFontFamily()

フォントファミリーをすべて取り除きます。

```js
editor.commands.unsetFontFamily()
```

## ソースコード

[packages/extension-text-style/src/font-family/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/src/font-family)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { FontFamily } from '@tiptap/extension-text-style/font-family'

new Editor({
  extensions: [FontFamily],
})
```
