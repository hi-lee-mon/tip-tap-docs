# TextStyleKit 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/text-style-kit](https://tiptap.dev/docs/editor/extensions/functionality/text-style-kit)

`TextStyleKit` は、テキストのスタイルを扱う Tiptap の拡張機能のうち、よく使うものをひとまとめにしたものです。Tiptap ですぐにテキストのスタイルを設定できるようにしたいときに向いています。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Textstyle)

## インストール

```bash
npm install @tiptap/extension-text-style
```

## 含まれる拡張機能

### マーク

- [`TextStyle`](../marks/text-style.md)

### 機能

- [`BackgroundColor`](background-color.md)
- [`Color`](color.md)
- [`FontFamily`](fontfamily.md)
- [`FontSize`](fontsize.md)
- [`LineHeight`](line-height.md)

## ソースコード

[packages/extension-text-style/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/)

## TextStyleKit 拡張機能を使う

`TextStyleKit` をエディタに渡すと、含まれる拡張機能をまとめて読み込めます。

```js
import { Editor } from '@tiptap/core'
import { TextStyleKit } from '@tiptap/extension-text-style'

const editor = new Editor({
  extensions: [TextStyleKit],
})
```

次のように、含まれる拡張機能を個別に設定したり、一部を無効にしたりもできます。

```js
import { Editor } from '@tiptap/core'
import { TextStyleKit } from '@tiptap/extension-text-style'

const editor = new Editor({
  extensions: [
    TextStyleKit.configure({
      // 拡張機能を無効にする
      backgroundColor: false,

      // 拡張機能を設定する
      fontSize: {
        types: ['heading', 'paragraph'],
      },
    }),
  ],
})
```
