# Dropcursor 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/dropcursor](https://tiptap.dev/docs/editor/extensions/functionality/dropcursor)

この拡張機能は、Marijn Haverbeke による [ProseMirror Dropcursor プラグイン](https://github.com/ProseMirror/prosemirror-dropcursor)を読み込みます。エディタに何かをドラッグしたとき、ドロップ先の位置にカーソルを表示するプラグインです。

Tiptap はヘッドレスですが、ドロップカーソルの見た目には CSS が必要です。色と幅は設定で指定でき、独自の CSS クラスを追加することもできます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/Dropcursor)

## インストール

```bash
npm install @tiptap/extensions
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import { Dropcursor } from '@tiptap/extensions'

new Editor({
  extensions: [Dropcursor],
})
```

## 設定

### color

ドロップカーソルの色です。

デフォルト: `'currentColor'`

```js
Dropcursor.configure({
  color: '#ff0000',
})
```

### width

ドロップカーソルの幅です。

デフォルト: `1`

```js
Dropcursor.configure({
  width: 2,
})
```

### class

ドロップカーソルに適用する CSS クラスです。1つでも複数でも指定できます。

```js
Dropcursor.configure({
  class: 'my-custom-class',
})
```

## ソースコード

[packages/extensions/src/drop-cursor/](https://github.com/ueberdosis/tiptap/blob/main/packages/extensions/src/drop-cursor/)

## 最小構成でのインストール

```js
import { Editor } from '@tiptap/core'
import { Dropcursor } from '@tiptap/extensions/dropcursor'

new Editor({
  extensions: [Dropcursor],
})
```
