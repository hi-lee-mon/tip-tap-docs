# Paragraph 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/paragraph](https://tiptap.dev/docs/editor/extensions/nodes/paragraph)

そうです、スキーマはとても厳格です。この拡張機能がなければ、エディタで段落すら使えません。

> [!WARNING]
> **破壊的変更**
>
> Tiptap v1 はこのノードを隠そうとしていましたが、ノード自体はずっと存在していました。今後は明示的に
> import する必要があります（または [StarterKit](../functionality/starterkit.md) を使ってください）。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Paragraph)

## インストール

```bash
npm install @tiptap/extension-paragraph
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Paragraph.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setParagraph()

選択中のノードをすべて段落に変えます。

```js
editor.commands.setParagraph()
```

## キーボードショートカット

| コマンド       | Windows/Linux                                      | macOS                                          |
| -------------- | -------------------------------------------------- | ---------------------------------------------- |
| setParagraph() | <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>0</kbd> | <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>0</kbd> |

## ソースコード

[packages/extension-paragraph/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-paragraph/)
