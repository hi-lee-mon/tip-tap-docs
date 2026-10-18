# Gapcursor 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/gapcursor](https://tiptap.dev/docs/editor/extensions/functionality/gapcursor)

この拡張機能は、Marijn Haverbeke による [ProseMirror Gapcursor プラグイン](https://github.com/ProseMirror/prosemirror-gapcursor)を読み込みます。通常の選択ができない場所に、カーソルを置くための隙間を作るプラグインです。たとえば、ドキュメント末尾にある表の後ろがこれに当たります。

Tiptap はヘッドレスですが、ギャップカーソルの見た目には CSS が必要です。[デフォルトの CSS](https://github.com/ueberdosis/tiptap/tree/main/packages/core/src/style.ts) は Editor クラスが読み込みます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Gapcursor)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { Gapcursor } from '@tiptap/extensions'

new Editor({
  extensions: [Gapcursor],
})
```

## ソースコード

[packages/extensions/src/gap-cursor/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/gap-cursor/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Gapcursor } from '@tiptap/extensions/gapcursor'

new Editor({
  extensions: [Gapcursor],
})
```
