# insertContentAt コマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/content/insert-content-at](https://tiptap.dev/docs/editor/api/commands/content/insert-content-at)

`insertContentAt` は、HTML 文字列やノードを指定した位置または範囲に挿入します。範囲を指定した場合は、その範囲のコンテンツが新しいコンテンツに置き換わります。

## パラメーター

`position: number | Range`

コンテンツを挿入する位置または範囲。

`value: Content`

挿入するコンテンツ。プレーンテキスト、HTML 文字列、JSON のノード（複数可）を渡せます。

`options: Record<string, any>`

- updateSelection: 挿入したコンテンツへ選択範囲を移すかどうかを指定します。
- parseOptions: 渡したコンテンツは ProseMirror がパースします。パースの処理に手を加えたいときは `parseOptions` を渡します。渡した値は [ProseMirror](https://prosemirror.net/docs/ref/#model.ParseOptions) が処理します。

## insertContentAt コマンドの使い方

```js
// プレーンテキスト
editor.commands.insertContentAt(12, 'Example Text')

// プレーンテキストで範囲を置き換える
editor.commands.insertContentAt({ from: 12, to: 16 }, 'Example Text')

// HTML
editor.commands.insertContentAt(12, '<h1>Example Text</h1>')

// 空白を保持した HTML
editor.commands.insertContentAt(12, '<p>Hello world</p>', {
  updateSelection: true,
  parseOptions: {
    preserveWhitespace: 'full',
  },
})

// JSON/ノード
editor.commands.insertContentAt(12, {
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
editor.commands.insertContentAt(12, [
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
