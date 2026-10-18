# Text 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/text](https://tiptap.dev/docs/editor/extensions/nodes/text)

`Text` 拡張機能は必須です。少なくとも何らかのテキストを扱うなら必要で、まず間違いなく扱うはずです。この拡張機能は少し変わっていて、HTML すらレンダリングしません。ただのプレーンテキスト、それだけです。

> [!NOTE]
> **破壊的変更**
>
> Tiptap v1 はこのノードを隠そうとしていましたが、ノード自体はずっと存在していました。今後は明示的に
> import する必要があります（または [StarterKit](../functionality/starterkit.md) を使ってください）。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Text)

## インストール

```bash
npm install @tiptap/extension-text
```

## ソースコード

[packages/extension-text/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text/)
