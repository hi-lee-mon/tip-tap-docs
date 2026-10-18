# StarterKit 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/starterkit](https://tiptap.dev/docs/editor/extensions/functionality/starterkit)

`StarterKit` は、よく使われる Tiptap の拡張機能をひとまとめにしたものです。Tiptap を使い始めたばかりなら、この拡張機能が向いています。

[デモを開く](https://embed.tiptap.dev/preview/Examples/Default)

## インストール

```bash
npm install @tiptap/starter-kit
```

## 含まれる拡張機能

### ノード

- [`Blockquote`](../nodes/blockquote.md)
- [`BulletList`](../nodes/bullet-list.md)
- [`CodeBlock`](../nodes/code-block.md)
- [`Document`](../nodes/document.md)
- [`HardBreak`](../nodes/hard-break.md)
- [`Heading`](../nodes/heading.md)
- [`HorizontalRule`](../nodes/horizontal-rule.md)
- [`ListItem`](../nodes/list-item.md)
- [`OrderedList`](../nodes/ordered-list.md)
- [`Paragraph`](../nodes/paragraph.md)
- [`Text`](../nodes/text.md)

### マーク

- [`Bold`](../marks/bold.md)
- [`Code`](../marks/code.md)
- [`Italic`](../marks/italic.md)
- [`Link`](../marks/link.md)（v3 で追加）
- [`Strike`](../marks/strike.md)
- [`Underline`](../marks/underline.md)（v3 で追加）

### 拡張機能

- [`Dropcursor`](dropcursor.md)
- [`Gapcursor`](gapcursor.md)
- [`Undo/Redo`](undo-redo.md)
- [`ListKeymap`](listkeymap.md)（v3 で追加）
- [`TrailingNode`](trailing-node.md)（v3 で追加）

## ソースコード

[packages/starter-kit/](https://github.com/ueberdosis/tiptap/blob/main/packages/starter-kit/)

## StarterKit 拡張機能を使う

`StarterKit` をエディタに渡すと、含まれる拡張機能をまとめて読み込めます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  content: '<p>Example Text</p>',
  extensions: [StarterKit],
})
```

次のように、含まれる拡張機能を個別に設定したり、一部を無効にしたりもできます。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  content: '<p>Example Text</p>',
  extensions: [
    StarterKit.configure({
      // 含まれる拡張機能を無効にする
      undoRedo: false,

      // 含まれる拡張機能を設定する
      heading: {
        levels: [1, 2],
      },
    }),
  ],
})
```

Tiptap では、同じ `name` プロパティを持つ拡張機能を2つ使えません。独自の拡張機能の名前が StarterKit に含まれる拡張機能と同じ場合は、StarterKit 側を無効にしてください。

```js
import { Editor, Mark } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

const CustomLinkExtension = Mark.create({
  name: 'link',
})

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      // CustomLinkExtension とぶつからないよう、
      // Link 拡張機能を無効にする
      link: false,
    }),
    CustomLinkExtension,
  ],
})
```
