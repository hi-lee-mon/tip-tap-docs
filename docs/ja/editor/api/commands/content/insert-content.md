# insertContent コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content/insert-content](https://tiptap.dev/docs/editor/api/commands/content/insert-content)

`insertContent` コマンドは、渡した値をドキュメントに追加します。

関連: [setContent](set-content.md)、[clearContent](clear-content.md)

## パラメーター

`value: Content`

このコマンドは柔軟で、値としてプレーンテキスト、HTML、さらには JSON も受け付けます。

## insertContent コマンドの使い方

```js
// プレーンテキスト
editor.commands.insertContent('Example Text')

// HTML
editor.commands.insertContent('<h1>Example Text</h1>')

// 空白を詰めた HTML
editor.commands.insertContent('<h1>Example Text</h1>', {
  parseOptions: {
    preserveWhitespace: false,
  },
})

// JSON/ノード
editor.commands.insertContent({
  type: 'heading',
  attrs: {
    level: 1,
  },
  content: [
    {
      type: 'text',
      text: 'Example Text',
    },
  ],
})

// 複数のノードを一度に挿入する
editor.commands.insertContent([
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'First paragraph',
      },
    ],
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Second paragraph',
      },
    ],
  },
])
```
