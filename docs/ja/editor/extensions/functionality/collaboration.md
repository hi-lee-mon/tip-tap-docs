# Collaboration 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/collaboration](https://tiptap.dev/docs/editor/extensions/functionality/collaboration)

この短いガイドでは、基本的な共同編集の機能をエディタに組み込む方法を手短に紹介します。本格的に組み込む場合は、クラウド型とオンプレミス型の共同編集サーバーである [Tiptap Collaboration](https://tiptap.dev/docs/collaboration/getting-started/overview) のドキュメントを参照してください。

[デモを開く](https://embed.tiptap.dev/preview/Demos/CollaborationSplitPane)

## インストール

> [!TIP]
> **詳細**
>
> Collaboration 拡張機能を Tiptap Collaboration 製品と組み合わせて組み込む方法、インストール、設定の詳細は、[機能のページ](https://tiptap.dev/docs/collaboration/getting-started/overview)を参照してください。

```bash
npm install @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-websocket
```

## 設定

### document

初期化済みの Y.js ドキュメントです。

デフォルト: `null`

```js
Collaboration.configure({
  document: new Y.Doc(),
})
```

### field

Y.js のフラグメントの名前です。名前を変えると、1つの Y.js ドキュメントで複数のフィールドを同期できます。

デフォルト: `'default'`

```js
Collaboration.configure({
  document: new Y.Doc(),
  field: 'title',
})
```

### fragment

Y.js のフラグメントそのものです。`document` と `field` の代わりに使えます。

デフォルト: `null`

```js
Collaboration.configure({
  fragment: new Y.Doc().getXmlFragment('body'),
})
```

## コマンド

`Collaboration` 拡張機能は独自の履歴の拡張機能を備えています。`StarterKit` を使っている場合は、`UndoRedo` 拡張機能を必ず無効にしてください。

### undo()

直前の変更を元に戻します。

```js
editor.commands.undo()
```

### redo()

直前の変更をやり直します。

```js
editor.commands.redo()
```

## キーボードショートカット

| コマンド | Windows/Linux | macOS |
| --- | --- | --- |
| undo() | <kbd>Control</kbd> + <kbd>Z</kbd> | <kbd>Cmd</kbd> + <kbd>Z</kbd> |
| redo() | <kbd>Shift</kbd> + <kbd>Control</kbd> + <kbd>Z</kbd> または <kbd>Control</kbd> + <kbd>Y</kbd> | <kbd>Shift</kbd> + <kbd>Cmd</kbd> + <kbd>Z</kbd> または <kbd>Cmd</kbd> + <kbd>Y</kbd> |

## UniqueID と組み合わせる

[UniqueID 拡張機能](uniqueid.md)を Collaboration と一緒に使う場合は、共同編集のプロバイダーの同期が終わってからエディタをマウントしてください。初期化の順序を誤ると、消えない空の段落がドキュメントに残ることがあります。詳しくは [UniqueID: Collaboration と組み合わせる](uniqueid.md#usage-with-collaboration)を参照してください。

## ソースコード

[packages/extension-collaboration/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-collaboration/)

## できました！

これでエディタが共同編集に対応しました。友達を招待して、一緒に入力してみましょう 🙌🏻 共同編集の機能をさらに作り込みたい場合は、フルホスト型やオンプレミス型の共同編集サーバーについて [Tiptap Collaboration のドキュメント](https://tiptap.dev/docs/collaboration/getting-started/overview)を参照してください。

## Collaboration

シートベルトを締めてください。Tiptap Collaboration で、リッチテキストエディタを共同編集に対応させましょう。

- あらゆるものがリアルタイム
- オフラインファーストで、競合が起きない
- 当社によるマネージドホスティングにも、オンプレミスにも対応

[詳しく見る](https://tiptap.dev/docs/collaboration/getting-started/overview)
