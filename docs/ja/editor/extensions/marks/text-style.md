# TextStyle 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/marks/text-style](https://tiptap.dev/docs/editor/extensions/marks/text-style)

このマークは `<span>` HTML タグをレンダリングし、font-family、font-size、color など、スタイルに関する属性を追加できるようにします。この拡張機能自体はデフォルトでスタイルの属性を何も追加しませんが、[`FontFamily`](../functionality/fontfamily.md) や [`Color`](../functionality/color.md) などのほかの拡張機能が、これを土台として使っています。

[デモを開く](https://embed.tiptap.dev/preview/Marks/Textstyle)

## フォントサイズを適用する

`TextStyle` は `<span>` マークを提供し、[`FontSize`](../functionality/fontsize.md) などの拡張機能が具体的なスタイル属性を追加します。text-style パッケージをインストールし、`StarterKit` が提供するようなドキュメントのスキーマを持つエディタに、両方の拡張機能を入れます。

```bash
npm install @tiptap/extension-text-style @tiptap/starter-kit
```

```ts
import { Editor } from '@tiptap/core'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  extensions: [StarterKit, TextStyle, FontSize],
})

editor.chain().focus().setFontSize('18px').run()
```

このコマンドは、選択したテキストを、インラインスタイル `font-size: 18px` 付きの `span` としてレンダリングします。

## インストール

```bash
npm install @tiptap/extension-text-style
```

## コマンド

### removeEmptyTextStyle()

インラインスタイルを持たない `<span>` タグを取り除きます。

```js
editor.command.removeEmptyTextStyle()
```

## ソースコード

[packages/extension-text-style/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/)
