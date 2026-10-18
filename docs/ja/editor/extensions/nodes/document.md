# Document 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/document](https://tiptap.dev/docs/editor/extensions/nodes/document)

Tiptap で何を作るにしても、`Document` 拡張機能は必須です。これはいわゆる「topNode」で、ほかのすべてのノードの入れ物になるノードです。ドキュメントにとっての `<body>` タグのようなものだと考えてください。

とはいえ、このノードはとても小さなものです。ノードの名前（`doc`）を定義し、トップノードとして設定され（`topNode: true`）、ほかのノードを複数含められる（`block+`）。それだけです。実際に見てみてください。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Document)

> [!WARNING]
> **破壊的変更**
>
> Tiptap v1 はこのノードを隠そうとしていましたが、ノード自体はずっと存在していました。今後は明示的に
> import する必要があります（または [StarterKit](../functionality/starterkit.md) を使ってください）。

## インストール

```bash
npm install @tiptap/extension-document
```

## ソースコード

[packages/extension-document/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-document/)
